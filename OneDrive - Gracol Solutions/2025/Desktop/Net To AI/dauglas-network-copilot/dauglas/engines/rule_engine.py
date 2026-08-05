"""Readable YAML rule evaluation against normalized evidence."""
from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml

from dauglas.engines.evidence_engine import evidence_values
from dauglas.models.evidence import EvidenceRecord, EvidenceStatus


def load_rule_pack(path: Path) -> dict[str, Any]:
    pack = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    required = {"pack_id", "version", "author", "approval_status", "rules", "tests"}
    missing = required - set(pack)
    if missing:
        raise ValueError(f"Rule pack is missing: {', '.join(sorted(missing))}")
    if pack["approval_status"] != "APPROVED":
        raise ValueError("Only approved rule packs may be evaluated")
    return pack


def _matches(condition: dict[str, Any], index: dict[str, list[EvidenceRecord]]) -> tuple[bool, list[str]]:
    records = index.get(condition["fact"], [])
    if condition.get("reported_only"):
        records = [record for record in records if record.status == EvidenceStatus.REPORTED_NOT_VERIFIED]
    operator, expected = condition.get("operator", "exists"), condition.get("value")
    matched: list[EvidenceRecord] = []
    for record in records:
        actual = record.value
        try:
            success = (
                operator == "exists"
                or operator == "equals" and actual == expected
                or operator == "greater_than" and float(actual) > float(expected)
                or operator == "less_than" and float(actual) < float(expected)
                or operator == "contains" and str(expected).lower() in str(actual).lower()
            )
        except (TypeError, ValueError):
            success = False
        if success:
            matched.append(record)
    return bool(matched), [record.evidence_id for record in matched]


def rule_triggers(rule: dict[str, Any], evidence: list[EvidenceRecord]) -> bool:
    index = evidence_values(evidence)
    trigger = rule.get("trigger", {})
    all_conditions = trigger.get("all", [])
    any_conditions = trigger.get("any", [])
    return all(_matches(item, index)[0] for item in all_conditions) and (not any_conditions or any(_matches(item, index)[0] for item in any_conditions))


def evaluate_rule(rule: dict[str, Any], evidence: list[EvidenceRecord]) -> dict[str, Any] | None:
    if not rule_triggers(rule, evidence):
        return None
    index = evidence_values(evidence)
    support_ids: list[str] = []
    contradict_ids: list[str] = []
    score = int(rule.get("base_score", 0))
    for condition in rule.get("supporting", []):
        matched, ids = _matches(condition, index)
        if matched:
            score += int(condition.get("weight", 0))
            support_ids.extend(ids)
    for condition in rule.get("contradicting", []):
        matched, ids = _matches(condition, index)
        if matched:
            score -= int(condition.get("weight", 0))
            contradict_ids.extend(ids)
    present_facts = set(index)
    missing = [fact for fact in rule.get("required_evidence", []) if fact not in present_facts]
    score -= min(20, len(missing) * 2)
    return {"rule": rule, "score": max(0, min(100, score)), "support_ids": sorted(set(support_ids)), "contradict_ids": sorted(set(contradict_ids)), "missing": missing}
