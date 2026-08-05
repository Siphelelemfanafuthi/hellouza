"""Minimal syslog severity extraction."""
from __future__ import annotations

import re


def parse_syslog(raw: str) -> list[dict[str, str]]:
    events: list[dict[str, str]] = []
    for line in raw.splitlines():
        if re.search(r"(?i)(error|critical|warning|down|failed|denied)", line):
            severity = "critical" if re.search(r"(?i)(critical|fatal)", line) else "warning" if re.search(r"(?i)warning", line) else "error"
            events.append({"severity": severity, "message": line.strip()})
    return events[:100]
