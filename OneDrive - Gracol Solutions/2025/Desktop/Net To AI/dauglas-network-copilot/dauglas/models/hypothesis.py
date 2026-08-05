"""Explainable diagnostic hypothesis model."""
from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass
class Hypothesis:
    hypothesis_id: str
    rule_id: str
    title: str
    domain: str
    score: int
    status: str
    explanation: str
    supporting_evidence_ids: list[str] = field(default_factory=list)
    contradicting_evidence_ids: list[str] = field(default_factory=list)
    missing_evidence: list[str] = field(default_factory=list)
    next_test_ids: list[str] = field(default_factory=list)
    confirmation_requirements: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)
