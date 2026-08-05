from dauglas.engines.v2_physical_engine import PROJECT_ROOT, analyze_huawei_physical
from dauglas.incident_engine import Incident, analyze_incident
from dauglas.safety.command_catalogue import CommandCatalogue
from parsers.huawei_parser import parse_huawei


def _incident(extra_evidence: str = "", notes: str = "Fibre uplink; optical loss is suspected but unverified."):
    evidence = """GigabitEthernet0/0/24 DOWN DOWN
Speed: 1000
Input error: 127
CRC: 89
2026-08-05 GigabitEthernet0/0/24 physical state UP
2026-08-05 GigabitEthernet0/0/24 physical state DOWN
""" + extra_evidence
    return Incident(title="Huawei fibre uplink flapping", vendor="Huawei", device_type="Switch", device_model="S5735", description="Physical uplink instability", evidence=evidence, notes=notes)


def test_v2_normalizes_traceable_evidence() -> None:
    incident = _incident()
    analysis = analyze_huawei_physical(incident, parse_huawei(incident.evidence))
    ids = [item.evidence_id for item in analysis.evidence]
    assert ids == [f"EV-{index:04d}" for index in range(1, len(ids) + 1)]
    crc = next(item for item in analysis.evidence if item.fact == "crc_errors")
    assert crc.value == 89
    assert "line" in crc.source_reference.lower()
    assert all(hypothesis.supporting_evidence_ids for hypothesis in analysis.hypotheses)


def test_commands_only_come_from_approved_catalogue() -> None:
    catalogue = CommandCatalogue(PROJECT_ROOT / "knowledge" / "huawei" / "commands.yaml")
    assert catalogue.render("HUAWEI-INTERFACE-DETAIL-001", {"interface": "GigabitEthernet0/0/24"}, "Huawei", "Switch") == "display interface GigabitEthernet0/0/24"
    try:
        catalogue.render("UNAPPROVED", {}, "Huawei", "Switch")
        assert False, "An unapproved command was accepted"
    except KeyError:
        pass


def test_new_evidence_changes_explainable_score() -> None:
    first = _incident()
    second = _incident("Transceiver type: 1G-LX\nRX optical power: -12.4\nTX optical power: -3.1\n")
    first_result = analyze_huawei_physical(first, parse_huawei(first.evidence))
    second_result = analyze_huawei_physical(second, parse_huawei(second.evidence))
    first_optical = next(item for item in first_result.hypotheses if item.rule_id == "FIBRE-CRC-FLAP-001")
    second_optical = next(item for item in second_result.hypotheses if item.rule_id == "FIBRE-CRC-FLAP-001")
    assert second_optical.score > first_optical.score
    assert len(second_optical.missing_evidence) < len(first_optical.missing_evidence)


def test_same_evidence_produces_same_v2_result() -> None:
    incident = _incident()
    first = analyze_huawei_physical(incident, parse_huawei(incident.evidence)).to_dict()
    second = analyze_huawei_physical(incident, parse_huawei(incident.evidence)).to_dict()
    assert first == second


def test_physical_flap_without_fibre_evidence_does_not_force_fibre() -> None:
    incident = _incident(notes="", extra_evidence="")
    result = analyze_huawei_physical(incident, parse_huawei(incident.evidence))
    assert result.hypotheses
    assert all(item.domain != "FIBRE_OPTICS" for item in result.hypotheses)
    assert result.hypotheses[0].domain == "PHYSICAL_LINK"


def test_root_cause_remains_unconfirmed() -> None:
    result = analyze_incident(_incident())
    assert result["root_cause_status"] == "UNCONFIRMED"
    assert result["diagnostic_engine_v2"]["selected_next_test_id"]
