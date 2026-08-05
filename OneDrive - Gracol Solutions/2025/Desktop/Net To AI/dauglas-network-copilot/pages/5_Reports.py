"""Reports placeholder."""
import streamlit as st
from app import apply_console_theme, render_operational_header, render_sidebar

st.set_page_config(page_title="DAUGLAS · Reports", page_icon="▤", layout="wide")
apply_console_theme(); render_sidebar(); render_operational_header("Reports", "Technical output · Management summaries · Lessons learned")
st.markdown("<div class='dnc-empty'><div class='dnc-empty-title'>REPORT CENTRE</div><div class='dnc-empty-copy'>Open an active Diagnostic Result to download its evidence-linked technical report.<br>Central report history and approved lessons will be added later.</div></div>", unsafe_allow_html=True)
