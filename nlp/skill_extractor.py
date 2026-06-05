import re
from typing import List, Set, Dict
SKILL_ALIASES: Dict[str, List[str]] = {
    "python": ["python"],
    "c": [" c "],
    "c++": ["c++", "cpp"],
    "java": ["java"],
    "javascript": ["javascript", "js"],
    "typescript": ["typescript", "ts"],
    "html": ["html"],
    "css": ["css"],
    "react": ["react", "reactjs", "react.js"],
    "redux": ["redux", "redux toolkit"],
    "node.js": ["node", "nodejs", "node.js"],
    "express.js": ["express", "expressjs", "express.js"],
    "fastapi": ["fastapi"],
    "flask": ["flask"],
    "django": ["django"],
    "sql": ["sql", "mysql", "postgresql", "postgres", "sqlite"],
    "mongodb": ["mongodb", "mongo"],
    "firebase": ["firebase"],
    "git": ["git", "github"],
    "rest api": ["rest api", "restful api", "api integration", "api"],
    "nlp": ["nlp", "natural language processing"],
    "machine learning": ["machine learning", "ml"],
    "deep learning": ["deep learning", "dl"],
    "generative ai": ["generative ai", "genai"],
    "llm": ["llm", "large language model", "large language models"],
    "transformers": ["transformers", "bert"],
    "pandas": ["pandas"],
    "numpy": ["numpy"],
    "matplotlib": ["matplotlib"],
    "scikit-learn": ["scikit-learn", "sklearn"],
    "opencv": ["opencv", "cv2"],
    "spacy": ["spacy"],
    "nltk": ["nltk"],
    "tailwind css": ["tailwind", "tailwind css"],
    "angular": ["angular", "angularjs", "angular.js"],
    "vue.js": ["vue", "vuejs", "vue.js"],
    "kotlin": ["kotlin"],
    "swift": ["swift"],
    "flutter": ["flutter"],
    "dart": ["dart"],
    "aws": ["aws", "amazon web services"],
    "azure": ["azure", "microsoft azure"],
    "gcp": ["gcp", "google cloud platform"],
    "docker": ["docker"],
    "kubernetes": ["kubernetes", "k8s"],
    "terraform": ["terraform"],
    "ansible": ["ansible"],
    "linux": ["linux", "unix"],
    "bash": ["bash", "shell scripting"],
    "power bi": ["power bi", "pbi"],
    "tableau": ["tableau"],
    "hadoop": ["hadoop"],
    "spark": ["spark", "apache spark"],
    "elasticsearch": ["elasticsearch", "elastic search"],
    "kafka": ["kafka", "apache kafka"],
    "graphql": ["graphql"],
    "selenium": ["selenium"],
    "pytest": ["pytest"],
    "junit": ["junit"],
    "robot framework": ["robot framework", "robot"],
    "tensorflow": ["tensorflow", "tf"],
    "keras": ["keras"],
    "pytorch": ["pytorch", "torch"],
    "xgboost": ["xgboost"],
    "lightgbm": ["lightgbm", "lgbm"],
    "airflow": ["airflow", "apache airflow"],
    "snowflake": ["snowflake"],
    "bigquery": ["bigquery", "google bigquery"],
    "redshift": ["redshift", "amazon redshift"],
    "databricks": ["databricks"],
    "spark sql": ["spark sql"],
    "hive": ["hive", "apache hive"],
    "cassandra": ["cassandra", "apache cassandra"],
    "jenkins": ["jenkins"],
    "circleci": ["circleci"],
    "travis ci": ["travis ci", "travis"],
    "jira": ["jira"],
    "confluence": ["confluence"],
    "figma": ["figma"],
    "adobe xd": ["adobe xd", "xd"],
    "photoshop": ["photoshop", "adobe photoshop"],
    "illustrator": ["illustrator", "adobe illustrator"]
}

def normalize_for_skill_search(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9+#./\-\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return f" {text.strip()} "

def extract_skills(text: str) -> List[str]:
    normalized_text = normalize_for_skill_search(text)
    found: Set[str] = set()

    for canonical_skill, aliases in SKILL_ALIASES.items():
        for alias in aliases:
            alias_norm = f" {alias.lower()} "
            if alias_norm in normalized_text:
                found.add(canonical_skill)
                break

    return sorted(found)