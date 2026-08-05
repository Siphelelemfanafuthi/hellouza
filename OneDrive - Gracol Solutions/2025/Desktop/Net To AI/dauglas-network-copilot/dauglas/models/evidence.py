"""Normalized evidence and reasoning records."""
from __future__ import annotations

from dataclasses import asdict, dataclass
from enum import Enum
from typing import Any


class EvidenceSource(str, Enum):
    COMMAND_OUTPUT = "COMMAND_OUTPUT"
    SYSLOG = "SYSLOG"
    ENGINEER_OBSERVATION = "ENGINEER_OBSERVATION"
    MANUAL_TEST = "MANUAL_TEST"


class EvidenceStatus(str, Enum):
    CONFIRMED = "CONFIRMED"
    REPORTED_NOT_VERIFIED = "REPORTED_NOT_VERIFIED"
    UNKNOWN = "UNKNOWN"


@dataclass(frozen=True)
class EvidenceRecord:
    evidence_id: str
    source_type: EvidenceSource
    vendor: str
    device: str | None
    interface: str | None
    fact: str
    value: Any
    status: EvidenceStatus
    source_reference: str
    timestamp: str | None = None
    unit: str | None = None

    def to_dict(self) -> dict[str, Any]:
        data = asdict(self)
        data["source_type"] = self.source_type.value
        data["status"] = self.status.value
        return data


@dataclass(frozen=True)
class Contradiction:
    contradiction_id: str
    statement: str
    evidence_ids: tuple[str, ...]
    severity: str = "WARNING"

    def to_dict(self) -> dict[str, Any]:
        data = asdict(self)
        data["evidence_ids"] = list(self.evidence_ids)
        return data
