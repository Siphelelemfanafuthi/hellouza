"""Generate an auditable Markdown incident report."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


def generate_report(result: dict[str, Any]) -> str:
    incident = result["incident"]
    def bullets(items: list[Any]) -> str:
        return "\n".join(f"- {item}" for item in items) or "- None confirmed"
    facts = "\n".join(f"- **{item['confidence']} · {item['category']}** — {item['statement']} _(Source: {item['source']})_" for item in result["facts"]) or "- None directly proven"
    observations = "\n".join(f"- **{item['confidence']}** — {item['statement']} _(Source: {item['source']})_" for item in result["observations"]) or "- None supplied"
    causes = "\n".join(f"{i}. {c['name']} — {c['confidence']} confidence\n   - Why: {c['why']}" for i, c in enumerate(result["probable_causes"], 1))
    steps = "\n".join(f"{i}. **{s['test']}** — `{s['command']}` ({s['safety']})" for i, s in enumerate(result["troubleshooting_sequence"], 1))
    audit = result.get("analysis_metadata", {})
    engine_version = audit.get("engine_version", "unspecified")
    parser_name = audit.get("vendor_parser", "generic")
    v2 = result.get("diagnostic_engine_v2")
    v2_section = ""
    if v2:
        ranking = "\n".join(f"- {item['score']}/100 — {item['title']} ({item['status']}); rule `{item['rule_id']}`; evidence: {', '.join(item['supporting_evidence_ids']) or 'none'}" for item in v2["hypotheses"])
        selected = next((item for item in v2["tests"] if item["test_id"] == v2.get("selected_next_test_id")), None)
        selected_text = f"{selected['title']} — `{selected['command']}` ({selected['risk']})" if selected else "No catalogue-approved actionable test selected"
        v2_section = f"""

### v0.2 deterministic diagnostic engine
Engine: `{v2['engine_version']}`

{ranking}

Safest next test: {selected_text}
"""
    return f"""# DAUGLAS Incident Report

Generated: {datetime.now(timezone.utc).isoformat()}
Analysis ID: {result['analysis_id']}  
Incident ID: {result['incident_id']}  
Validation passed: {result['validation']['passed']}  
Audit engine: {engine_version}  
Vendor parser: {parser_name}

## 1. Incident information
- Title: {incident['title']}
- Client/site alias: {incident['client_alias']}
- Vendor: {incident['vendor']}
- Device: {incident['device_type']} {incident['device_model']}

## 2. Business or service impact
{incident['service_impact'] or 'Not supplied'}

## 3. Reported symptoms
Expected: {incident['expected_behavior']}  
Observed: {incident['actual_behavior']}

## 4. Confirmed facts
{facts}

### Engineer-reported observations
{observations}

## 5. Evidence collected
Original evidence is retained in the incident record after secret masking.

## 6. Troubleshooting actions
{steps}

## 7. Ranked probable causes
{causes}

Primary fault domain: **{result['classification']['primary_domain']}**  
Secondary domains: {', '.join(result['classification']['secondary_domains']) or 'None'}
{v2_section}

## 8. Root cause
Status: **{result['root_cause_status']}**

## 9. Corrective action
Not proposed until the root cause is supported by sufficient evidence and approved by an engineer.

## 10. Risk and rollback
No changes are executed by DAUGLAS v0.1. Any future correction requires approval and a documented rollback.

## 11. Validation results
Not yet supplied.

## 12. Final status
Investigation in progress.

## 13. Lessons learned
Pending incident resolution.

## 14. Preventive recommendations
Pending confirmed root cause.
"""
