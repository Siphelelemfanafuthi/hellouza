"""Isolated, evidence-led incident classification and analysis."""
from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any
from uuid import uuid4

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover
    ZoneInfo = None

from dauglas.safety_engine import SafetyClass, classify_command, mask_secrets
from parsers.cisco_parser import parse_cisco
from parsers.huawei_parser import parse_huawei
from parsers.syslog_parser import parse_syslog


class FaultDomain(str, Enum):
    PHYSICAL_LINK = "PHYSICAL_LINK"
    FIBRE_OPTICS = "FIBRE_OPTICS"
    INTERFACE_ERRORS = "INTERFACE_ERRORS"
    VLAN_TRUNKING = "VLAN_TRUNKING"
    ROUTING = "ROUTING"
    DHCP = "DHCP"
    WLAN_REGISTRATION = "WLAN_REGISTRATION"
    FIREWALL_REACHABILITY = "FIREWALL_REACHABILITY"
    UNKNOWN = "UNKNOWN"


class RootCauseStatus(str, Enum):
    UNCONFIRMED = "UNCONFIRMED"
    LIKELY = "LIKELY"
    SUPPORTED_BY_EVIDENCE = "SUPPORTED_BY_EVIDENCE"
    CONFIRMED = "CONFIRMED"
    RESOLVED_AND_VALIDATED = "RESOLVED_AND_VALIDATED"


@dataclass
class Incident:
    title: str
    client_alias: str = ""
    vendor: str = "Vendor-neutral"
    device_type: str = "Unknown"
    device_model: str = ""
    expected_behavior: str = ""
    actual_behavior: str = ""
    last_known_working: str = ""
    description: str = ""
    evidence: str = ""
    notes: str = ""
    service_impact: str = ""
    technical_domain: str = "Auto-detect"
    network_layer: str = "Auto-detect"
    affected_interface: str = ""
    upstream_device: str = ""

    def sanitized(self) -> tuple["Incident", int]:
        values, count = asdict(self), 0
        for key, value in values.items():
            values[key], found = mask_secrets(value)
            count += found
        return Incident(**values), count


@dataclass
class Cause:
    name: str
    confidence: str
    why: str
    supporting_evidence: list[str] = field(default_factory=list)
    conflicting_evidence: list[str] = field(default_factory=list)
    evidence_required: list[str] = field(default_factory=list)


@dataclass
class TestStep:
    test: str
    why: str
    command: str
    healthy_result: str
    faulty_result: str
    next_action: str
    safety: str = "READ_ONLY"
    test_type: str = "COMMAND"


def _contains(text: str, *terms: str) -> bool:
    return any(term in text for term in terms)


