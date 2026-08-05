from dauglas.safety_engine import SafetyClass, classify_command, mask_secrets


def test_masks_credentials() -> None:
    masked, count = mask_secrets("username admin\npassword SuperSecret123\nsnmp community: public")
    assert "SuperSecret123" not in masked
    assert "public" not in masked
    assert count == 2


def test_read_only_commands() -> None:
    assert classify_command("display interface brief") == SafetyClass.READ_ONLY
    assert classify_command("show ip route") == SafetyClass.READ_ONLY
    assert classify_command("ping 10.0.0.1") == SafetyClass.READ_ONLY


def test_dangerous_commands_are_not_read_only() -> None:
    assert classify_command("reboot") == SafetyClass.PROHIBITED_IN_V0_1
    assert classify_command("shutdown") == SafetyClass.SERVICE_AFFECTING
    assert classify_command("interface GigabitEthernet0/1") == SafetyClass.MEDIUM_RISK_CHANGE
