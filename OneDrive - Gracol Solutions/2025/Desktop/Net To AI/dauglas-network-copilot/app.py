"""Streamlit interface for the read-only DAUGLAS Network Copilot."""
from __future__ import annotations

import base64
import html
import json
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

import streamlit as st

from dauglas.ai_engine import analyze
from dauglas.ai.investigator import InvestigatorOperation, run_investigator
from dauglas.incident_engine import Incident
from dauglas.report_engine import generate_report

ROOT = Path(__file__).parent
DB_PATH = ROOT / "data" / "dauglas.db"


def apply_console_theme() -> None:
    """Apply the DAUGLAS network-operations visual system."""
    background_path = ROOT / "assets" / "deep-space-global-stars.png"
    background_data = base64.b64encode(background_path.read_bytes()).decode("ascii")
    background_uri = f"data:image/png;base64,{background_data}"
    st.markdown(
        """
        <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@600;700&family=Manrope:wght@400;500;600;700&display=swap');

        :root {
            --dnc-bg: #06101d;
            --dnc-panel: rgba(10, 28, 47, .92);
            --dnc-panel-soft: rgba(12, 35, 57, .72);
            --dnc-border: rgba(65, 177, 211, .22);
            --dnc-cyan: #32d3e6;
            --dnc-teal: #20c997;
            --dnc-blue: #4d8dff;
            --dnc-text: #e8f2f8;
            --dnc-muted: #8ba6b8;
            --dnc-warning: #f6c85f;
        }

        .stApp {
            color: var(--dnc-text);
            background:
                linear-gradient(rgba(3, 10, 18, .94), rgba(3, 10, 18, .97)),
                radial-gradient(circle at 82% 7%, rgba(34, 121, 171, .10), transparent 28rem),
                radial-gradient(circle at 12% 42%, rgba(24, 175, 159, .06), transparent 34rem),
                linear-gradient(rgba(39, 129, 164, .045) 1px, transparent 1px),
                linear-gradient(90deg, rgba(39, 129, 164, .045) 1px, transparent 1px),
                url('__DNC_SPACE_BACKGROUND__') center center / cover fixed no-repeat;
            background-size: auto, auto, auto, 32px 32px, 32px 32px, cover;
            background-attachment: fixed;
            font-family: 'Manrope', 'Segoe UI', sans-serif;
        }

        html, body, [class*="css"], .stApp, button, input, textarea, select, label {
            font-family: 'Manrope', 'Segoe UI', sans-serif;
        }

        .stApp::before {
            content: "";
            position: fixed;
            inset: 0;
            pointer-events: none;
            opacity: .3;
            background: linear-gradient(110deg, transparent 25%, rgba(50, 211, 230, .025) 50%, transparent 75%);
        }

        [data-testid="stHeader"] { background: rgba(5, 13, 24, .78); border-bottom: 1px solid var(--dnc-border); }
        [data-testid="stToolbar"] { right: 1rem; }
        [data-testid="stMainBlockContainer"] { max-width: 1500px; padding-top: 1.4rem; padding-bottom: 5rem; }
        [data-testid="stSidebar"] {
            background:
                linear-gradient(180deg, rgba(18, 36, 55, .98) 0%, rgba(10, 25, 41, .98) 52%, rgba(7, 19, 32, .99) 100%) !important;
            border-right: 1px solid rgba(74, 165, 195, .24);
            box-shadow: 14px 0 34px rgba(0, 0, 0, .18);
        }
        [data-testid="stSidebar"]::before {
            content: "NAVIGATION";
            display: block;
            margin: 4.2rem 1.25rem .65rem;
            color: #7794a8;
            font: 600 .64rem 'Manrope', sans-serif;
            letter-spacing: .18em;
        }
        [data-testid="stSidebar"] [data-testid="stSidebarNav"] { display: none; }
        [data-testid="stSidebar"] [data-testid="stPageLink"] a {
            margin: .14rem .7rem; padding: .56rem .72rem; border-radius: 7px;
            color: #b9ccd8; font-size: .82rem; font-weight: 500; text-decoration: none;
            border: 1px solid transparent;
        }
        [data-testid="stSidebar"] [data-testid="stPageLink"] a:hover {
            color: #eefbff; border-color: rgba(50, 211, 230, .16); background: rgba(50, 211, 230, .06);
        }
        [data-testid="stSidebar"] [data-testid="stSidebarNavLink"] {
            margin: .22rem .72rem;
            padding: .68rem .78rem;
            border: 1px solid transparent;
            border-radius: 7px;
            color: #b9ccd8;
            font-size: .84rem;
            font-weight: 500;
            letter-spacing: .01em;
            transition: background .16s ease, border-color .16s ease, color .16s ease;
        }
        [data-testid="stSidebar"] [data-testid="stSidebarNavLink"]:hover {
            color: #eefbff;
            border-color: rgba(50, 211, 230, .16);
            background: rgba(50, 211, 230, .065);
        }
        [data-testid="stSidebar"] [data-testid="stSidebarNavLink"][aria-current="page"] {
            color: #e9fcff;
            border-color: rgba(50, 211, 230, .28);
            background: linear-gradient(90deg, rgba(50, 211, 230, .14), rgba(50, 211, 230, .035));
            box-shadow: inset 3px 0 0 var(--dnc-cyan);
            font-weight: 600;
        }
        [data-testid="stSidebarCollapseButton"] button { color: #91adbd !important; }
        h1, h2, h3 { color: var(--dnc-text) !important; letter-spacing: -.025em; }
        h2 { font-size: 1.35rem !important; }
        h3 { font-size: 1.05rem !important; color: #cce4ee !important; }
        p, label, .stMarkdown { color: var(--dnc-text); }
        code, pre, [data-testid="stCode"] { font-family: 'IBM Plex Mono', Consolas, monospace !important; }

        .dnc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1.5rem;
            padding: 1.35rem 1.5rem;
            margin: .35rem 0 1.25rem;
            border: 1px solid var(--dnc-border);
            border-radius: 12px;
            background: linear-gradient(105deg, rgba(12, 39, 62, .96), rgba(7, 24, 40, .90));
            box-shadow: 0 18px 50px rgba(0, 0, 0, .22), inset 3px 0 0 var(--dnc-cyan);
        }
        .dnc-brand { display: flex; align-items: center; gap: 1rem; }
        .dnc-mark {
            width: 46px; height: 46px; display: grid; place-items: center;
            border: 1px solid rgba(50, 211, 230, .55); border-radius: 10px;
            color: var(--dnc-cyan); font: 600 17px 'IBM Plex Mono';
            background: rgba(50, 211, 230, .08); box-shadow: 0 0 24px rgba(50, 211, 230, .12);
        }
        .dnc-title { font: 700 1.55rem/1.15 'Inter', 'Segoe UI', sans-serif; color: #f3fbff; }
        .dnc-subtitle { margin-top: .3rem; font-family: 'Manrope', sans-serif; font-size: .76rem; font-weight: 600; letter-spacing: .12em; color: var(--dnc-muted); text-transform: uppercase; }
        .dnc-live { display: flex; align-items: center; gap: .55rem; font: 500 .73rem 'IBM Plex Mono'; color: #9ee9d3; white-space: nowrap; }
        .dnc-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--dnc-teal); box-shadow: 0 0 12px var(--dnc-teal); }
        .dnc-status-row { display: flex; gap: .5rem; flex-wrap: wrap; justify-content: flex-end; }
        .dnc-badge { padding: .34rem .58rem; border: 1px solid var(--dnc-border); border-radius: 5px; background: rgba(4,15,27,.72); color: #9eb5c4; font: 600 .65rem 'IBM Plex Mono'; letter-spacing: .04em; }
        .dnc-badge.success { color: #8fe5c5; border-color: rgba(52,211,153,.3); }
        .dnc-badge.cyan { color: #9cecf4; border-color: rgba(34,211,238,.3); }
        .dnc-stage { display: flex; align-items: center; margin: .8rem 0 1.2rem; color: #658095; font: 600 .67rem 'IBM Plex Mono'; letter-spacing: .08em; }
        .dnc-stage span { color: #a9c1d0; }
        .dnc-stage i { flex: 1; height: 1px; min-width: 2rem; margin: 0 .7rem; background: linear-gradient(90deg, rgba(34,211,238,.5), rgba(27,64,88,.4)); }
        .dnc-section-label { color: #8ca6b8; font: 600 .68rem 'IBM Plex Mono'; letter-spacing: .12em; text-transform: uppercase; margin-bottom: .35rem; }

        [data-testid="stForm"] {
            border: 0;
            border-radius: 12px;
            padding: 0;
            background: transparent;
            box-shadow: none;
        }
        [data-testid="stVerticalBlockBorderWrapper"] { background: rgba(8, 21, 36, .97); border-color: #1b4058 !important; border-radius: 10px; }
        [data-testid="stWidgetLabel"] p { color: #b9d0dc !important; font-size: .77rem; font-weight: 600; letter-spacing: .025em; }
        .stTextInput input, .stTextArea textarea, [data-baseweb="select"] > div {
            color: var(--dnc-text) !important;
            background: rgba(4, 15, 27, .82) !important;
            border-color: rgba(89, 151, 181, .25) !important;
            border-radius: 7px !important;
        }
        .stTextInput input:focus, .stTextArea textarea:focus, [data-baseweb="select"] > div:focus-within {
            border-color: var(--dnc-cyan) !important;
            box-shadow: 0 0 0 1px rgba(50, 211, 230, .28) !important;
        }
        .stTextArea textarea { font-family: 'IBM Plex Mono', Consolas, monospace; font-size: .78rem; line-height: 1.6; }

        .stButton > button, .stDownloadButton > button, [data-testid="stFormSubmitButton"] > button {
            min-height: 2.65rem; border: 1px solid #37c9dd !important; border-radius: 7px !important;
            color: #03131d !important; font-weight: 700 !important;
            background: linear-gradient(135deg, #43dce8, #21bfa9) !important;
            box-shadow: 0 8px 22px rgba(32, 201, 151, .16);
        }
        .stButton > button:hover, .stDownloadButton > button:hover, [data-testid="stFormSubmitButton"] > button:hover {
            transform: translateY(-1px); box-shadow: 0 10px 28px rgba(50, 211, 230, .24);
        }

        [data-testid="stAlert"] { border-radius: 8px; border: 1px solid var(--dnc-border); background: rgba(11, 31, 49, .90); }
        [data-testid="stMetric"] {
            padding: 1rem 1.15rem; min-height: 108px; border: 1px solid var(--dnc-border); border-radius: 10px;
            background: linear-gradient(150deg, rgba(13, 39, 61, .92), rgba(7, 24, 39, .92));
        }
        [data-testid="stMetricLabel"] { color: var(--dnc-muted); }
        [data-testid="stMetricValue"] { color: #eafaff; font-family: 'IBM Plex Mono'; font-size: 1.45rem; }
        [data-testid="stTabs"] [data-baseweb="tab-list"] { gap: .35rem; border-bottom: 1px solid var(--dnc-border); }
        [data-testid="stTabs"] button { color: var(--dnc-muted); font-size: .78rem; letter-spacing: .02em; }
        [data-testid="stTabs"] button[aria-selected="true"] { color: var(--dnc-cyan); }
        [data-testid="stExpander"] { border: 1px solid var(--dnc-border); border-radius: 8px; background: rgba(9, 27, 44, .72); }
        [data-testid="stCode"] { border: 1px solid rgba(50, 211, 230, .16); border-radius: 7px; background: #030b14; }
        .dnc-table-wrap { overflow-x: auto; border: 1px solid var(--dnc-border); border-radius: 8px; background: rgba(4, 15, 27, .72); }
        .dnc-table { width: 100%; border-collapse: collapse; font-size: .76rem; }
        .dnc-table th { padding: .72rem .8rem; text-align: left; color: var(--dnc-cyan); background: rgba(18, 53, 78, .82); border-bottom: 1px solid var(--dnc-border); font: 600 .69rem 'IBM Plex Mono'; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap; }
        .dnc-table td { padding: .68rem .8rem; color: #cfe1ea; border-bottom: 1px solid rgba(65, 177, 211, .11); vertical-align: top; }
        .dnc-table tr:last-child td { border-bottom: 0; }
        .dnc-table tr:hover td { background: rgba(50, 211, 230, .035); }
        .dnc-table code { color: #a9eff4; font-size: .72rem; }
        .dnc-empty { max-width: 720px; margin: 4rem auto; padding: 2.2rem; text-align: center; border: 1px solid var(--dnc-border); border-radius: 12px; background: #081524; }
        .dnc-topology { color: #6bdbe6; font: 500 .78rem/1.5 'IBM Plex Mono'; white-space: pre; margin: 0 auto 1.4rem; text-align: center; }
        .dnc-empty-title { color: #e6f1ff; font-weight: 700; letter-spacing: .08em; }
        .dnc-empty-copy { color: #91a9bd; line-height: 1.8; }
        .dnc-fact { border-left: 3px solid #34d399 !important; }
        .dnc-observation { border-left: 3px solid #fbbf24 !important; }
        .dnc-unknown { border-left: 3px solid #94a3b8 !important; }
        .dnc-contradiction { border-left: 3px solid #fb7185 !important; }
        .dnc-cause { padding: 1rem 1.1rem; margin-bottom: .7rem; background: #0b1b2b; border: 1px solid #1b4058; border-left: 3px solid #3b82f6; border-radius: 8px; }
        hr { border-color: var(--dnc-border) !important; }
        a { color: var(--dnc-cyan) !important; }

        @media (max-width: 760px) {
            .dnc-header { align-items: flex-start; flex-direction: column; }
            .dnc-title { font-size: 1.25rem; }
            [data-testid="stMainBlockContainer"] { padding-left: 1rem; padding-right: 1rem; }
        }
        </style>
        """.replace("__DNC_SPACE_BACKGROUND__", background_uri),
        unsafe_allow_html=True,
    )


