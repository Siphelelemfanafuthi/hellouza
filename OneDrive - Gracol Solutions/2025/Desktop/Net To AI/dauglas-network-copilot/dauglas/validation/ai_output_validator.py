"""Deterministic validation firewall for AI Investigator responses."""
from __future__ import annotations

from typing import Any

from dauglas.safety_engine import mask_secrets


class AIValidationError(ValueError):
    pass


def _require_string(data: dict[str, Any], key: str, maximum: int = 2400) -> str:
    value = data.get(key)
    if not isinstance(value, str) or not value.strip() or len(value) > maximum:
        raise AIValidationError(f"Field {key} is missing, empty, or too long")
    return value.strip()


def _all_strings(value: Any):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for nested in value.values():
            yield from _all_strings(nested)
    elif isinstance(value, list):
        for nested in value:
            yield from _all_strings(nested)


def validate_ai_output(operation: str, output: Any, case: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(output, dict):
        raise AIValidationError("AI output is not a JSON object")
    evidence_ids = {item["evidence_id"] for item in case["evidence"]}
    approved_commands = set(case["approved_command_ids"])
    if not evidence_ids:
        raise AIValidationError("No evidence exists for an evidence-cited AI investigation")

    citation_fields: list[list[str]] = []
    if operation == "EXPLAIN":
        required = {"analysis_summary", "evidence_explanations", "technical_summary", "management_summary", "limitations"}
        if set(output) != required or not isinstance(output["evidence_explanations"], list):
            raise AIValidationError("Explainer output does not match the strict schema")
        for key in ("analysis_summary", "technical_summary", "management_summary"):
            _require_string(output, key)
        for item in output["evidence_explanations"]:
            _require_string(item, "explanation")
            citation_fields.append(item.get("evidence_ids", []))
    elif operation == "CHALLENGE":
        required = {"premature_conclusion", "challenge_reason", "evidence_ids", "untested_alternatives", "disproof_test", "limitations"}
        if set(output) != required or not isinstance(output["untested_alternatives"], list):
            raise AIValidationError("Challenger output does not match the strict schema")
        for key in ("premature_conclusion", "challenge_reason", "disproof_test"):
            _require_string(output, key)
        citation_fields.append(output.get("evidence_ids", []))
        for item in output["untested_alternatives"]:
            if item.get("support_level") not in {"POSSIBLE", "WEAKLY_SUPPORTED", "UNSUPPORTED"}:
                raise AIValidationError("AI alternative has an invalid support level")
            _require_string(item, "title", 300)
            citation_fields.append(item.get("evidence_ids", []))
    elif operation == "NEXT_BEST_EVIDENCE":
        required = {"request", "reason", "evidence_ids", "separates_hypotheses", "approved_command_ids", "expected_information", "limitations"}
        if set(output) != required:
            raise AIValidationError("Next-evidence output does not match the strict schema")
        for key in ("request", "reason", "expected_information"):
            _require_string(output, key)
        citation_fields.append(output.get("evidence_ids", []))
        commands = output.get("approved_command_ids")
        if not isinstance(commands, list) or not set(commands).issubset(approved_commands):
            unknown = set(commands or []) - approved_commands
            raise AIValidationError(f"AI referenced unapproved command IDs: {', '.join(sorted(unknown))}")
        existing_hypotheses = {item["title"] for item in case["rule_engine_hypotheses"]}
        if not set(output.get("separates_hypotheses", [])).issubset(existing_hypotheses):
            raise AIValidationError("AI referenced a hypothesis not present in the deterministic analysis")
    else:
        raise AIValidationError("Unknown AI operation")

    for citations in citation_fields:
        if not isinstance(citations, list) or not citations:
            raise AIValidationError("An AI claim has no evidence citation")
        unknown = set(citations) - evidence_ids
        if unknown:
            raise AIValidationError(f"AI referenced evidence that does not exist: {', '.join(sorted(unknown))}")
    for text in _all_strings(output):
        _, secret_count = mask_secrets(text)
        if secret_count:
            raise AIValidationError("AI output contains a secret-like value")
        if text.strip().lower().startswith(("display ", "show ", "undo ", "interface ", "reboot", "shutdown")):
            raise AIValidationError("AI output contains free-form command syntax")
    return output
