from dauglas.engines.v2_physical_engine import PROJECT_ROOT, analyze_physical
from dauglas.incident_engine import Incident
from dauglas.safety.command_catalogue import CommandCatalogue
from parsers.cisco_parser import parse_cisco


def _incident(extra_evidence: str = "", notes: str = "Fibre uplink; optical loss is suspected but unverified."):
    evidence = """GigabitEthernet0/0/24 DOWN DOWN
Speed: 1000
Input error: 127
CRC: 89
2026-08-05 GigabitEthernet0/0/24 physical state UP
2026-08-05 GigabitEthernet0/0/24 physical state DOWN
""" + extra_evidence
    return Incident(title="Cisco fibre uplink flapping", vendor="Cisco", device_type="Switch", device_model="Catalyst 9300", description="Physical uplink instability", evidence=evidence, notes=notes)


def test_cisco_v2_uses_approved_cisco_commands() -> None:
    incident = _incident()
    analysis = analyze_physical(incident, parse_cisco(incident.evidence))
    catalogue = CommandCatalogue(PROJECT_ROOT / "knowledge" / "cisco" / "commands.yaml")
    rendered = catalogue.render("CISCO-INTERFACE-DETAIL-001", {"interface": "GigabitEthernet0/0/24"}, "Cisco", "Switch")
    assert rendered == "show interface GigabitEthernet0/0/24"
    assert any(test.command == rendered for test in analysis.tests)
