import streamlit as st
import tempfile
import os
import sys

# Ensure nlp directory is on path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from resume_analyzer import analyze_resume

st.set_page_config(
    page_title="SynapCV — AI Resume Intelligence & ATS Scoring",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Premium Custom CSS matching modern Obsidian & Teal design system
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

html, body, [class*="css"] {
    font-family: 'Inter', sans-serif;
}

.stApp {
    background-color: #070b14;
    color: #f1f5f9;
    background-image: 
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20, 184, 166, 0.12), transparent),
        radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.05), transparent);
}

.synap-header {
    padding: 32px 36px;
    border-radius: 24px;
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    margin-bottom: 28px;
    text-align: center;
}

.synap-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(20, 184, 166, 0.12);
    border: 1px solid rgba(20, 184, 166, 0.3);
    color: #5eead4;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 12px;
}

.synap-header h1 {
    font-size: 42px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #ffffff;
    margin: 0;
}

.synap-header p {
    font-size: 15px;
    color: #94a3b8;
    max-width: 650px;
    margin: 10px auto 0;
}

.synap-card {
    padding: 24px;
    border-radius: 20px;
    background: rgba(15, 23, 42, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    margin-bottom: 20px;
}

.score-hero-card {
    text-align: center;
    padding: 28px;
    border-radius: 24px;
    background: linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(4, 47, 46, 0.6));
    border: 1px solid rgba(20, 184, 166, 0.4);
    box-shadow: 0 0 30px rgba(20, 184, 166, 0.15);
}

.score-number {
    font-size: 56px;
    font-weight: 900;
    font-family: 'JetBrains Mono', monospace;
    color: #2dd4bf;
    line-height: 1;
    margin: 8px 0;
}

.skill-pill {
    display: inline-block;
    padding: 6px 12px;
    margin: 4px;
    border-radius: 8px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.35);
    color: #6ee7b7;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 500;
}

.missing-pill {
    display: inline-block;
    padding: 6px 12px;
    margin: 4px;
    border-radius: 8px;
    background: rgba(244, 63, 94, 0.12);
    border: 1px solid rgba(244, 63, 94, 0.35);
    color: #fda4af;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 500;
}

.extra-pill {
    display: inline-block;
    padding: 6px 12px;
    margin: 4px;
    border-radius: 8px;
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.35);
    color: #c7d2fe;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 500;
}

.keyword-pill {
    display: inline-block;
    padding: 6px 12px;
    margin: 4px;
    border-radius: 8px;
    background: rgba(6, 182, 212, 0.12);
    border: 1px solid rgba(6, 182, 212, 0.35);
    color: #67e8f9;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
}

.bullet-box {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 14px 18px;
    border-radius: 12px;
    margin-bottom: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #e2e8f0;
    line-height: 1.5;
}
</style>
""", unsafe_allow_html=True)

# Hero Header
st.markdown("""
<div class="synap-header">
    <div class="synap-badge">Neural ATS Engine · v2.0</div>
    <h1>Synap<span style="color: #2dd4bf;">CV</span></h1>
    <p>AI-Powered Resume Analysis & Job Match Scoring System using PyMuPDF, Rule-based NLP, Sentence Transformers, and Groq LLM.</p>
