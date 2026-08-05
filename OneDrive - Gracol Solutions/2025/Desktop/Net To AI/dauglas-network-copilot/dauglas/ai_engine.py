"""Guarded local-AI enhancement layered behind deterministic controls."""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from typing import Any, Callable

from dauglas.incident_engine import Incident, analyze_incident

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
ALLOWED_AI_CONFIDENCE = {"STRONGLY_SUPPORTED", "POSSIBLE", "WEAKLY_SUPPORTED", "UNSUPPORTED"}


def _build_prompt(result: dict[str, Any]) -> str:
    payload = {
        "fault_domain": result["classification"]["primary_domain"],
        "device_type": result["classification"]["device_type"],
        "confirmed_facts": [{"statement": f["statement"], "source": f["source"]} for f in result["facts"]],
        "engineer_observations": [o["statement"] for o in result["observations"]],
        "existing_causes": [{"name": c["name"], "confidence": c["confidence"], "supporting_evidence": c["supporting_evidence"], "evidence_required": c["evidence_required"]} for c in result["probable_causes"]],
        "unknowns": result["unknowns"],
    }
    return f"""You are the advisory explanation layer for DAUGLAS Network Copilot.
The deterministic engine below is authoritative.

STRICT RULES:
1. Use only the supplied confirmed facts and engineer observations.
2. Never turn an observation into a confirmed fact.
3. Rank only cause names already present in existing_causes; never add or rename one.
4. Do not propose commands, configuration changes, fixes, facts, fault domains, or root-cause status.
5. Missing evidence remains missing. Use cautious language.
6. Return JSON only with this exact shape:
{{"summary":"...","ranked_causes":[{{"name":"exact existing name","explanation":"...","confidence":"POSSIBLE"}}],"additional_questions":["..."]}}
Allowed confidence values: STRONGLY_SUPPORTED, POSSIBLE, WEAKLY_SUPPORTED, UNSUPPORTED.

CURRENT DETERMINISTIC ANALYSIS:
{json.dumps(payload, ensure_ascii=False)}
"""


def _ollama_generate(prompt: str, model: str, timeout: int = 90) -> dict[str, Any]:
    body = json.dumps({"model": model, "prompt": prompt, "stream": False, "format": "json", "options": {"temperature": 0.1}}).encode("utf-8")
    request = urllib.request.Request(OLLAMA_URL, data=body, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(request, timeout=timeout) as response:
        envelope = json.loads(response.read().decode("utf-8"))
    return json.loads(envelope["response"])


def _validate_ai_response(response: Any, result: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(response, dict):
        raise ValueError("Local model response is not a JSON object.")
    summary = response.get("summary")
    ranked = response.get("ranked_causes")
    questions = response.get("additional_questions", [])
    if not isinstance(summary, str) or not summary.strip() or len(summary) > 1800:
        raise ValueError("Local model summary is missing or too long.")
    if not isinstance(ranked, list) or not isinstance(questions, list):
        raise ValueError("Local model response lists are invalid.")
    allowed_names = {cause["name"] for cause in result["probable_causes"]}
    seen: set[str] = set()
    cleaned: list[dict[str, str]] = []
    for item in ranked:
        if not isinstance(item, dict):
            raise ValueError("A ranked cause is not an object.")
        name, explanation, confidence = item.get("name"), item.get("explanation"), item.get("confidence")
        if name not in allowed_names or name in seen:
            raise ValueError("The local model added, renamed, or duplicated a cause.")
        if not isinstance(explanation, str) or not explanation.strip() or len(explanation) > 1200:
            raise ValueError("A local model explanation is invalid.")
        if confidence not in ALLOWED_AI_CONFIDENCE:
            raise ValueError("The local model returned an unsupported confidence label.")
        seen.add(name)
        cleaned.append({"name": name, "explanation": explanation.strip(), "confidence": confidence})
    if seen != allowed_names:
        raise ValueError("The local model omitted one or more deterministic causes.")
    clean_questions = [question.strip() for question in questions if isinstance(question, str) and question.strip()][:8]
    return {"summary": summary.strip(), "ranked_causes": cleaned, "additional_questions": clean_questions}


def enhance_with_local_ai(
    result: dict[str, Any],
    model: str = "llama3.2:1b",
    generator: Callable[[str, str], dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Return a copy with advisory AI output; deterministic fields stay untouched."""
    enhanced = dict(result)
    ai = {"enabled": True, "model": model, "status": "NOT_RUN", "advisory_only": True, "output": None, "error": None}
    enhanced["ai_enhancement"] = ai
    if not result.get("validation", {}).get("passed", False):
        ai.update(status="BLOCKED", error="Deterministic analysis validation did not pass.")
        return enhanced
    try:
        raw = (generator or _ollama_generate)(_build_prompt(result), model)
        ai.update(status="APPLIED", output=_validate_ai_response(raw, result))
    except (ValueError, KeyError, json.JSONDecodeError, urllib.error.URLError, TimeoutError, OSError) as exc:
        ai.update(status="FALLBACK", error=str(exc)[:500])
    return enhanced


def analyze(incident: Incident, use_local_ai: bool = False, model: str = "llama3.2:1b") -> dict[str, Any]:
    """Always run deterministic analysis first; optionally enhance its narrative."""
    result = analyze_incident(incident)
    if use_local_ai:
        return enhance_with_local_ai(result, model)
    result["ai_enhancement"] = {"enabled": False, "model": None, "status": "DISABLED", "advisory_only": True, "output": None, "error": None}
    return result
