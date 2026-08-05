"""Knowledge base placeholder."""
import streamlit as st
from app import apply_console_theme, render_operational_header, render_sidebar

st.set_page_config(page_title="DAUGLAS · Knowledge Base", page_icon="⌘", layout="wide")
apply_console_theme(); render_sidebar(); render_operational_header("Knowledge Base", "Approved rules · Vendor catalogues · Engineering playbooks")
st.markdown("<div class='dnc-empty'><div class='dnc-empty-title'>APPROVED KNOWLEDGE LIBRARY</div><div class='dnc-empty-copy'>Vendor documents, controlled troubleshooting playbooks and approved knowledge retrieval will be introduced in v0.2.3.<br>Unapproved internet search will remain disabled.</div></div>", unsafe_allow_html=True)
