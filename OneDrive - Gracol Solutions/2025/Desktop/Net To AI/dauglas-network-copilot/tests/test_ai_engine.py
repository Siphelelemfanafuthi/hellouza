from dauglas.ai_engine import enhance_with_local_ai
from dauglas.incident_engine import Incident, analyze_incident


def _result():
    return analyze_incident(Incident(title="VLAN trunk mismatch", vendor="Huawei", device_type="Switch", description="Tagged VLAN 240 is missing from the trunk"))


def test_ai_can_only_rank_existing_causes() -> None:
    result = _result()
    cause = result["probable_causes"][0]["name"]

    def valid_generator(prompt: str, model: str):
        assert "never add or rename" in prompt.lower()
        return {"summary": "The current evidence supports checking the deterministic VLAN hypothesis.", "ranked_causes": [{"name": cause, "explanation": "The supplied description identifies a tagged VLAN issue, but endpoint configurations remain unknown.", "confidence": "POSSIBLE"}], "additional_questions": ["What is the remote trunk configuration?"]}

    enhanced = enhance_with_local_ai(result, generator=valid_generator)
    assert enhanced["ai_enhancement"]["status"] == "APPLIED"
    assert enhanced["facts"] == result["facts"]
    assert enhanced["root_cause_status"] == "UNCONFIRMED"


def test_ai_invented_cause_is_rejected() -> None:
    result = _result()

    def unsafe_generator(prompt: str, model: str):
        return {"summary": "Invented conclusion", "ranked_causes": [{"name": "Malware", "explanation": "Unsupported.", "confidence": "STRONGLY_SUPPORTED"}], "additional_questions": []}

    enhanced = enhance_with_local_ai(result, generator=unsafe_generator)
    assert enhanced["ai_enhancement"]["status"] == "FALLBACK"
    assert enhanced["probable_causes"] == result["probable_causes"]


def test_ai_is_blocked_when_validation_fails() -> None:
    result = _result()
    result["validation"] = {"passed": False, "errors": ["test"]}
    called = False

    def generator(prompt: str, model: str):
        nonlocal called
        called = True
        return {}

    enhanced = enhance_with_local_ai(result, generator=generator)
    assert enhanced["ai_enhancement"]["status"] == "BLOCKED"
    assert not called
