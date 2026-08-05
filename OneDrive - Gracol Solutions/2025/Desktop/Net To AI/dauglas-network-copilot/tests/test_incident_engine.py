from dauglas.incident_engine import Incident, analyze_incident


def test_huawei_uplink_flapping_is_not_wlan() -> None:
    evidence = """GigabitEthernet0/0/24 DOWN DOWN
Speed: 1000
Duplex: FULL
Input error: 127
CRC: 89
Output error: 0
2026-08-05 GigabitEthernet0/0/24 physical state UP
2026-08-05 GigabitEthernet0/0/24 physical state DOWN"""
    incident = Incident(
        title="Intermittent connectivity caused by Huawei switch uplink flapping",
        vendor="Huawei",
        device_type="Switch",
        actual_behavior="The uplink repeatedly transitions between UP and DOWN; some APs temporarily appear offline.",
        description="GigabitEthernet0/0/24 is frequently flapping on the access switch.",
        evidence=evidence,
        notes="Received optical power may be below threshold.",
    )
    result = analyze_incident(incident)
    rendered = str(result).lower()
    assert result["classification"]["primary_domain"] == "PHYSICAL_LINK"
    assert result["validation"]["passed"]
    assert "option 43" not in rendered
    assert "option 148" not in rendered
    assert "fit ap" not in rendered
    assert "wac licence" not in rendered
    assert result["structured_evidence"]["crc_errors"] == 89
    assert all(fact["source"] for fact in result["facts"])
    assert result["observations"][-1]["confidence"] == "REPORTED_NOT_VERIFIED"


def test_huawei_ap_registration_uses_wlan_domain() -> None:
    result = analyze_incident(Incident(title="FIT APs are not registering with WAC", vendor="Huawei", device_type="WAC", actual_behavior="APs receive DHCP addresses but remain offline"))
    assert result["classification"]["primary_domain"] == "WLAN_REGISTRATION"
    rendered = str(result).lower()
    assert "option 43" in rendered
    assert "ap operating-mode" in rendered


def test_vlan_trunk_problem_requests_vlan_evidence() -> None:
    result = analyze_incident(Incident(title="VLAN trunk mismatch", vendor="Huawei", device_type="Switch", description="Tagged VLAN 240 is not crossing trunk; check PVID and allowed VLANs"))
    assert result["classification"]["primary_domain"] == "VLAN_TRUNKING"
    rendered = str(result).lower()
    for term in ("port link type", "pvid", "tagged", "untagged", "allowed vlan"):
        assert term in rendered


def test_unknown_incident_requests_evidence() -> None:
    result = analyze_incident(Incident(title="Intermittent issue", vendor="Vendor-neutral"))
    assert result["classification"]["primary_domain"] == "UNKNOWN"
    assert result["root_cause_status"] == "UNCONFIRMED"
    assert result["unknowns"]


def test_sequential_analyses_are_isolated() -> None:
    first = analyze_incident(Incident(title="FIT AP not registering with WAC", vendor="Huawei", device_type="WAC"))
    second = analyze_incident(Incident(title="VLAN trunk mismatch", vendor="Huawei", device_type="Switch", description="PVID and tagged VLAN mismatch"))
    assert first["analysis_id"] != second["analysis_id"]
    assert first["incident_id"] != second["incident_id"]
    assert first["classification"]["primary_domain"] == "WLAN_REGISTRATION"
    assert second["classification"]["primary_domain"] == "VLAN_TRUNKING"
    assert "option 43" not in str(second).lower()
