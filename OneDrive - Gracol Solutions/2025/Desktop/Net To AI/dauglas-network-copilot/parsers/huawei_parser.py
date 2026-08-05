"""Conservative Huawei CLI parser with evidence provenance."""
from __future__ import annotations

import re
from typing import Any


def _number(pattern: str, line: str) -> int | None:
    match = re.search(pattern, line, re.I)
    return int(match.group(1)) if match else None


def parse_huawei(raw: str) -> dict[str, Any]:
    """Extract only values explicitly present in the current supplied evidence."""
    result: dict[str, Any] = {
        "interface": None,
        "physical_state": None,
        "protocol_state": None,
        "speed_mbps": None,
        "duplex": None,
        "input_errors": None,
        "crc_errors": None,
        "output_errors": None,
        "last_physical_up_time": None,
        "last_physical_down_time": None,
        "port_mode": None,
        "pvid": None,
        "allowed_vlans": None,
        "transceiver_type": None,
        "rx_optical_power_dbm": None,
        "tx_optical_power_dbm": None,
        "link_flaps_detected": False,
        "facts": [],
        "syslog_facts": [],
    }
    up_events: list[tuple[int, str]] = []
    down_events: list[tuple[int, str]] = []
    for line_number, line in enumerate(raw.splitlines(), 1):
        stripped = line.strip()
        interface_match = re.match(
            r"(GigabitEthernet\S+|XGigabitEthernet\S+|Eth-Trunk\S*)\s+"
            r"(up|down|administratively down)\s+(up|down)\b",
            stripped,
            re.I,
        )
        if interface_match:
            interface, physical, protocol = interface_match.groups()
            result.update(interface=interface, physical_state=physical.upper(), protocol_state=protocol.upper())
            result["facts"].append({"statement": f"{interface} has physical state {physical.upper()} and protocol state {protocol.upper()}.", "category": "COMMAND_PROVEN", "source": f"Command output line {line_number}", "confidence": "CONFIRMED"})

        field_patterns = {
            "interface": r"(?i)^Interface\s*[:=]\s*(\S+)",
            "speed_mbps": r"(?i)^Speed\s*[:=]\s*(\d+)",
            "duplex": r"(?i)^Duplex\s*[:=]\s*(\S+)",
            "input_errors": r"(?i)^Input\s+error(?:s)?\s*[:=]\s*(\d+)",
            "crc_errors": r"(?i)^CRC(?:\s+error(?:s)?)?\s*[:=]\s*(\d+)",
            "output_errors": r"(?i)^Output\s+error(?:s)?\s*[:=]\s*(\d+)",
            "last_physical_up_time": r"(?i)^Last\s+physical\s+up\s+time\s*[:=]\s*(.+)",
            "last_physical_down_time": r"(?i)^Last\s+physical\s+down\s+time\s*[:=]\s*(.+)",
            "port_mode": r"(?i)^(?:Port\s+Mode|Link\s+type)\s*[:=]\s*(\S+)",
            "pvid": r"(?i)^PVID\s*[:=]\s*(\d+)",
            "allowed_vlans": r"(?i)^Allowed\s+VLANs?\s*[:=]\s*(.+)",
            "transceiver_type": r"(?i)^(?:Transceiver\s+type|SFP\s+type)\s*[:=]\s*(.+)",
            "rx_optical_power_dbm": r"(?i)^RX\s+(?:optical\s+)?power\s*[:=]\s*(-?\d+(?:\.\d+)?)",
            "tx_optical_power_dbm": r"(?i)^TX\s+(?:optical\s+)?power\s*[:=]\s*(-?\d+(?:\.\d+)?)",
        }
        for field, pattern in field_patterns.items():
            match = re.search(pattern, stripped)
            if match:
                value: Any = match.group(1).strip()
                if field in {"speed_mbps", "input_errors", "crc_errors", "output_errors", "pvid"}:
                    value = int(value)
                elif field in {"rx_optical_power_dbm", "tx_optical_power_dbm"}:
                    value = float(value)
                result[field] = value
                result["facts"].append({"statement": f"{field.replace('_', ' ').title()} is {value}.", "category": "COMMAND_PROVEN", "source": f"Command output line {line_number}", "confidence": "CONFIRMED"})

        syslog = re.search(r"(?i)(GigabitEthernet\S+|XGigabitEthernet\S+).*?(?:physical|PHY_)?(?:state\s+)?(?:changed\s+to\s+)?(UP|DOWN)\b", stripped)
        if syslog and ("log" in raw.lower() or "PHY_" in stripped.upper() or re.match(r"(?:\w{3}\s+\d|\d{4}-\d{2}-\d{2})", stripped)):
            interface, state = syslog.groups()
            event = (line_number, interface)
            (up_events if state.upper() == "UP" else down_events).append(event)
            result["syslog_facts"].append({"statement": f"{interface} transitioned to {state.upper()}.", "category": "SYSLOG_PROVEN", "source": f"Syslog line {line_number}", "confidence": "CONFIRMED"})

    result["link_flaps_detected"] = bool(up_events and down_events) or (len(up_events) + len(down_events) >= 2)
    if result["link_flaps_detected"]:
        lines = sorted(number for number, _ in up_events + down_events)
        result["facts"].append({"statement": "Repeated physical link-state transitions are present in the supplied logs.", "category": "SYSLOG_PROVEN", "source": f"Syslog lines {lines[0]}–{lines[-1]}", "confidence": "CONFIRMED"})
    return result