def classify_fault_domain(incident: Incident, parsed: dict[str, Any]) -> tuple[FaultDomain, list[FaultDomain]]:
    """Classify using weighted, incident-local evidence; return UNKNOWN on weak evidence."""
    core = " ".join([incident.title, incident.expected_behavior, incident.actual_behavior, incident.description]).lower()
    all_text = " ".join([core, incident.evidence.lower(), incident.notes.lower()])
    device = incident.device_type.lower()
    scores = {domain: 0 for domain in FaultDomain if domain is not FaultDomain.UNKNOWN}

    if _contains(core, "uplink", "link flap", "flapping", "physical up", "physical down"):
        scores[FaultDomain.PHYSICAL_LINK] += 8
    if parsed.get("link_flaps_detected"):
        scores[FaultDomain.PHYSICAL_LINK] += 10
    if _contains(all_text, "fibre", "fiber", "optical", "sfp", "transceiver", "rx power", "tx power"):
        scores[FaultDomain.FIBRE_OPTICS] += 6
    if any((parsed.get(key) or 0) > 0 for key in ("input_errors", "crc_errors", "output_errors")) or _contains(all_text, "crc", "input error", "output error"):
        scores[FaultDomain.INTERFACE_ERRORS] += 7
    if _contains(core, "vlan", "trunk", "tagged", "untagged", "pvid") or any(parsed.get(key) is not None for key in ("pvid", "allowed_vlans", "port_mode")):
        scores[FaultDomain.VLAN_TRUNKING] += 7
    if _contains(core, "route", "routing", "ospf", "bgp", "no route"):
        scores[FaultDomain.ROUTING] += 7
    if _contains(core, "dhcp", "no ip address", "address allocation", "lease"):
        scores[FaultDomain.DHCP] += 7
    if _contains(core, "ap registration", "not registering", "wac", "fit ap", "controller discovery"):
        scores[FaultDomain.WLAN_REGISTRATION] += 8
    if device in {"wac", "ap"} and _contains(core, "offline", "register"):
        scores[FaultDomain.WLAN_REGISTRATION] += 5
    if _contains(core, "firewall", "policy denied", "acl deny", "blocked port"):
        scores[FaultDomain.FIREWALL_REACHABILITY] += 7
    if device == "switch":
        scores[FaultDomain.WLAN_REGISTRATION] = max(0, scores[FaultDomain.WLAN_REGISTRATION] - 5)
    if device == "firewall":
        scores[FaultDomain.FIREWALL_REACHABILITY] += 3

    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] < 5:
        return FaultDomain.UNKNOWN, []
    primary = ranked[0][0]
    secondary = [domain for domain, score in ranked[1:] if score >= 5 and domain != primary][:3]
    return primary, secondary


def _step(test: str, why: str, command: str, healthy: str, faulty: str, next_action: str, test_type: str = "COMMAND") -> TestStep:
    safety = classify_command(command).value if command else SafetyClass.READ_ONLY.value
    return TestStep(test, why, command, healthy, faulty, next_action, safety, test_type)


def _physical_analysis(incident: Incident, parsed: dict[str, Any], facts: list[dict[str, str]]) -> tuple[list[Cause], list[str], list[TestStep]]:
    interface = parsed.get("interface") or "<affected-interface>"
    support = [fact["statement"] for fact in facts if fact["category"] in {"COMMAND_PROVEN", "SYSLOG_PROVEN"}]
    causes = [
        Cause("Fibre signal degradation", "STRONGLY_SUPPORTED" if parsed.get("link_flaps_detected") and (parsed.get("crc_errors") or 0) > 0 else "POSSIBLE", "Physical instability with interface errors can indicate optical-path degradation.", support, [], ["Measured local and remote RX/TX optical power", "Transceiver alarm thresholds", "Power-meter or OTDR result"]),
        Cause("Dirty, damaged, or poorly seated fibre connector", "POSSIBLE", "Connector contamination or seating can cause intermittent loss and CRC errors.", support, [], ["Connector inspection and cleaning result", "Before/after optical reading"]),
        Cause("Failing or incompatible SFP module", "POSSIBLE", "An unstable or mismatched transceiver can cause repeated physical transitions.", support, [], ["SFP vendor and part number", "Wavelength and media type", "Remote SFP details"]),
        Cause("Damaged patch lead, splice, or fibre strand", "POSSIBLE", "A passive-path defect can create intermittent loss.", support, [], ["Replacement patch-lead test", "OTDR trace or loss measurement"]),
        Cause("Remote port or remote SFP instability", "POSSIBLE", "The far end can produce the same local symptoms.", support, [], ["Remote interface statistics", "Remote logs", "Remote transceiver diagnostics"]),
    ]
    unknowns = list(dict.fromkeys(item for cause in causes for item in cause.evidence_required))
    steps = [
        _step("Confirm flap frequency", "Establish whether physical transitions repeat and when.", f"display logbuffer | include {interface}", "No repeated physical UP/DOWN events.", "Repeated UP/DOWN events are present.", "Correlate timestamps with both link endpoints."),
        _step("Inspect detailed interface statistics", "Check state, speed, duplex, and whether error counters increase.", f"display interface {interface}", "Stable UP state with no increasing errors.", "DOWN/flapping state or increasing CRC/input errors.", "Record counters, wait a controlled interval, and compare."),
        _step("Examine transceiver diagnostics", "Check RX/TX power, temperature, voltage, and alarm thresholds.", "", "Values remain inside vendor thresholds.", "Values breach thresholds or fluctuate.", "Confirm the read-only diagnostic command from documentation for this exact Huawei model and software version before running it.", "MODEL_SPECIFIC"),
        _step("Identify the remote neighbour", "Identify the far-end device and port when LLDP is enabled.", f"display lldp neighbor interface {interface} verbose", "Expected neighbour and port are stable.", "Neighbour is absent or repeatedly changes.", "Run equivalent read-only checks at the remote endpoint."),
        _step("Inspect and clean the fibre path", "Eliminate contamination and poor seating.", "", "Connectors are clean, seated, and the link stabilizes.", "Damage/contamination is found or instability remains.", "Measure power before and after; record results.", "MANUAL"),
        _step("Substitute one component at a time", "Isolate the failed patch lead, SFP, or strand.", "", "A single substitution identifies the failing component.", "Instability persists after each controlled substitution.", "Do not change multiple components simultaneously.", "MANUAL"),
        _step("Perform optical testing", "Quantify loss and locate fibre-path defects.", "", "Loss is within the engineered budget.", "Excess loss or a reflective event is measured.", "Use a power meter, VFL where appropriate, or OTDR.", "MANUAL"),
    ]
    return causes, unknowns, steps


