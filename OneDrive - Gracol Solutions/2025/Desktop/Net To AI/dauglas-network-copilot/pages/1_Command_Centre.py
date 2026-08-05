"""DAUGLAS operational command centre."""
import streamlit as st

from app import apply_console_theme, render_operational_header, render_sidebar

st.set_page_config(page_title="DAUGLAS · Command Centre", page_icon="▣", layout="wide")
apply_console_theme()
render_sidebar()
render_operational_header("Command Centre", "Platform readiness · Safety posture · Diagnostic services")

st.markdown("### Operational readiness")
c1, c2, c3, c4 = st.columns(4)
c1.metric("Network Truth Engine", "ONLINE")
c2.metric("Safety Engine", "READ-ONLY")
c3.metric("AI Investigator", "READY")
c4.metric("Knowledge Packs", "1 APPROVED")

left, right = st.columns(2)
with left:
    with st.container(border=True):
        st.markdown("#### Start an investigation")
        st.write("Create a sanitized, evidence-led incident analysis using deterministic classification and approved troubleshooting rules.")
        if st.button("＋ New incident", type="primary", use_container_width=True):
            st.switch_page("app.py")
with right:
    with st.container(border=True):
        st.markdown("#### Current safety boundary")
        st.write("No SSH connections · No command execution · No configuration changes · No automatic remediation")
        st.caption("The engineer remains the decision authority.")
