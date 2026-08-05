# DAUGLAS Network Copilot v0.1

A safe, read-only network troubleshooting assistant. DAUGLAS sanitizes incident data, separates confirmed facts from hypotheses, ranks probable causes, requests missing evidence, recommends only read-only diagnostic commands, and produces an auditable report.

## Safety boundary

DAUGLAS v0.1 never connects to devices, executes commands, stores credentials, changes configurations, or performs remediation. Its analysis is advisory and the engineer remains in control.

## Run locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
streamlit run app.py
```

Open `http://localhost:8501`.

## Tests

```powershell
pytest -q
```

The v0.1 diagnostic layer is deterministic by design. A future local language model can propose hypotheses, but secret handling, command safety, evidence validation, and root-cause state transitions must remain deterministic.

## v0.2.1 AI Investigator

The Results page provides three explicit, engineer-triggered local AI operations:

- Explain this incident
- Challenge the current analysis
- Recommend next best evidence

The local Ollama model receives a structured sanitized case—not raw command output. Each operation has a strict JSON schema. A deterministic validation firewall rejects unknown evidence IDs, unapproved command IDs, free-form command syntax, malformed fields, secret-like output, and hypotheses outside the permitted operation boundary.

AI output cannot change facts, deterministic hypotheses, fault domains, safety classifications, commands, or root-cause status. Rejected or timed-out output is never partially displayed, and deterministic results remain available.

`llama3.2:1b` is used on this machine. A guarded operation can take several minutes on CPU-constrained hardware.

## v0.2 deterministic vertical slice

Huawei physical/fibre incidents now use the first v0.2 rule-engine slice:

- immutable normalized evidence records with deterministic `EV-####` IDs;
- engineer-readable, approved YAML diagnostic rules;
- evidence-linked hypotheses with explainable 0–100 ranking scores;
- explicit missing and contradicting evidence;
- an internal evidence graph;
- an approved Huawei read-only command catalogue; and
- selection of one high-value, catalogue-approved safest next test.

Scores are deterministic ranking weights, not scientific probabilities. Fibre causes are not generated from link flapping alone, and root-cause status remains `UNCONFIRMED` until rule-specific completion evidence exists.

Knowledge packs are stored under `knowledge/generic` and `knowledge/<vendor>`. Only packs marked `APPROVED` are evaluated.