def _wlan_analysis(facts: list[dict[str, str]]) -> tuple[list[Cause], list[str], list[TestStep]]:
    support = [fact["statement"] for fact in facts]
    specs = [
        ("AP operating-mode mismatch", "AP mode", "display ap all"),
        ("Incorrect or missing DHCP Option 43/148", "DHCP Option 43/148 values", "display current-configuration | include option"),
        ("WAC management address unreachable", "AP-to-WAC reachability", "ping <WAC-management-IP>"),
        ("AP authorization failure", "AP authorization state", "display ap all"),
        ("Insufficient WAC licence capacity", "WAC licence usage", "display license"),
    ]
    causes = [Cause(name, "POSSIBLE", "This condition can prevent AP registration but requires direct confirmation.", support, [], [needed]) for name, needed, _ in specs]
    steps = [_step(needed, cause.why, command, "Expected registration dependency is healthy.", "Dependency is missing or failed.", f"Update confidence in {cause.name}.") for cause, (_, needed, command) in zip(causes, specs)]
    return causes, [needed for _, needed, _ in specs], steps


def _vlan_analysis(facts: list[dict[str, str]]) -> tuple[list[Cause], list[str], list[TestStep]]:
    unknowns = ["Port link type", "PVID", "Tagged and untagged VLAN membership", "Allowed VLAN list", "Remote trunk configuration"]
    cause = Cause("VLAN trunk mismatch", "POSSIBLE", "A PVID, tagging, or allowed-VLAN mismatch can interrupt Layer 2 forwarding.", [f["statement"] for f in facts], [], unknowns)
    steps = [_step("Inspect VLAN and trunk state", "Compare port mode, PVID, tagging, and allowed VLANs on both ends.", "display port vlan", "Both endpoints have compatible trunk and VLAN settings.", "PVID, tagging, or allowed-VLAN mismatch exists.", "Collect the equivalent remote-side output before proposing a correction.")]
    return [cause], unknowns, steps


