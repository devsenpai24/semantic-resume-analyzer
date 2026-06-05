import json
import os

import streamlit as st
from dotenv import load_dotenv
from groq import Groq, GroqError

load_dotenv()

_client = None


def get_groq_client():
    """Create the Groq client lazily; never at module import time."""
    global _client
    if _client is not None:
        return _client

    api_key = None
    try:
        api_key = st.secrets["GROQ_API_KEY"]
    except (KeyError, FileNotFoundError, AttributeError):
        api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        st.error(
            "GROQ_API_KEY is missing. Add it in Streamlit Cloud → "
            "Manage app → Settings → Secrets:\n\n"
            'GROQ_API_KEY = "your_key_here"'
        )
        return None

    try:
        _client = Groq(api_key=api_key)
        return _client
    except GroqError as e:
        st.error(f"Failed to initialize Groq client: {e}")
        return None


def get_resume_suggestions_json(
    resume_text: str,
    jd_text: str,
    matched_skills: list,
    missing_skills: list,
    final_score: float,
) -> dict:
    prompt = f"""
You are an expert resume reviewer and technical recruiter.

Return ONLY valid JSON. No markdown.

Schema:
{{
  "overall_feedback": "",
  "missing_keywords": [],
  "top_improvements": [],
  "rewritten_bullets": [],
  "final_advice": ""
}}

Data:
Final Score: {final_score}/100
Matched Skills: {matched_skills}
Missing Skills: {missing_skills}

Resume:
{resume_text[:5000]}

Job Description:
{jd_text[:3000]}

Rules:
- Do not invent fake experience.
- Suggestions must be practical.
- Rewritten bullets should improve wording only.
- Keep feedback concise and useful.
"""

    client = get_groq_client()
    if client is None:
        return {
            "overall_feedback": "AI suggestions are unavailable.",
            "missing_keywords": missing_skills,
            "top_improvements": [
                "Configure GROQ_API_KEY in Streamlit secrets to enable AI suggestions."
            ],
            "rewritten_bullets": [],
            "final_advice": "NLP scoring still works; only Groq suggestions need the API key.",
        }

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You return only valid JSON for resume analysis."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=1200,
        )

        content = response.choices[0].message.content
        return json.loads(content)

    except Exception as e:
        return {
            "overall_feedback": "Groq suggestion generation failed.",
            "missing_keywords": [],
            "top_improvements": [str(e)],
            "rewritten_bullets": [],
            "final_advice": "Check your GROQ_API_KEY and model name."
        }