def init_db() -> None:
    DB_PATH.parent.mkdir(exist_ok=True)
    with sqlite3.connect(DB_PATH) as db:
        db.execute("CREATE TABLE IF NOT EXISTS incidents (id INTEGER PRIMARY KEY, created_at TEXT NOT NULL, title TEXT NOT NULL, sanitized_result TEXT NOT NULL)")


def render_sidebar() -> None:
    with st.sidebar:
        st.markdown("<div style='font:700 1.05rem Inter;color:#e6f1ff;letter-spacing:.08em'>DAUGLAS</div><div style='color:#60798e;font:600 .62rem IBM Plex Mono;letter-spacing:.14em;margin:.25rem 0 1rem'>OPERATIONS PLATFORM</div>", unsafe_allow_html=True)
        st.page_link("pages/1_Command_Centre.py", label="▣  Command Centre")
        st.page_link("app.py", label="＋  New Incident")
        st.page_link("pages/2_Diagnostic_Results.py", label="◉  Diagnostic Results")
        st.page_link("pages/3_Incident_History.py", label="⌁  Incident History")
        st.page_link("pages/4_Knowledge_Base.py", label="⌘  Knowledge Base")
        st.page_link("pages/5_Reports.py", label="▤  Reports")
        st.page_link("pages/6_System_Settings.py", label="⚙  System Settings")
        st.divider()
        st.markdown("<div class='dnc-live'><span class='dnc-dot'></span> READ-ONLY MODE</div><div style='margin-top:.45rem;color:#60798e;font:500 .65rem IBM Plex Mono'>v0.2.1 ALPHA</div>", unsafe_allow_html=True)


