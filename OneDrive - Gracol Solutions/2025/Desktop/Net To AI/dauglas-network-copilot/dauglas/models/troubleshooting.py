"""Approved command and diagnostic-test models."""
from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any


@dataclass(frozen=True)
class ApprovedCommand:
    command_id: str
    vendor: str
    intent: str
    template: str
    safety: str
    supported_device_types: tuple[str, ...]
    requires_parameters: tuple[str, ...]

    def render(self, parameters: dict[str, str]) -> str:
        missing = [name for name in self.requires_parameters if not parameters.get(name)]
        if missing:
            raise ValueError(f"Missing command parameters: {', '.join(missing)}")
        return self.template.format(**parameters)


@dataclass
class DiagnosticTest:
    test_id: str
    title: str
    purpose: str
    risk: str
    command_id: str | None
    command: str | None
    healthy_result: str
    fault_indication: str
    decision: str
    diagnostic_value: int
    manual: bool = False

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)
