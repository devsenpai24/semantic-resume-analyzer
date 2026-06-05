import streamlit as st
import tempfile
from resume_analyzer import analyze_resume

st.set_page_config(
    page_title="ResumeFit AI",
    page_icon="📄",
    layout="wide"
)

st.markdown("""
<style>
.stApp {
    background: linear-gradient(135deg, #0f172a 0%, #111827 45%, #020617 100%);
    color: white;
}

.hero {
    padding: 35px;
    border-radius: 25px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
    margin-bottom: 30px;
}

.hero h1 {
    font-size: 48px;
    font-weight: 800;
    margin-bottom: 8px;
}

.hero p {
    font-size: 18px;
    color: #cbd5e1;
}

.card {
    padding: 25px;
    border-radius: 22px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 12px 35px rgba(0,0,0,0.25);
    margin-bottom: 20px;
}

.score-card {
    text-align: center;
    padding: 30px;
    border-radius: 24px;
    background: linear-gradient(135deg, #06b6d4, #2563eb);
    box-shadow: 0 15px 40px rgba(37,99,235,0.35);
}

.score {
    font-size: 58px;
    font-weight: 900;
}

.skill-pill {
    display: inline-block;
    padding: 8px 14px;
    margin: 6px;
    border-radius: 999px;
    background: rgba(34,197,94,0.18);
    border: 1px solid rgba(34,197,94,0.5);
    color: #bbf7d0;
    font-size: 14px;
}

.missing-pill {
    display: inline-block;
    padding: 8px 14px;
    margin: 6px;
    border-radius: 999px;
    background: rgba(239,68,68,0.18);
    border: 1px solid rgba(239,68,68,0.5);
    color: #fecaca;
    font-size: 14px;
}

.keyword-pill {
    display: inline-block;
    padding: 8px 14px;
    margin: 6px;
    border-radius: 999px;
    background: rgba(59,130,246,0.18);
    border: 1px solid rgba(59,130,246,0.5);
    color: #bfdbfe;
    font-size: 14px;
}

.footer {
    text-align: center;
    color: #94a3b8;
    margin-top: 40px;
    font-size: 14px;
}
</style>
""", unsafe_allow_html=True)


st.markdown("""
<div class="hero">
    <h1>📄 ResumeFit AI</h1>
    <p>AI-powered resume and job description matcher using NLP, semantic similarity, and Groq suggestions.</p>
</div>
""", unsafe_allow_html=True)


left, right = st.columns([1, 1])

with left:
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.subheader("📤 Upload Resume")
    uploaded_file = st.file_uploader(
        "Upload your resume PDF",
        type=["pdf"],
        label_visibility="collapsed"
    )
    if uploaded_file:
        st.success(f"Uploaded: {uploaded_file.name}")
    st.markdown('</div>', unsafe_allow_html=True)

with right:
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.subheader("💼 Job Description")
    job_description = st.text_area(
        "Paste JD",
        height=220,
        placeholder="Paste the job description here...",
        label_visibility="collapsed"
    )
    st.markdown('</div>', unsafe_allow_html=True)


analyze_btn = st.button("🚀 Analyze Resume", use_container_width=True)

if analyze_btn:
    if uploaded_file is None:
        st.error("Please upload a resume PDF.")
    elif not job_description.strip():
        st.error("Please paste a job description.")
    else:
        with st.spinner("Analyzing resume with NLP + Groq..."):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_file.write(uploaded_file.read())
                temp_path = temp_file.name

            result = analyze_resume(temp_path, job_description)

        st.success("Analysis complete!")

        final_score = result["final_result"]["final_score"]
        semantic_score = result["semantic_match"]["semantic_score"]
        skill_score = result["gap_analysis"]["skill_match_score"]

        st.markdown("## 📊 Match Overview")

        col1, col2, col3 = st.columns([1.2, 1, 1])

        with col1:
            st.markdown(f"""
            <div class="score-card">
                <div>Overall Match Score</div>
                <div class="score">{final_score}</div>
                <div>/100</div>
            </div>
            """, unsafe_allow_html=True)

        with col2:
            st.metric("Semantic Match", f"{semantic_score}/100")
            st.progress(min(int(semantic_score), 100))

        with col3:
            st.metric("Skill Match", f"{skill_score}/100")
            st.progress(min(int(skill_score), 100))

        st.divider()

        skill_col1, skill_col2 = st.columns(2)

        with skill_col1:
            st.markdown('<div class="card">', unsafe_allow_html=True)
            st.subheader("✅ Matched Skills")
            matched = result["gap_analysis"]["matched_skills"]
            if matched:
                st.markdown(
                    "".join([f'<span class="skill-pill">{skill}</span>' for skill in matched]),
                    unsafe_allow_html=True
                )
            else:
                st.warning("No matched skills found.")
            st.markdown('</div>', unsafe_allow_html=True)

        with skill_col2:
            st.markdown('<div class="card">', unsafe_allow_html=True)
            st.subheader("❌ Missing Skills")
            missing = result["gap_analysis"]["missing_skills"]
            if missing:
                st.markdown(
                    "".join([f'<span class="missing-pill">{skill}</span>' for skill in missing]),
                    unsafe_allow_html=True
                )
            else:
                st.success("No major missing skills detected.")
            st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.subheader("📌 Extracted Skills")

        c1, c2 = st.columns(2)
        with c1:
            st.write("**Resume Skills**")
            st.write(result["resume_skills"])

        with c2:
            st.write("**JD Skills**")
            st.write(result["jd_skills"])

        st.markdown('</div>', unsafe_allow_html=True)

        st.divider()

        st.markdown("## 🤖 AI Suggestions")

        suggestions = result.get("ai_suggestions", {})

        st.markdown('<div class="card">', unsafe_allow_html=True)

        if isinstance(suggestions, dict):
            st.subheader("Overall Feedback")
            st.write(suggestions.get("overall_feedback", "No feedback found."))

            st.subheader("Missing Keywords")
            keywords = suggestions.get("missing_keywords", [])

            if keywords:
                st.markdown(
                    "".join([f'<span class="keyword-pill">{kw}</span>' for kw in keywords]),
                    unsafe_allow_html=True
                )
            else:
                st.write("No missing keywords returned.")

            st.subheader("Top Improvements")
            for item in suggestions.get("top_improvements", []):
                st.write(f"✅ {item}")

            st.subheader("Rewritten Resume Bullets")
            for bullet in suggestions.get("rewritten_bullets", []):
                st.write(f"• {bullet}")

            st.subheader("Final Advice")
            st.info(suggestions.get("final_advice", ""))
        else:
            st.write(suggestions)

        st.markdown('</div>', unsafe_allow_html=True)

st.markdown("""
<div class="footer">
    Built with Streamlit · NLP · Sentence Transformers · Groq
</div>
""", unsafe_allow_html=True)