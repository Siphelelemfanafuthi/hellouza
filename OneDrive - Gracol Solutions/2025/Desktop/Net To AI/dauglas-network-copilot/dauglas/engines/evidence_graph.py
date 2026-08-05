"""Build a serializable graph linking hypotheses to supporting evidence."""
from __future__ import annotations

from typing import Any

from dauglas.models.evidence import EvidenceRecord
from dauglas.models.hypothesis import Hypothesis


def build_evidence_graph(evidence: list[EvidenceRecord], hypotheses: list[Hypothesis]) -> dict[str, Any]:
    nodes = [{"id": item.evidence_id, "type": "EVIDENCE", "label": f"{item.fact}: {item.value}", "status": item.status.value} for item in evidence]
    nodes.extend({"id": item.hypothesis_id, "type": "HYPOTHESIS", "label": item.title, "score": item.score, "status": item.status} for item in hypotheses)
    edges: list[dict[str, str]] = []
    for hypothesis in hypotheses:
        edges.extend({"from": evidence_id, "to": hypothesis.hypothesis_id, "relationship": "SUPPORTS"} for evidence_id in hypothesis.supporting_evidence_ids)
        edges.extend({"from": evidence_id, "to": hypothesis.hypothesis_id, "relationship": "CONTRADICTS"} for evidence_id in hypothesis.contradicting_evidence_ids)
    return {"nodes": nodes, "edges": edges}
