"""Operational risk summaries for proposed commands."""
from __future__ import annotations

from dauglas.safety_engine import SafetyClass, classify_command


def assess_commands(commands: list[str]) -> dict[str, object]:
    assessed = [{"command": command, "classification": classify_command(command).value} for command in commands]
    safe = all(item["classification"] == SafetyClass.READ_ONLY.value for item in assessed)
    return {"commands": assessed, "v0_1_recommendable": safe, "requires_approval": not safe}
