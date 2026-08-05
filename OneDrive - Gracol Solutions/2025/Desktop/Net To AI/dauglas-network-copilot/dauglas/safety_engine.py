"""Deterministic secret masking and command-safety controls."""
from __future__ import annotations

import re
from enum import Enum


class SafetyClass(str, Enum):
    READ_ONLY = "READ_ONLY"
    LOW_RISK_CHANGE = "LOW_RISK_CHANGE"
    MEDIUM_RISK_CHANGE = "MEDIUM_RISK_CHANGE"
    HIGH_RISK_CHANGE = "HIGH_RISK_CHANGE"
    SERVICE_AFFECTING = "SERVICE_AFFECTING"
    PROHIBITED_IN_V0_1 = "PROHIBITED_IN_V0_1"


_SECRET_PATTERNS = [
    re.compile(r"(?im)(password|passwd|secret|community|api[_ -]?key|token)\s*[:= ]\s*(\S+)"),
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"\b(?:sk|ghp|glpat)_[A-Za-z0-9_-]{16,}\b"),
]


def mask_secrets(text: str) -> tuple[str, int]:
    """Return sanitized text and the number of detected secret patterns."""
    masked, count = text, 0
    for pattern in _SECRET_PATTERNS:
        if "PRIVATE KEY" in pattern.pattern:
            masked, found = pattern.subn("[REDACTED PRIVATE KEY]", masked)
        else:
            masked, found = pattern.subn(lambda m: f"{m.group(1)}: [REDACTED]" if m.lastindex == 2 else "[REDACTED]", masked)
        count += found
    return masked, count


def classify_command(command: str) -> SafetyClass:
    """Classify one network command without executing it."""
    cmd = command.strip().lower()
    if not cmd:
        return SafetyClass.READ_ONLY
    prohibited = ("reboot", "reload", "reset", "erase", "format", "factory-reset")
    service = ("shutdown", "undo shutdown", "clear ", "restart ")
    high = ("firewall", "acl ", "route-policy", "no router", "undo ospf", "undo bgp")
    medium = ("vlan ", "interface ", "ip address ", "undo ", "no ")
    low = ("save", "commit", "write memory")
    read_only = ("display ", "show ", "ping ", "traceroute ", "tracert ")
    if cmd.startswith(prohibited):
        return SafetyClass.PROHIBITED_IN_V0_1
    if cmd.startswith(service):
        return SafetyClass.SERVICE_AFFECTING
    if any(token in cmd for token in high):
        return SafetyClass.HIGH_RISK_CHANGE
    if cmd.startswith(medium):
        return SafetyClass.MEDIUM_RISK_CHANGE
    if cmd.startswith(low):
        return SafetyClass.LOW_RISK_CHANGE
    if cmd.startswith(read_only):
        return SafetyClass.READ_ONLY
    return SafetyClass.PROHIBITED_IN_V0_1


def command_is_recommendable(command: str) -> bool:
    return classify_command(command) == SafetyClass.READ_ONLY