</div>
""", unsafe_allow_html=True)

# Main 2-column input layout
col_left, col_right = st.columns([1, 1], gap="medium")

with col_left:
    st.markdown('<div class="synap-card">', unsafe_allow_html=True)
    st.markdown("### 📄 Candidate Resume")
    st.caption("Upload multi-page resume PDF for PyMuPDF parsing")
    uploaded_file = st.file_uploader(
        "Upload PDF",
        type=["pdf"],
        label_visibility="collapsed"
    )
    if uploaded_file:
        st.success(f"✓ Ready: {uploaded_file.name}")
    st.markdown('</div>', unsafe_allow_html=True)

with col_right:
    st.markdown('<div class="synap-card">', unsafe_allow_html=True)
    st.markdown("### 💼 Target Job Description")
    st.caption("Paste requirements, responsibilities, and qualifications")
    job_description = st.text_area(
        "Job Description Text",
        height=190,
        placeholder="Paste target job description here...",
        label_visibility="collapsed"
    )
    st.markdown('</div>', unsafe_allow_html=True)

analyze_btn = st.button("⚡ Run SynapCV Analysis Pipeline", use_container_width=True, type="primary")

if analyze_btn:
    if uploaded_file is None:
        st.error("Please upload a resume PDF to analyze.")
    elif not job_description.strip():
        st.error("Please provide the target job description.")
    else:
        with st.spinner("Analyzing resume with Sentence Transformers & Groq LLM..."):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_file.write(uploaded_file.read())
                temp_path = temp_file.name

            try:
                result = analyze_resume(temp_path, job_description)
            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)

        st.success("Pipeline executed successfully!")

        final_score = result["final_result"]["final_score"]
        final_label = result["final_result"].get("final_label", "Evaluated")
        semantic_score = result["semantic_match"]["semantic_score"]
        semantic_label = result["semantic_match"].get("semantic_label", "Evaluated")
        skill_score = result["gap_analysis"]["skill_match_score"]

        # 1. Match Overview
        st.markdown("## 📊 Alignment Overview")

        col1, col2, col3 = st.columns([1.2, 1, 1])

        with col1:
            st.markdown(f"""
            <div class="score-hero-card">
                <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8;">
                    Final ATS Alignment
                </div>
                <div class="score-number">{final_score}</div>
                <div style="font-size: 12px; font-weight: 700; color: #5eead4; text-transform: uppercase;">
                    {final_label}
                </div>
            </div>
            """, unsafe_allow_html=True)

        with col2:
            st.metric("Semantic Resonance", f"{semantic_score}/100", delta=semantic_label)
            st.progress(min(int(semantic_score), 100))
            st.caption("384-d dense vector embeddings via all-MiniLM-L6-v2")

        with col3:
            st.metric("Skill Coverage", f"{skill_score}/100")
            st.progress(min(int(skill_score), 100))
            st.caption(f"{len(result['gap_analysis']['matched_skills'])} matched / {len(result['gap_analysis']['matched_skills']) + len(result['gap_analysis']['missing_skills'])} target")

        st.divider()

        # 2. Skill Gap Intelligence Matrix
        st.markdown("## 🎯 Skill Intelligence Matrix")

        sc1, sc2, sc3 = st.columns(3)

        with sc1:
            st.markdown('<div class="synap-card">', unsafe_allow_html=True)
            st.markdown(f"#### ✅ Matched Skills ({len(result['gap_analysis']['matched_skills'])})")
            matched = result["gap_analysis"]["matched_skills"]
            if matched:
                st.markdown("".join([f'<span class="skill-pill">{s}</span>' for s in matched]), unsafe_allow_html=True)
            else:
                st.warning("No matched skills found.")
            st.markdown('</div>', unsafe_allow_html=True)

        with sc2:
            st.markdown('<div class="synap-card">', unsafe_allow_html=True)
            st.markdown(f"#### ❌ Missing Skills ({len(result['gap_analysis']['missing_skills'])})")
            missing = result["gap_analysis"]["missing_skills"]
            if missing:
                st.markdown("".join([f'<span class="missing-pill">{s}</span>' for s in missing]), unsafe_allow_html=True)
            else:
                st.success("No critical skill gaps detected!")
            st.markdown('</div>', unsafe_allow_html=True)

        with sc3:
            st.markdown('<div class="synap-card">', unsafe_allow_html=True)
            st.markdown(f"#### ➕ Additional Strengths ({len(result['gap_analysis']['extra_skills'])})")
            extra = result["gap_analysis"]["extra_skills"]
            if extra:
                st.markdown("".join([f'<span class="extra-pill">{s}</span>' for s in extra]), unsafe_allow_html=True)
            else:
                st.info("No additional skills.")
            st.markdown('</div>', unsafe_allow_html=True)

        st.divider()

        # 3. AI Suggestions Hub
        st.markdown("## 🤖 Groq LLM Intelligence Hub")

        suggestions = result.get("ai_suggestions", {})

        if isinstance(suggestions, dict):
            with st.container():
                st.markdown('<div class="synap-card">', unsafe_allow_html=True)
                st.markdown("#### 💬 Recruiter Feedback")
                st.write(suggestions.get("overall_feedback", "No feedback available."))

                st.markdown("#### 🔑 Missing ATS Keywords")
                keywords = suggestions.get("missing_keywords", [])
                if keywords:
                    st.markdown("".join([f'<span class="keyword-pill">{kw}</span>' for kw in keywords]), unsafe_allow_html=True)
                else:
                    st.write("No missing keywords returned.")

                st.markdown("#### 🚀 Actionable Improvements")
                for item in suggestions.get("top_improvements", []):
                    st.write(f"• {item}")

                st.markdown("#### ⭐ ATS-Optimized Bullet Point Rewrites")
                for bullet in suggestions.get("rewritten_bullets", []):
                    st.markdown(f'<div class="bullet-box">✓ {bullet}</div>', unsafe_allow_html=True)

                if suggestions.get("final_advice"):
                    st.info(f"**Final Verdict**: {suggestions.get('final_advice')}")

                st.markdown('</div>', unsafe_allow_html=True)
        else:
            st.write(suggestions)

st.markdown("""
<div style="text-align: center; color: #64748b; margin-top: 50px; font-size: 13px;">
    SynapCV Engine · PyMuPDF · Sentence Transformers · Groq API
</div>
""", unsafe_allow_html=True)
