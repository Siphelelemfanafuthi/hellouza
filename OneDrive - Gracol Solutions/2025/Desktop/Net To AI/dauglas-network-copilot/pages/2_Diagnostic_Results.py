"""Dedicated DAUGLAS diagnostic results page."""
from __future__ import annotations

import streamlit as st

from app import apply_console_theme, render_operational_header, render_results, render_sidebar


st.set_page_config(page_title="DAUGLAS · Diagnostic Results", page_icon="📊", layout="wide")
apply_console_theme()
render_sidebar()

result = st.session_state.get("result")
required_keys = {"analysis_id", "incident_id", "generated_at", "validation", "observations", "structured_evidence"}

if not isinstance(result, dict) or not required_keys.issubset(result):
    render_operational_header("Diagnostic Results", "Evidence workspace · No active session")
    st.markdown(
        """
        <div class="dnc-empty">
          <div class="dnc-topology">[ CORE ]
       /        \\
 [ SWITCH ]   [ WAC ]
      |
  [ CLIENT ]</div>
          <div class="dnc-empty-title">NO ACTIVE DIAGNOSTIC SESSION</div>
          <div class="dnc-empty-copy">
            Submit incident evidence to begin:<br>
            Fault-domain classification · Evidence correlation<br>
            Probable-cause ranking · Safe next-test selection
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    empty_left, empty_action, empty_right = st.columns([2, 1, 2])
    if empty_action.button("＋ Create new incident", type="primary", use_container_width=True):
        st.switch_page("app.py")
    st.stop()

render_operational_header("Diagnostic Results", f"{result['classification']['vendor']} · {result['classification']['device_type']} · {result['classification']['primary_domain']}", result)
nav_col, status_col = st.columns([1, 4])
if nav_col.button("← New incident", use_container_width=True):
    st.switch_page("app.py")
status_col.caption(f"ANALYSIS `{result['analysis_id']}` · GENERATED `{result['generated_at']}`")
render_results(result)
