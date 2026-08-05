"""Convert rule evaluations into explainable ranked hypotheses."""
from __future__ import annotations

from typing import Any

from dauglas.engines.rule_engine import evaluate_rule
from dauglas.models.evidence import EvidenceRecord
from dauglas.models.hypothesis import Hypothesis


def status_for_score(score: int) -> str:
    if score >= 75:
        return "STRONGLY_SUPPORTED"
    if score >= 45:
        return "POSSIBLE"
    if score >= 20:
        return "WEAKLY_SUPPORTED"
    return "UNSUPPORTED"


def rank_hypotheses(rules: list[dict[str, Any]], evidence: list[EvidenceRecord]) -> list[Hypothesis]:
    hypotheses: list[Hypothesis] = []
    for rule in rules:
        evaluation = evaluate_rule(rule, evidence)
        if not evaluation:
            continue
        score = evaluation["score"]
        hypotheses.append(Hypothesis(
            hypothesis_id=f"HYP-{rule['rule_id']}", rule_id=rule["rule_id"], title=rule["title"],
            domain=rule["domain"], score=score, status=status_for_score(score),
            explanation=rule["explanation"], supporting_evidence_ids=evaluation["support_ids"],
            contradicting_evidence_ids=evaluation["contradict_ids"], missing_evidence=evaluation["missing"],
            next_test_ids=list(rule.get("next_tests", [])), confirmation_requirements=list(rule.get("confirmation_requirements", [])),
        ))
    return sorted(hypotheses, key=lambda item: (-item.score, item.rule_id))
