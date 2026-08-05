"""Conservative Cisco CLI parser: extract only directly visible facts."""
from __future__ import annotations

import re
from typing import Any


def _number(pattern: str, line: str) -> int | None:
    match = re.search(pattern, line, re.I)
    return int(match.group(1)) if match else None


def parse_cisco(raw: str) -> dict[str, Any]:
    result: dict[str, Any] = {
        "interface": None,
        "interfaces": [],
        "physical_state": None,
        "protocol_state": None,
        "input_errors": None,
        "crc_errors": None,
        "output_errors": None,
        "vlan_statuses": [],
        "facts": [],
        "syslog_facts": [],
        "link_flaps_detected": False,
    }
    up_events: list[int] = []
    down_events: list[int] = []
    for line_number, line in enumerate(raw.splitlines(), 1):
        stripped = line.strip()
        match = re.match(r"\s*(\S+)\s+.*?\b(up|down|administratively down)\s+(up|down)\s*$", stripped, re.I)
        if match:
            name, status, protocol = match.groups()
            result["interfaces"].append(name)
            if not result["interface"]:
                result["interface"] = name
            result.update(physical_state=status.upper(), protocol_state=protocol.upper())
            result["facts"].append({
                "statement": f"Interface {name} has physical state {status.upper()} and protocol state {protocol.upper()}.",
                "category": "COMMAND_PROVEN",
                "source": f"Command output line {line_number}",
                "confidence": "CONFIRMED",
            })
        vlan = re.match(r"\s*(\d+)\s+(\S+)\s+(active|suspended|shutdown)\b", stripped, re.I)
        if vlan:
            result["vlan_statuses"].append({"vlan": int(vlan.group(1)), "name": vlan.group(2), "state": vlan.group(3).upper()})
            result["facts"].append({
                "statement": f"VLAN {vlan.group(1)} ({vlan.group(2)}) is shown as {vlan.group(3).upper()}.",
                "category": "COMMAND_PROVEN",
                "source": f"Command output line {line_number}",
                "confidence": "CONFIRMED",
            })
        input_error = _number(r"(?i)^Input\s+error(?:s)?\s*[:=]\s*(\d+)", stripped)
        if input_error is not None:
            result["input_errors"] = input_error
            result["facts"].append({
                "statement": f"Input errors: {input_error}.",
                "category": "COMMAND_PROVEN",
                "source": f"Command output line {line_number}",
                "confidence": "CONFIRMED",
            })
        crc_error = _number(r"(?i)^CRC(?:\s+error(?:s)?)?\s*[:=]\s*(\d+)", stripped)
        if crc_error is not None:
            result["crc_errors"] = crc_error
            result["facts"].append({
                "statement": f"CRC errors: {crc_error}.",
                "category": "COMMAND_PROVEN",
                "source": f"Command output line {line_number}",
                "confidence": "CONFIRMED",
            })
        output_error = _number(r"(?i)^Output\s+error(?:s)?\s*[:=]\s*(\d+)", stripped)
        if output_error is not None:
            result["output_errors"] = output_error
            result["facts"].append({
                "statement": f"Output errors: {output_error}.",
                "category": "COMMAND_PROVEN",
                "source": f"Command output line {line_number}",
                "confidence": "CONFIRMED",
            })
        syslog_match = re.search(r"(?i)^(?P<intf>\S+).*?(?:line protocol is|changed state to|link (?:down|up)|is (?:up|down)|physical state (?:up|down))\b", stripped)
        if syslog_match:
            interface = syslog_match.group("intf")
            state_match = re.search(r"(?i)\b(up|down)\b", stripped)
            if state_match:
                state = state_match.group(1).upper()
                result["syslog_facts"].append({
                    "statement": f"{interface} transitioned to {state}.",
                    "category": "SYSLOG_PROVEN",
                    "source": f"Syslog line {line_number}",
                    "confidence": "CONFIRMED",
                })
                if state == "UP":
                    up_events.append(line_number)
                else:
                    down_events.append(line_number)
    result["link_flaps_detected"] = bool(up_events and down_events) or (len(up_events) + len(down_events) >= 2)
    if result["link_flaps_detected"]:
        if up_events or down_events:
            indices = sorted(up_events + down_events)
            result["facts"].append({
                "statement": "Repeated physical link-state transitions were detected in the supplied evidence.",
                "category": "SYSLOG_PROVEN",
                "source": f"Evidence lines {indices[0]}–{indices[-1]}",
                "confidence": "CONFIRMED",
            })
    return result
