import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


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