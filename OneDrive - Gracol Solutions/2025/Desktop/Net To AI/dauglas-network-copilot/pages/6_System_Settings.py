"""System settings placeholder."""
import streamlit as st
from app import apply_console_theme, render_operational_header, render_sidebar

st.set_page_config(page_title="DAUGLAS · System Settings", page_icon="⚙", layout="wide")
apply_console_theme(); render_sidebar(); render_operational_header("System Settings", "Safety policies · Local provider · Runtime status")
c1, c2 = st.columns(2)
with c1:
    with st.container(border=True):
        st.markdown("#### Safety policy")
        st.write("Mode: READ-ONLY")
        st.write("Automatic execution: DISABLED")
        st.write("Automatic remediation: DISABLED")
with c2:
    with st.container(border=True):
        st.markdown("#### Local AI provider")
        st.write("Provider: Ollama")
        st.write("Model: llama3.2:1b")
        st.caption("AI cannot alter deterministic network truth or safety decisions.")