def _generic_analysis(domain: FaultDomain, vendor: str) -> tuple[list[Cause], list[str], list[TestStep]]:
    labels = {
        FaultDomain.ROUTING: ("Routing-path failure", "Routing table and protocol-neighbour state", "display ip routing-table" if "huawei" in vendor.lower() else "show ip route"),
        FaultDomain.DHCP: ("DHCP allocation failure", "Client lease, relay, server, and scope evidence", "display dhcp server statistics" if "huawei" in vendor.lower() else "show ip dhcp binding"),
        FaultDomain.FIREWALL_REACHABILITY: ("Firewall policy or path denial", "Session, policy, route, and denial-log evidence", "display firewall session table" if "huawei" in vendor.lower() else "show access-lists"),
        FaultDomain.INTERFACE_ERRORS: ("Interface integrity problem", "Detailed interface counters and link events", "display interface" if "huawei" in vendor.lower() else "show interfaces"),
        FaultDomain.FIBRE_OPTICS: ("Optical-path degradation", "Measured optical levels, thresholds, and endpoint diagnostics", "Use the vendor/model-supported read-only transceiver diagnostic command"),
        FaultDomain.UNKNOWN: ("Insufficient evidence for a specific root cause", "Relevant interface, reachability, topology, and timestamped logs", "display interface brief" if "huawei" in vendor.lower() else "show interfaces status"),
    }
    name, needed, command = labels.get(domain, labels[FaultDomain.UNKNOWN])
    return [Cause(name, "LOW" if domain is FaultDomain.UNKNOWN else "POSSIBLE", "Direct evidence is required before a root cause can be established.", [], [], [needed])], [needed], [_step("Collect domain evidence", "Avoid guessing and establish current state.", command, "Output matches the intended design.", "Output identifies a failed or missing dependency.", "Paste the unchanged output into a new DAUGLAS analysis.")]


def _validate(incident: Incident, domain: FaultDomain, facts: list[dict[str, str]], causes: list[Cause], steps: list[TestStep]) -> dict[str, Any]:
    errors: list[str] = []
    device = incident.device_type.lower()
    if domain is FaultDomain.WLAN_REGISTRATION and device not in {"wac", "ap", "unknown"}:
        errors.append(f"WLAN_REGISTRATION does not agree with selected device type {incident.device_type}.")
    if domain in {FaultDomain.PHYSICAL_LINK, FaultDomain.FIBRE_OPTICS, FaultDomain.INTERFACE_ERRORS, FaultDomain.VLAN_TRUNKING} and device in {"wac", "ap"}:
        errors.append(f"{domain.value} requires stronger evidence to override selected device type {incident.device_type}.")
    if any(step.safety != SafetyClass.READ_ONLY.value for step in steps):
        errors.append("A suggested command is not classified READ_ONLY.")
    evidence_text = incident.evidence.lower()
    for fact in facts:
        if fact["category"] in {"COMMAND_PROVEN", "SYSLOG_PROVEN"} and not fact.get("source"):
            errors.append("A proven fact has no evidence source.")
    joined = " ".join(cause.name + " " + cause.why for cause in causes).lower()
    if domain is not FaultDomain.WLAN_REGISTRATION and any(term in joined for term in ("option 43", "option 148", "fit ap", "wac licence")):
        errors.append("Unrelated WLAN reasoning leaked into a non-WLAN analysis.")
    return {"passed": not errors, "errors": errors, "checks": 7}


