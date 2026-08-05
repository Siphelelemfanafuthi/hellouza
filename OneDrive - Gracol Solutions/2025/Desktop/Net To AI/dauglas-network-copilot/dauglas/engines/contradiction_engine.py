"""Detect explicit conflicts without converting transients into false conflicts."""
from __future__ import annotations

from dauglas.engines.evidence_engine import evidence_values
from dauglas.models.evidence import Contradiction, EvidenceRecord


def detect_contradictions(evidence: list[EvidenceRecord]) -> list[Contradiction]:
    index = evidence_values(evidence)
    contradictions: list[Contradiction] = []
    speed = index.get("speed_mbps", [])
    optics = index.get("transceiver_type", [])
    if speed and optics:
        described = str(optics[-1].value).lower()
        expected_speed = 10000 if "10g" in described else 1000 if "1g" in described else None
        if expected_speed and int(speed[-1].value) != expected_speed:
            contradictions.append(Contradiction("CON-0001", f"The interface reports {speed[-1].value} Mbps while the described transceiver appears to be {expected_speed} Mbps. Verify compatibility.", (speed[-1].evidence_id, optics[-1].evidence_id)))
    return contradictions
