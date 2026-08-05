"""DAUGLAS v0.2 Huawei physical/fibre vertical slice."""
from __future__ import annotations

from pathlib import Path
from typing import Any

from dauglas.engines.contradiction_engine import detect_contradictions
from dauglas.engines.evidence_engine import normalize_evidence
from dauglas.engines.evidence_graph import build_evidence_graph
from dauglas.engines.hypothesis_engine import rank_hypotheses
from dauglas.engines.next_test_engine import build_tests, select_safest_next_test
from dauglas.engines.rule_engine import load_rule_pack
from dauglas.models.analysis import DiagnosticAnalysis
from dauglas.safety.command_catalogue import CommandCatalogue

PROJECT_ROOT = Path(__file__).resolve().parents[2]


def analyze_physical(incident: Any, parsed: dict[str, Any]) -> DiagnosticAnalysis:
    pack = load_rule_pack(PROJECT_ROOT / "knowledge" / "generic" / "physical_link.yaml")
    vendor_key = incident.vendor.strip().lower()
    catalogue_path = PROJECT_ROOT / "knowledge" / vendor_key / "commands.yaml"
    catalogue = CommandCatalogue(catalogue_path)
    evidence = normalize_evidence(incident, parsed)
    hypotheses = rank_hypotheses(pack["rules"], evidence)
    interface = parsed.get("interface") or (parsed.get("interfaces", [None])[0] if parsed.get("interfaces") else None)
    tests = build_tests(pack, hypotheses, catalogue, incident.vendor, incident.device_type, interface)
    selected = select_safest_next_test(tests)
    return DiagnosticAnalysis(
        engine_version="0.2.0-alpha.1", evidence=evidence, hypotheses=hypotheses, tests=tests,
        selected_next_test_id=selected.test_id if selected else None,
        evidence_graph=build_evidence_graph(evidence, hypotheses),
        contradictions=detect_contradictions(evidence),
    )


def analyze_huawei_physical(incident: Any, parsed: dict[str, Any]) -> DiagnosticAnalysis:
    return analyze_physical(incident, parsed)
