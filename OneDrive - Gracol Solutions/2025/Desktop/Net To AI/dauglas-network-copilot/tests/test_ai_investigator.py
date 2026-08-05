from typing import Any

from dauglas.ai.investigator import InvestigatorOperation, run_investigator
from dauglas.ai.prompt_builder import build_structured_case
from dauglas.incident_engine import Incident, analyze_incident


class FakeProvider:
    name = "test-provider"
    model = "test-model"

    def __init__(self, output: dict[str, Any]):
        self.output = output

    def generate_structured(self, prompt: str, schema: dict[str, Any]) -> dict[str, Any]:
        assert "raw command output" not in prompt.lower()
        assert schema["type"] == "object"
        return self.output


def _physical_result():
    incident = Incident(
        title="Huawei fibre uplink flapping", vendor="Huawei", device_type="Switch",
        description="Physical fibre uplink instability",
        evidence="GigabitEthernet0/0/24 DOWN DOWN\nCRC: 89\n2026-08-05 GigabitEthernet0/0/24 physical state UP\n2026-08-05 GigabitEthernet0/0/24 physical state DOWN",
        notes="Optical loss is suspected but not verified.",
    )
    return analyze_incident(incident)


def test_explainer_accepts_valid_evidence_citations_without_changing_truth() -> None:
    result = _physical_result()
    evidence_id = result["diagnostic_engine_v2"]["evidence"][0]["evidence_id"]
    provider = FakeProvider({
        "analysis_summary": "The supplied evidence confirms physical instability.",
        "evidence_explanations": [{"evidence_ids": [evidence_id], "explanation": "This record establishes the affected interface."}],
        "technical_summary": "Physical instability is supported; component failure remains unconfirmed.",
        "management_summary": "The uplink is unstable and further low-risk evidence is required.",
        "limitations": ["No verified optical thresholds were supplied."],
    })
    before_status = result["root_cause_status"]
    response = run_investigator(result, InvestigatorOperation.EXPLAIN, provider)
    assert response["status"] == "ACCEPTED"
    assert response["deterministic_result_unchanged"]
    assert result["root_cause_status"] == before_status == "UNCONFIRMED"


def test_unknown_evidence_reference_is_rejected() -> None:
    result = _physical_result()
    provider = FakeProvider({
        "analysis_summary": "Unsupported.",
        "evidence_explanations": [{"evidence_ids": ["EV-9999"], "explanation": "Invented evidence."}],
        "technical_summary": "Unsupported.", "management_summary": "Unsupported.", "limitations": ["None"],
    })
    response = run_investigator(result, InvestigatorOperation.EXPLAIN, provider)
    assert response["status"] == "REJECTED"
    assert "does not exist" in response["rejection_reason"]


def test_unapproved_command_id_is_rejected() -> None:
    result = _physical_result()
    case = build_structured_case(result)
    evidence_id = case["evidence"][0]["evidence_id"]
    hypothesis = case["rule_engine_hypotheses"][0]["title"]
    provider = FakeProvider({
        "request": "Collect detailed interface evidence.", "reason": "It separates current hypotheses.",
        "evidence_ids": [evidence_id], "separates_hypotheses": [hypothesis],
        "approved_command_ids": ["INVENTED-COMMAND"], "expected_information": "Current counters.",
        "limitations": ["No remote evidence."],
    })
    response = run_investigator(result, InvestigatorOperation.NEXT_BEST_EVIDENCE, provider)
    assert response["status"] == "REJECTED"
    assert "unapproved command" in response["rejection_reason"].lower()


def test_free_form_command_syntax_is_rejected() -> None:
    result = _physical_result()
    evidence_id = result["diagnostic_engine_v2"]["evidence"][0]["evidence_id"]
    provider = FakeProvider({
        "premature_conclusion": "Damaged fibre is premature.", "challenge_reason": "display interface GigabitEthernet0/0/24",
        "evidence_ids": [evidence_id], "untested_alternatives": [], "disproof_test": "Compare controlled measurements.",
        "limitations": ["Component proof is absent."],
    })
    response = run_investigator(result, InvestigatorOperation.CHALLENGE, provider)
    assert response["status"] == "REJECTED"
    assert "free-form command" in response["rejection_reason"]


def test_structured_case_excludes_raw_evidence_text() -> None:
    result = _physical_result()
    case = build_structured_case(result)
    assert "incident" not in case
    assert "sanitized evidence" not in case
    assert all("evidence" not in item or isinstance(item, dict) for item in case["evidence"])
