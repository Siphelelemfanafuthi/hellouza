"""Incident history and audit trail."""
import html
import streamlit as st
from app import apply_console_theme, load_recent_incidents, render_operational_header, render_sidebar

st.set_page_config(page_title="DAUGLAS · Incident History", page_icon="⌁", layout="wide")
apply_console_theme(); render_sidebar(); render_operational_header("Incident History", "Validated investigations · Evidence retention · Audit trail")

incidents = load_recent_incidents(25)
if not incidents:
    st.markdown("<div class='dnc-empty'><div class='dnc-empty-title'>NO INCIDENTS FOUND</div><div class='dnc-empty-copy'>Run a new analysis to begin building an audit trail. All results are sanitized before storage.</div></div>", unsafe_allow_html=True)
else:
    st.markdown(f"<div class='dnc-section-label'>Recent incidents ({len(incidents)})</div>", unsafe_allow_html=True)
    for incident in incidents:
        result = incident["result"]
        metadata = result.get("analysis_metadata", {})
        st.markdown(
            f"<div style='padding:1rem;margin-bottom:1rem;border:1px solid rgba(65,177,211,.22);border-radius:12px;background:rgba(7,19,32,.92)'>"
            f"<strong>{html.escape(incident['title'])}</strong> &middot; {html.escape(incident['created_at'])}<br>"
            f"Analysis ID: <code>{html.escape(result.get('analysis_id','N/A'))}</code> &middot; "
            f"Status: <code>{html.escape(str(result.get('validation',{{}}).get('passed', False)))}</code> &middot; "
            f"Engine: <code>{html.escape(metadata.get('engine_version','unknown'))}</code> &middot; "
            f"Parser: <code>{html.escape(metadata.get('vendor_parser','unknown'))}</code>"
            f"</div>",
            unsafe_allow_html=True,
        )
        with st.expander(f"View incident {incident['id']} details"):
            st.write(result.get("incident", {}))
            st.write({
                "primary_domain": result["classification"]["primary_domain"],
                "root_cause_status": result["root_cause_status"],
                "facts": len(result.get("facts", [])),
                "observations": len(result.get("observations", [])),
            })