def render_operational_header(page_title: str, context: str = "Incident Analysis · Evidence Correlation · Safe Troubleshooting", result: dict[str, object] | None = None) -> None:
    incident = f"INCIDENT {html.escape(str(result['incident_id']))}" if result else "SYSTEM ONLINE"
    ai_state = "AI INVESTIGATOR READY" if result else "AI INVESTIGATOR OFF"
    st.markdown(
        f"""
        <div class="dnc-header">
          <div class="dnc-brand">
            <div class="dnc-mark">DNC</div>
            <div>
              <div class="dnc-title">DAUGLAS Network Copilot</div>
              <div class="dnc-subtitle">{html.escape(page_title)} · {html.escape(context)}</div>
            </div>
          </div>
          <div class="dnc-status-row">
            <span class="dnc-badge success">{incident}</span>
            <span class="dnc-badge cyan">READ-ONLY</span>
            <span class="dnc-badge">{ai_state}</span>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def save_result(result: dict[str, object]) -> int:
    with sqlite3.connect(DB_PATH) as db:
        cursor = db.execute("INSERT INTO incidents(created_at, title, sanitized_result) VALUES (?, ?, ?)", (datetime.now(timezone.utc).isoformat(), result["incident"]["title"], json.dumps(result)))
        return int(cursor.lastrowid)


def load_recent_incidents(limit: int = 20) -> list[dict[str, object]]:
    if not DB_PATH.exists():
        return []
    with sqlite3.connect(DB_PATH) as db:
        rows = db.execute(
            "SELECT id, created_at, title, sanitized_result FROM incidents ORDER BY created_at DESC LIMIT ?",
            (limit,),
        ).fetchall()
    return [
        {
            "id": row[0],
            "created_at": row[1],
            "title": row[2],
            "result": json.loads(row[3]),
        }
        for row in rows
    ]


def render_evidence_records(records: list[dict[str, object]]) -> None:
    """Render evidence without pandas, which is unreliable on synced drives."""
    columns = ("evidence_id", "source_type", "fact", "value", "status", "source_reference")
    labels = ("Evidence", "Source type", "Fact", "Value", "Status", "Reference")
    header = "".join(f"<th>{html.escape(label)}</th>" for label in labels)
    rows: list[str] = []
    for record in records:
        cells: list[str] = []
        for column in columns:
            value = record.get(column, "")
            rendered = html.escape(str(value))
            if column in {"evidence_id", "status"}:
                rendered = f"<code>{rendered}</code>"
            cells.append(f"<td>{rendered}</td>")
        rows.append("<tr>" + "".join(cells) + "</tr>")
    table = f'<div class="dnc-table-wrap"><table class="dnc-table"><thead><tr>{header}</tr></thead><tbody>{"".join(rows)}</tbody></table></div>'
    st.markdown(table, unsafe_allow_html=True)


def extract_evidence_timeline(raw: str) -> list[dict[str, str]]:
    """Extract only timestamped events literally present in supplied evidence."""
    events: list[dict[str, str]] = []
    timestamp_pattern = re.compile(r"(?P<time>(?:\d{4}-\d{2}-\d{2}[ T])?\d{1,2}:\d{2}:\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{1,2}:\d{2}:\d{2})", re.I)
    for line_number, line in enumerate(raw.splitlines(), 1):
        match = timestamp_pattern.search(line)
        if match:
            description = line[match.end():].strip(" :-") or "Timestamped evidence event"
            events.append({"time": match.group("time"), "description": description, "source": f"Evidence line {line_number}"})
    return events[:40]


def render_timeline(events: list[dict[str, str]]) -> None:
    if not events:
        st.info("No timestamped events were detected in the supplied evidence.")
        return
    items = []
    for event in events:
        items.append(f"<div style='display:grid;grid-template-columns:115px 14px 1fr;gap:.65rem;min-height:48px'><code style='color:#8ba6b8'>{html.escape(event['time'])}</code><span style='width:9px;height:9px;margin-top:.35rem;border-radius:50%;background:#22d3ee;box-shadow:0 0 0 4px rgba(34,211,238,.08)'></span><div><span style='color:#d7e7ef'>{html.escape(event['description'])}</span><br><small style='color:#60798e'>{html.escape(event['source'])}</small></div></div>")
    st.markdown("<div style='padding:1rem;background:#081524;border:1px solid #1b4058;border-radius:8px'>" + "".join(items) + "</div>", unsafe_allow_html=True)


def render_results(result: dict[str, object]) -> None:
    if not isinstance(result, dict):
        st.error("The analysis result is not in the expected dictionary format. Run a new analysis.")
        return
    st.success(f"Analysis complete. Secrets masked: {result['secrets_masked']}")
    st.warning("Advisory only: DAUGLAS v0.1 cannot connect to or change network devices.")
    analysis_id = result.get("analysis_id", "Not available")
    incident_id = result.get("incident_id", "Not available")
    generated_at = result.get("generated_at", "Not available")
    st.caption(f"Analysis ID: `{analysis_id}` · Incident ID: `{incident_id}` · Generated: {generated_at}")
    validation = result.get("validation", {"passed": False, "errors": ["This result uses an outdated analysis format. Run safe analysis again."]})
    if not validation.get("passed", False):
        st.error("Analysis validation failed. No diagnostic conclusion has been issued.")
        for error in validation.get("errors", ["Unknown validation error."]):
            st.write(f"- {error}")
        return
    v2_result = result.get("diagnostic_engine_v2")
    top_score = max((item["score"] for item in (v2_result or {}).get("hypotheses", [])), default=None)
    confidence = f"{top_score}/100" if top_score is not None else "Not scored"
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Primary domain", result["classification"]["primary_domain"])
    c2.metric("Root cause status", result["root_cause_status"])
    c3.metric("Diagnostic ranking", confidence)
    c4.metric("Safety mode", "READ-ONLY")
    secondary = result["classification"].get("secondary_domains", [])
    if secondary:
        st.caption("Secondary domains: " + ", ".join(secondary))
    investigations = result.setdefault("ai_investigations", {})
    accepted_count = sum(1 for item in investigations.values() if item.get("status") == "ACCEPTED")
    st.caption(f"AI Investigator: `{accepted_count} validated operation(s)` · Local model runs only when requested by the engineer")

    tabs = st.tabs(["Investigation", "Probable causes", "DAUGLAS Intelligence", "Diagnostic map", "Next safe tests", "Evidence detail", "Timeline", "Report"])
    with tabs[0]:
        investigation_left, investigation_right = st.columns(2)
        with investigation_left:
            with st.container(border=True):
                st.subheader("Confirmed facts")
                if not result["facts"]:
                    st.info("No facts directly proven yet.")
                for item in result["facts"]:
                    st.markdown(f"✓ **{item['statement']}**  \n`{item['source']}` · `{item['confidence']}`")
            with st.container(border=True):
                st.subheader("Engineer observations")
                if not result["observations"]:
                    st.info("No observations supplied.")
                for item in result["observations"]:
                    st.markdown(f"! {item['statement']}  \n`{item['confidence']}`")
        with investigation_right:
            with st.container(border=True):
                st.subheader("Assumptions")
                for item in result["assumptions"]:
                    st.markdown(f"△ {item['statement']} · `{item['confidence']}`")
            with st.container(border=True):
                st.subheader("Unknowns")
                for item in result["unknowns"]:
                    st.markdown(f"○ {item}")
            contradictions = (v2_result or {}).get("contradictions", [])
            if contradictions:
                with st.container(border=True):
                    st.subheader("Contradictions")
                    for item in contradictions:
                        st.error(item["statement"])
    with tabs[1]:
        scores = {item["title"]: item for item in (v2_result or {}).get("hypotheses", [])}
        for index, cause in enumerate(result["probable_causes"], 1):
            score = scores.get(cause["name"], {}).get("score")
            score_label = f"{score}/100" if score is not None else cause["confidence"]
            st.markdown(f"<div class='dnc-cause'><code>{index:02d}</code>&nbsp;&nbsp;<strong>{html.escape(cause['name'].upper())}</strong><span style='float:right;color:#74a7ff;font:600 .78rem IBM Plex Mono'>{html.escape(str(score_label))}</span><br><small style='color:#91a9bd'>{html.escape(cause['confidence'])}</small></div>", unsafe_allow_html=True)
            with st.expander("View supporting evidence and missing proof"):
                st.write(cause["why"])
                if cause["supporting_evidence"]:
                    st.markdown("**Supporting evidence**")
                    for evidence_item in cause["supporting_evidence"]:
                        st.write(f"✓ {evidence_item}")
                st.write("Evidence required:", ", ".join(cause["evidence_required"]))
    with tabs[2]:
        st.info("AI investigates and explains only. Network truth, command safety, and root-cause status remain deterministic.")
        explain_col, challenge_col, evidence_col = st.columns(3)
        requested: InvestigatorOperation | None = None
        if explain_col.button("Explain this incident", use_container_width=True):
            requested = InvestigatorOperation.EXPLAIN
        if challenge_col.button("Challenge current analysis", use_container_width=True):
            requested = InvestigatorOperation.CHALLENGE
        if evidence_col.button("Recommend next evidence", use_container_width=True):
            requested = InvestigatorOperation.NEXT_BEST_EVIDENCE
        if requested:
            with st.spinner("Running guarded local AI investigation…"):
                investigation = run_investigator(result, requested)
            investigations[requested.value] = investigation
            st.session_state["result"] = result

        for operation in (InvestigatorOperation.EXPLAIN, InvestigatorOperation.CHALLENGE, InvestigatorOperation.NEXT_BEST_EVIDENCE):
            investigation = investigations.get(operation.value)
            if not investigation:
                continue
            st.divider()
            st.subheader(operation.value.replace("_", " ").title())
            st.caption(f"Status: `{investigation['status']}` · Provider: `{investigation['provider']}` · Model: `{investigation['model']}`")
            if investigation["status"] != "ACCEPTED":
                st.error("AI analysis rejected or blocked. The deterministic diagnostic result remains available and unchanged.")
                st.code(investigation.get("rejection_reason") or "No rejection detail available")
                continue
            output = investigation["output"]
            if operation is InvestigatorOperation.EXPLAIN:
                st.markdown("#### Incident explanation")
                st.write(output["analysis_summary"])
                for item in output["evidence_explanations"]:
                    st.markdown(f"- **{', '.join(item['evidence_ids'])}** — {item['explanation']}")
                with st.expander("Technical summary"):
                    st.write(output["technical_summary"])
                with st.expander("Management summary"):
                    st.write(output["management_summary"])
            elif operation is InvestigatorOperation.CHALLENGE:
                st.warning(output["premature_conclusion"])
                st.write(output["challenge_reason"])
                for item in output["untested_alternatives"]:
                    st.markdown(f"- **{item['title']}** · `{item['support_level']}` · Evidence: `{', '.join(item['evidence_ids'])}`")
                    st.caption("Missing proof: " + ", ".join(item["missing_proof"]))
                st.markdown(f"**Disproof test concept:** {output['disproof_test']}")
            else:
                st.success(output["request"])
                st.write(output["reason"])
                st.caption("Based on evidence: " + ", ".join(output["evidence_ids"]))
                st.write("Separates:", ", ".join(output["separates_hypotheses"]) or "No existing hypothesis specified")
                if output["approved_command_ids"]:
                    approved_lookup = {item["command_id"]: item.get("command") for item in (result.get("diagnostic_engine_v2") or {}).get("tests", []) if item.get("command_id")}
                    for command_id in output["approved_command_ids"]:
                        st.markdown(f"Approved command ID: `{command_id}`")
                        if approved_lookup.get(command_id):
                            st.code(approved_lookup[command_id])
            if output.get("limitations"):
                st.caption("Limitations: " + " · ".join(output["limitations"]))
    with tabs[3]:
        v2 = result.get("diagnostic_engine_v2")
        if not v2:
            st.info("The v0.2 rule engine currently activates for Huawei and Cisco physical/fibre incidents. Additional knowledge packs will follow.")
        else:
            st.caption(f"Deterministic engine: `{v2['engine_version']}` · Evidence graph nodes: `{len(v2['evidence_graph']['nodes'])}`")
            selected_id = v2.get("selected_next_test_id")
            selected = next((item for item in v2["tests"] if item["test_id"] == selected_id), None)
            if selected:
                st.success(f"Safest next test: {selected['title']} · Diagnostic value {selected['diagnostic_value']}/100 · {selected['risk']}")
                if selected.get("command"):
                    st.code(selected["command"])
            st.subheader("Normalized evidence records")
            render_evidence_records(v2["evidence"])
            st.subheader("Explainable hypothesis ranking")
            for hypothesis in v2["hypotheses"]:
                st.markdown(f"**{hypothesis['score']}/100 · {hypothesis['title']}** — `{hypothesis['status']}`")
                st.caption(f"Rule: {hypothesis['rule_id']} · Supporting evidence: {', '.join(hypothesis['supporting_evidence_ids']) or 'none'}")
            if v2["contradictions"]:
                st.subheader("Contradictions")
                for contradiction in v2["contradictions"]:
                    st.warning(contradiction["statement"])
            with st.expander("Evidence graph data"):
                st.json(v2["evidence_graph"])
    with tabs[4]:
        for index, step in enumerate(result["troubleshooting_sequence"], 1):
            st.markdown(f"**{index}. {step['test']}** — `{step['safety']}`")
            st.code(step["command"])
            st.caption(step["why"])
            st.write("Healthy:", step["healthy_result"])
            st.write("Faulty:", step["faulty_result"])
            st.write("Next:", step["next_action"])
    with tabs[5]:
        evidence = {key: value for key, value in result["structured_evidence"].items() if key not in {"facts", "syslog_facts"} and value is not None and value != [] and value is not False}
        st.json(evidence)
    with tabs[6]:
        render_timeline(extract_evidence_timeline(result["incident"]["evidence"]))
    with tabs[7]:
        report = generate_report(result)
        st.markdown(report)
        st.download_button("Download Markdown report", report, file_name="dauglas_incident_report.md")


def main() -> None:
    st.set_page_config(page_title="DAUGLAS Network Copilot", page_icon="🛡️", layout="wide")
    apply_console_theme()
    render_sidebar()
    init_db()
    render_operational_header("Diagnostic Intelligence Console")
    st.markdown("### New incident analysis")
    st.caption("Enter only the current incident evidence. Results will open in a separate diagnostic view.")
    st.markdown("<div class='dnc-stage'><span>01 INCIDENT</span><i></i><span>02 ENVIRONMENT</span><i></i><span>03 EVIDENCE</span><i></i><span>04 REVIEW</span></div>", unsafe_allow_html=True)
    with st.form("incident"):
        with st.container(border=True):
            st.markdown("<div class='dnc-section-label'>01 · Incident Identity</div>", unsafe_allow_html=True)
            title = st.text_input("Incident title *", placeholder="Describe the primary technical symptom")
            identity_a, identity_b = st.columns(2)
            client = identity_a.text_input("Client/site alias")
            last_working = identity_b.text_input("Last known working time")

        with st.container(border=True):
            st.markdown("<div class='dnc-section-label'>02 · Technical Environment</div>", unsafe_allow_html=True)
            env_a, env_b, env_c = st.columns(3)
            vendor = env_a.selectbox("Vendor", ["Huawei", "Cisco", "Vendor-neutral"])
            device = env_b.selectbox("Device type", ["Switch", "Router", "Firewall", "WAC", "AP", "Server", "Unknown"])
            model = env_c.text_input("Device model")
            env_d, env_e, env_f, env_g = st.columns(4)
            technical_domain = env_d.selectbox("Technical domain", ["Auto-detect", "Physical/Fibre", "Switching/VLAN", "Routing", "DHCP/DNS", "WLAN", "Firewall"])
            network_layer = env_e.selectbox("Network layer", ["Auto-detect", "Physical", "Layer 2", "Layer 3", "Application"])
            affected_interface = env_f.text_input("Affected interface")
            upstream_device = env_g.text_input("Upstream device")

        with st.container(border=True):
            st.markdown("<div class='dnc-section-label'>03 · Behaviour Comparison</div>", unsafe_allow_html=True)
            expected_col, actual_col = st.columns(2)
            expected = expected_col.text_area("Expected behaviour", height=145)
            actual = actual_col.text_area("Actual behaviour", height=145)
            description = st.text_area("Incident description", height=110)

        with st.container(border=True):
            st.markdown("<div class='dnc-section-label'>04 · Evidence Console</div>", unsafe_allow_html=True)
            st.caption("COMMAND OUTPUT · SYSLOG · ENGINEER-SUPPLIED EVIDENCE")
            evidence = st.text_area("Command outputs and syslogs", height=300, placeholder="<HUAWEI> display interface GigabitEthernet0/0/24\nPhysical state: DOWN\nInput errors: 127\nCRC errors: 89", help="Paste evidence exactly as collected. Secrets are masked before storage.")
            st.caption("＋ Command output   ·   ＋ Syslog   ·   ＋ Engineer observation   ·   Diagram upload coming soon")

        with st.container(border=True):
            st.markdown("<div class='dnc-section-label'>05 · Impact and Engineering Notes</div>", unsafe_allow_html=True)
            impact_col, notes_col = st.columns(2)
            impact = impact_col.text_area("Business/service impact", height=125)
            notes = notes_col.text_area("Additional notes", height=125)
        submitted = st.form_submit_button("◉ START DIAGNOSTIC ANALYSIS", type="primary", use_container_width=True)
        st.caption("READ-ONLY ANALYSIS · NO DEVICE CONNECTION · NO CONFIGURATION EXECUTION · SECRETS AUTOMATICALLY MASKED")
    if submitted:
        if not title.strip():
            st.error("Incident title is required.")
            return
        try:
            result = analyze(Incident(title=title, client_alias=client, vendor=vendor, device_type=device, device_model=model, expected_behavior=expected, actual_behavior=actual, last_known_working=last_working, description=description, evidence=evidence, notes=notes, service_impact=impact, technical_domain=technical_domain, network_layer=network_layer, affected_interface=affected_interface, upstream_device=upstream_device))
            save_result(result)
        except Exception as exc:
            st.error("DAUGLAS could not complete this analysis safely. No diagnostic conclusion was issued.")
            st.code(f"{type(exc).__name__}: {exc}")
            st.caption("Your form remains available above. Correct the reported issue or disable local AI and try again.")
            return
        st.session_state["result"] = result
        st.switch_page("pages/2_Diagnostic_Results.py")


if __name__ == "__main__":
    main()
