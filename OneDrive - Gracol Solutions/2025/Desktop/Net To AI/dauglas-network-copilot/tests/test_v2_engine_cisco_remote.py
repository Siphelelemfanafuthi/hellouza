from dauglas.engines.v2_physical_engine import PROJECT_ROOT, analyze_physical
from dauglas.incident_engine import Incident
from dauglas.safety.command_catalogue import CommandCatalogue
from parsers.cisco_parser import parse_cisco


def _incident(extra_evidence: str = "", notes: str = "Remote neighbor unstable."):
    evidence = """GigabitEthernet0/0/24 DOWN DOWN
Speed: 1000
Input error: 0
CRC: 0
2026-08-05 GigabitEthernet0/0/24 physical state UP
2026-08-05 GigabitEthernet0/0/24 physical state DOWN
""" + extra_evidence
    return Incident(title="Cisco remote neighbor discovery", vendor="Cisco", device_type="Switch", device_model="Catalyst 9300", description="Check remote neighbor", evidence=evidence, notes=notes)


def test_cisco_remote_neighbor_command_rendered() -> None:
    incident = _incident()
    parsed = parse_cisco(incident.evidence)
    analysis = analyze_physical(incident, parsed)
    catalogue = CommandCatalogue(PROJECT_ROOT / "knowledge" / "cisco" / "commands.yaml")
    rendered = catalogue.render("CISCO-LLDP-INTERFACE-001", {"interface": "GigabitEthernet0/0/24"}, "Cisco", "Switch")
    assert rendered == "show lldp neighbors interface GigabitEthernet0/0/24 detail"
    assert any(test.command == rendered for test in analysis.tests)
