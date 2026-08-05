"""Aggregate deterministic analysis model."""
from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

from dauglas.models.evidence import Contradiction, EvidenceRecord
from dauglas.models.hypothesis import Hypothesis
from dauglas.models.troubleshooting import DiagnosticTest


@dataclass
class DiagnosticAnalysis:
    engine_version: str
    evidence: list[EvidenceRecord]
    hypotheses: list[Hypothesis]
    tests: list[DiagnosticTest]
    selected_next_test_id: str | None
    evidence_graph: dict[str, Any]
    contradictions: list[Contradiction] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return {
            "engine_version": self.engine_version,
            "evidence": [item.to_dict() for item in self.evidence],
            "hypotheses": [item.to_dict() for item in self.hypotheses],
            "tests": [item.to_dict() for item in self.tests],
            "selected_next_test_id": self.selected_next_test_id,
            "evidence_graph": self.evidence_graph,
            "contradictions": [item.to_dict() for item in self.contradictions],
        }
