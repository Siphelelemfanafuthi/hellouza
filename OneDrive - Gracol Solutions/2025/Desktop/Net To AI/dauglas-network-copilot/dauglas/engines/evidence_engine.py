"""Normalize parser output into deterministic, traceable evidence records."""
from __future__ import annotations

from typing import Any

from dauglas.models.evidence import EvidenceRecord, EvidenceSource, EvidenceStatus


_FIELDS = (
    "interface", "physical_state", "protocol_state", "speed_mbps", "duplex",
    "input_errors", "crc_errors", "output_errors", "last_physical_up_time",
    "last_physical_down_time", "port_mode", "pvid", "allowed_vlans",
    "transceiver_type", "rx_optical_power_dbm", "tx_optical_power_dbm",
    "link_flaps_detected",
)


def _source_for(field: str, parsed: dict[str, Any]) -> str:
    label = field.replace("_", " ").title()
    for fact in parsed.get("facts", []):
        if fact.get("statement", "").startswith(label):
            return fact.get("source", "Command output")
    if field == "interface":
        for fact in parsed.get("facts", []):
            if " has physical state " in fact.get("statement", ""):
                return fact.get("source", "Command output")
    if field == "link_flaps_detected":
        for fact in parsed.get("facts", []):
            if "link-state transitions" in fact.get("statement", ""):
                return fact.get("source", "Syslog")
    return "Command output"


def normalize_evidence(incident: Any, parsed: dict[str, Any]) -> list[EvidenceRecord]:
    records: list[EvidenceRecord] = []

    def add(source: EvidenceSource, fact: str, value: Any, status: EvidenceStatus, reference: str, unit: str | None = None, interface: str | None = None) -> None:
        records.append(EvidenceRecord(f"EV-{len(records) + 1:04d}", source, incident.vendor, incident.device_model or None, interface or parsed.get("interface"), fact, value, status, reference, unit=unit))

    for field in _FIELDS:
        value = parsed.get(field)
        if value is None or value is False or value == []:
            continue
        source = EvidenceSource.SYSLOG if field == "link_flaps_detected" else EvidenceSource.COMMAND_OUTPUT
        unit = "Mbps" if field == "speed_mbps" else "dBm" if field.endswith("_dbm") else None
        add(source, field, value, EvidenceStatus.CONFIRMED, _source_for(field, parsed), unit)

    for fact in parsed.get("syslog_facts", []):
        statement = fact.get("statement", "")
        if " transitioned to " in statement:
            interface, state = statement.rstrip(".").split(" transitioned to ", 1)
            add(EvidenceSource.SYSLOG, "link_state_transition", state, EvidenceStatus.CONFIRMED, fact.get("source", "Syslog"), interface=interface)

    for label, fact, value in (
        ("Actual behaviour", "reported_actual_behavior", incident.actual_behavior),
        ("Incident description", "reported_incident_description", incident.description),
        ("Engineer notes", "reported_engineer_note", incident.notes),
    ):
        if value.strip():
            add(EvidenceSource.ENGINEER_OBSERVATION, fact, value.strip(), EvidenceStatus.REPORTED_NOT_VERIFIED, label)
    return records


def evidence_values(records: list[EvidenceRecord]) -> dict[str, list[EvidenceRecord]]:
    indexed: dict[str, list[EvidenceRecord]] = {}
    for record in records:
        indexed.setdefault(record.fact, []).append(record)
    return indexed