def analyze_incident(incident: Incident) -> dict[str, Any]:
    """Create a fresh analysis using only the current sanitized incident."""
    clean, secrets = incident.sanitized()
    vendor = clean.vendor.lower()
    parsed = parse_huawei(clean.evidence) if "huawei" in vendor else parse_cisco(clean.evidence) if "cisco" in vendor else {"facts": []}
    domain, secondary = classify_fault_domain(clean, parsed)
    facts: list[dict[str, str]] = list(parsed.get("facts", [])) + list(parsed.get("syslog_facts", []))
    observations: list[dict[str, str]] = []
    for label, value in (("Actual behaviour", clean.actual_behavior), ("Incident description", clean.description), ("Engineer notes", clean.notes)):
        if value.strip():
            observations.append({"statement": value.strip(), "category": "ENGINEER_REPORTED", "source": label, "confidence": "REPORTED_NOT_VERIFIED"})

    v2_analysis: dict[str, Any] | None = None
    if domain is FaultDomain.WLAN_REGISTRATION:
        causes, unknowns, steps = _wlan_analysis(facts)
    elif domain in {FaultDomain.PHYSICAL_LINK, FaultDomain.FIBRE_OPTICS}:
        causes, unknowns, steps = _physical_analysis(clean, parsed, facts)
        if vendor in {"huawei", "cisco"}:
            from dauglas.engines.v2_physical_engine import analyze_physical

            deterministic_v2 = analyze_physical(clean, parsed)
            if deterministic_v2.hypotheses:
                v2_analysis = deterministic_v2.to_dict()
                evidence_by_id = {record.evidence_id: record for record in deterministic_v2.evidence}
                causes = [Cause(
                    name=hypothesis.title,
                    confidence=hypothesis.status,
                    why=f"{hypothesis.explanation} Explainable score: {hypothesis.score}/100 (not a probability).",
                    supporting_evidence=[f"{evidence_by_id[item].fact}={evidence_by_id[item].value} ({item})" for item in hypothesis.supporting_evidence_ids if item in evidence_by_id],
                    conflicting_evidence=[f"{evidence_by_id[item].fact}={evidence_by_id[item].value} ({item})" for item in hypothesis.contradicting_evidence_ids if item in evidence_by_id],
                    evidence_required=hypothesis.missing_evidence,
                ) for hypothesis in deterministic_v2.hypotheses]
                unknowns = list(dict.fromkeys(item for hypothesis in deterministic_v2.hypotheses for item in hypothesis.missing_evidence))
                steps = [TestStep(
                    test=test.title, why=test.purpose, command=test.command or "No approved command is available; verify the exact platform command before proceeding.",
                    healthy_result=test.healthy_result, faulty_result=test.fault_indication, next_action=test.decision,
                    safety=test.risk, test_type="MANUAL" if test.manual else "COMMAND",
                ) for test in deterministic_v2.tests if test.risk == SafetyClass.READ_ONLY.value]
    elif domain is FaultDomain.VLAN_TRUNKING:
        causes, unknowns, steps = _vlan_analysis(facts)
    else:
        causes, unknowns, steps = _generic_analysis(domain, clean.vendor)
    validation = _validate(clean, domain, facts, causes, steps)
    if ZoneInfo is not None:
        try:
            now = datetime.now(ZoneInfo("Africa/Johannesburg"))
        except Exception:
            now = datetime.now(timezone.utc)
    else:
        now = datetime.now(timezone.utc)
    analysis_id = f"DNC-{now:%Y%m%d}-{uuid4().hex[:6].upper()}"
    incident_id = f"INC-{now:%Y%m%d}-{uuid4().hex[:6].upper()}"
    return {
        "analysis_id": analysis_id,
        "incident_id": incident_id,
        "generated_at": now.isoformat(timespec="seconds"),
        "incident": asdict(clean),
        "secrets_masked": secrets,
        "classification": {"vendor": clean.vendor, "device_type": clean.device_type, "primary_domain": domain.value, "fault_domain": domain.value, "secondary_domains": [item.value for item in secondary]},
        "structured_evidence": parsed,
        "facts": facts,
        "observations": observations,
        "assumptions": [{"statement": cause.why, "confidence": cause.confidence} for cause in causes],
        "unknowns": list(dict.fromkeys(unknowns)),
        "probable_causes": [asdict(cause) for cause in causes],
        "troubleshooting_sequence": [asdict(step) for step in steps],
        "syslog_events": parse_syslog(clean.evidence),
        "root_cause_status": RootCauseStatus.UNCONFIRMED.value,
        "validation": validation,
        "diagnostic_engine_v2": v2_analysis,
        "analysis_metadata": {
            "tool_name": "DAUGLAS Network Copilot",
            "tool_version": "0.2.1",
            "engine_version": "0.2.1",
            "deterministic_only": True,
            "vendor_parser": "huawei" if "huawei" in vendor else "cisco" if "cisco" in vendor else "generic",
        },
        "advisory_only": True,
    }
