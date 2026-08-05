"""Build a sanitized structured case; raw command output never reaches AI."""
from __future__ import annotations

import json
from typing import Any


def build_structured_case(result: dict[str, Any]) -> dict[str, Any]:
    v2 = result.get("diagnostic_engine_v2")
    if v2:
        evidence = [{"evidence_id": item["evidence_id"], "source_type": item["source_type"], "fact": item["fact"], "value": item["value"], "status": item["status"], "source_reference": item["source_reference"]} for item in v2["evidence"]]
        hypotheses = [{"title": item["title"], "score": item["score"], "status": item["status"], "supporting_evidence_ids": item["supporting_evidence_ids"], "missing_evidence": item["missing_evidence"]} for item in v2["hypotheses"]]
        command_ids = sorted({item["command_id"] for item in v2["tests"] if item.get("command_id")})
        selected_test = v2.get("selected_next_test_id")
    else:
        evidence = []
        for index, item in enumerate(result.get("facts", []), 1):
            evidence.append({"evidence_id": f"FACT-{index:04d}", "source_type": item.get("category", "COMMAND_PROVEN"), "fact": "confirmed_statement", "value": item.get("statement", ""), "status": "CONFIRMED", "source_reference": item.get("source", "")})
        for index, item in enumerate(result.get("observations", []), 1):
            evidence.append({"evidence_id": f"OBS-{index:04d}", "source_type": "ENGINEER_OBSERVATION", "fact": "reported_observation", "value": item.get("statement", ""), "status": "REPORTED_NOT_VERIFIED", "source_reference": item.get("source", "")})
        hypotheses = [{"title": item["name"], "score": None, "status": item["confidence"], "supporting_evidence_ids": [], "missing_evidence": item["evidence_required"]} for item in result.get("probable_causes", [])]
        command_ids = []
        selected_test = None
    return {
        "incident_id": result["incident_id"],
        "analysis_id": result["analysis_id"],
        "vendor": result["classification"]["vendor"],
        "device_type": result["classification"]["device_type"],
        "primary_domain": result["classification"]["primary_domain"],
        "root_cause_status": result["root_cause_status"],
        "evidence": evidence,
        "unknowns": result.get("unknowns", []),
        "rule_engine_hypotheses": hypotheses,
        "approved_command_ids": command_ids,
        "selected_deterministic_test_id": selected_test,
    }


def build_operation_prompt(operation: str, case: dict[str, Any]) -> str:
    instructions = {
        "EXPLAIN": "Explain the evidence and supported hypotheses for technical and management audiences. Every technical explanation must cite existing evidence IDs.",
        "CHALLENGE": "Challenge premature conclusions. Identify untested alternatives and one test concept that could disprove the current leading diagnosis. Label alternatives cautiously.",
        "NEXT_BEST_EVIDENCE": "Recommend exactly one highest-value missing evidence request. Prefer evidence that separates the listed hypotheses with low risk. Return only command IDs present in approved_command_ids; an empty list is valid.",
    }
    return f"""You are the controlled DAUGLAS AI Investigator performing {operation}.

BOUNDARIES:
- The structured case is the only source of truth.
- Never create facts, evidence IDs, devices, timestamps, commands, or root-cause status.
- CONFIRMED and REPORTED_NOT_VERIFIED are different and must remain different.
- Cite only evidence_id values present in the case.
- Never output vendor command syntax. Output approved command IDs only when the schema permits it.
- Do not claim a root cause is confirmed.
- Be concise, technical, and explicit about missing proof.

TASK:
{instructions[operation]}

STRUCTURED CASE:
{json.dumps(case, ensure_ascii=False)}

Return only JSON matching the supplied response schema.
"""
