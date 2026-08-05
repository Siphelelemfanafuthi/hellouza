"""Single, controlled AI Investigator with three explicit operations."""
from __future__ import annotations

from enum import Enum
from typing import Any

from dauglas.ai.local_provider import OllamaProvider
from dauglas.ai.prompt_builder import build_operation_prompt, build_structured_case
from dauglas.ai.provider import AIProvider
from dauglas.ai.schemas import CHALLENGE_SCHEMA, EXPLAIN_SCHEMA, NEXT_EVIDENCE_SCHEMA
from dauglas.validation.ai_output_validator import AIValidationError, validate_ai_output


class InvestigatorOperation(str, Enum):
    EXPLAIN = "EXPLAIN"
    CHALLENGE = "CHALLENGE"
    NEXT_BEST_EVIDENCE = "NEXT_BEST_EVIDENCE"


SCHEMAS = {
    InvestigatorOperation.EXPLAIN: EXPLAIN_SCHEMA,
    InvestigatorOperation.CHALLENGE: CHALLENGE_SCHEMA,
    InvestigatorOperation.NEXT_BEST_EVIDENCE: NEXT_EVIDENCE_SCHEMA,
}


def run_investigator(
    result: dict[str, Any],
    operation: InvestigatorOperation,
    provider: AIProvider | None = None,
) -> dict[str, Any]:
    response: dict[str, Any] = {
        "operation": operation.value,
        "status": "NOT_RUN",
        "provider": getattr(provider, "name", "ollama-local"),
        "model": getattr(provider, "model", "llama3.2:1b"),
        "output": None,
        "rejection_reason": None,
        "deterministic_result_unchanged": True,
    }
    if not result.get("validation", {}).get("passed", False):
        response.update(status="BLOCKED", rejection_reason="Network Truth Engine validation did not pass")
        return response
    case = build_structured_case(result)
    if not case["evidence"]:
        response.update(status="BLOCKED", rejection_reason="No confirmed or reported evidence is available to cite")
        return response
    try:
        active_provider = provider or OllamaProvider()
        raw = active_provider.generate_structured(build_operation_prompt(operation.value, case), SCHEMAS[operation])
        validated = validate_ai_output(operation.value, raw, case)
        response.update(status="ACCEPTED", provider=active_provider.name, model=getattr(active_provider, "model", "approved-provider"), output=validated)
    except (AIValidationError, ValueError, KeyError, TypeError, OSError, TimeoutError) as exc:
        response.update(status="REJECTED", rejection_reason=str(exc)[:800])
    return response
