"""Strict JSON schemas for each AI Investigator operation."""
from __future__ import annotations

from typing import Any


EVIDENCE_REFERENCE = {"type": "array", "items": {"type": "string"}, "minItems": 1}

EXPLAIN_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "analysis_summary": {"type": "string"},
        "evidence_explanations": {"type": "array", "items": {"type": "object", "properties": {"evidence_ids": EVIDENCE_REFERENCE, "explanation": {"type": "string"}}, "required": ["evidence_ids", "explanation"], "additionalProperties": False}},
        "technical_summary": {"type": "string"},
        "management_summary": {"type": "string"},
        "limitations": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["analysis_summary", "evidence_explanations", "technical_summary", "management_summary", "limitations"],
    "additionalProperties": False,
}

CHALLENGE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "premature_conclusion": {"type": "string"},
        "challenge_reason": {"type": "string"},
        "evidence_ids": EVIDENCE_REFERENCE,
        "untested_alternatives": {"type": "array", "items": {"type": "object", "properties": {"title": {"type": "string"}, "evidence_ids": EVIDENCE_REFERENCE, "missing_proof": {"type": "array", "items": {"type": "string"}}, "support_level": {"type": "string", "enum": ["POSSIBLE", "WEAKLY_SUPPORTED", "UNSUPPORTED"]}}, "required": ["title", "evidence_ids", "missing_proof", "support_level"], "additionalProperties": False}},
        "disproof_test": {"type": "string"},
        "limitations": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["premature_conclusion", "challenge_reason", "evidence_ids", "untested_alternatives", "disproof_test", "limitations"],
    "additionalProperties": False,
}

NEXT_EVIDENCE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "request": {"type": "string"},
        "reason": {"type": "string"},
        "evidence_ids": EVIDENCE_REFERENCE,
        "separates_hypotheses": {"type": "array", "items": {"type": "string"}},
        "approved_command_ids": {"type": "array", "items": {"type": "string"}, "maxItems": 2},
        "expected_information": {"type": "string"},
        "limitations": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["request", "reason", "evidence_ids", "separates_hypotheses", "approved_command_ids", "expected_information", "limitations"],
    "additionalProperties": False,
}
