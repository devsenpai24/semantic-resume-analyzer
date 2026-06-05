from resume_analyzer import analyze_resume

file_path = "/Users/Devgi/Desktop/scorify/dev2026resume.pdf"

job_description = """
We are hiring a Software Developer Intern with skills in Python, FastAPI,
SQL, React, Docker, Git, REST API, and Machine Learning.
Experience with NLP and JavaScript is a plus.
"""

result = analyze_resume(file_path, job_description)

print(result)