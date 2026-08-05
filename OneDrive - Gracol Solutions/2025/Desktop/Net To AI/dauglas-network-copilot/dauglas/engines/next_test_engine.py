"""Select one high-value, low-risk, catalogue-approved next test."""
from __future__ import annotations

from typing import Any

from dauglas.models.hypothesis import Hypothesis
from dauglas.models.troubleshooting import DiagnosticTest
from dauglas.safety.command_catalogue import CommandCatalogue


def build_tests(pack: dict[str, Any], hypotheses: list[Hypothesis], catalogue: CommandCatalogue, vendor: str, device_type: str, interface: str | None) -> list[DiagnosticTest]:
    referenced = {test_id for hypothesis in hypotheses for test_id in hypothesis.next_test_ids}
    vendor_key = vendor.strip().lower().title()
    tests: list[DiagnosticTest] = []
    for item in pack.get("tests", []):
        if item["test_id"] not in referenced:
            continue
        command_id_raw = item.get("command_id")
        if isinstance(command_id_raw, dict):
            command_id = command_id_raw.get(vendor_key)
        else:
            command_id = command_id_raw
        command = None
        if command_id:
            try:
                command = catalogue.render(command_id, {"interface": interface or "<affected-interface>"}, vendor, device_type)
            except (KeyError, ValueError):
                continue
        tests.append(DiagnosticTest(
            test_id=item["test_id"], title=item["title"], purpose=item["purpose"], risk=item["risk"],
            command_id=command_id, command=command, healthy_result=item["healthy_result"],
            fault_indication=item["fault_indication"], decision=item["decision"],
            diagnostic_value=int(item["diagnostic_value"]), manual=bool(item.get("manual", False)),
        ))
    return sorted(tests, key=lambda item: (-item.diagnostic_value, item.test_id))


def select_safest_next_test(tests: list[DiagnosticTest]) -> DiagnosticTest | None:
    actionable = [test for test in tests if test.risk == "READ_ONLY" and test.command]
    return actionable[0] if actionable else None
