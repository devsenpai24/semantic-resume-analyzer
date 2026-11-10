// Standalone evaluator fallback replicating SynapCV Python NLP engine
const SKILL_ALIASES = {
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
  "selenium": ["selenium"]
};

export const SKILL_CATEGORIES = {
  "Languages": ["python", "c", "c++", "java", "javascript", "typescript", "html", "css", "kotlin", "swift", "dart", "bash"],
  "Frameworks": ["react", "redux", "node.js", "express.js", "fastapi", "flask", "django", "angular", "vue.js", "tailwind css", "flutter"],
  "Cloud & DevOps": ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "linux", "git"],
  "AI & ML": ["nlp", "machine learning", "deep learning", "generative ai", "llm", "transformers", "pandas", "numpy", "matplotlib", "scikit-learn", "opencv", "spacy", "nltk"],
  "Databases & Data": ["sql", "mongodb", "firebase", "power bi", "tableau", "hadoop", "spark", "elasticsearch", "kafka", "graphql", "rest api", "selenium"]
};

export function cleanText(text) {
  if (!text) return "";
  let cleaned = text.toLowerCase();
  cleaned = cleaned.replace(/[^\w\s\+\#\.\-]/g, ' ');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

export function extractSkills(cleanedText) {
  const found = new Set();
  const padded = ` ${cleanedText} `;

  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    for (const alias of aliases) {
      const pattern = new RegExp(`(^|[^a-zA-Z0-9_\\+\\#])${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[^a-zA-Z0-9_\\+\\#]|$)`, 'i');
      if (pattern.test(padded)) {
        found.add(canonical);
        break;
      }
    }
  }
  return Array.from(found).sort();
}

export function computeClientFallback(resumeText, jdText) {
  const cleanedResume = cleanText(resumeText);
  const cleanedJd = cleanText(jdText);

  const resumeSkills = extractSkills(cleanedResume);
  const jdSkills = extractSkills(cleanedJd);

  const resumeSet = new Set(resumeSkills);
  const jdSet = new Set(jdSkills);

  const matched = jdSkills.filter(s => resumeSet.has(s));
  const missing = jdSkills.filter(s => !resumeSet.has(s));
  const extra = resumeSkills.filter(s => !jdSet.has(s));

  const skillScore = jdSkills.length > 0 
    ? Math.round((matched.length / jdSkills.length) * 1000) / 10 
    : 70;

  // Approximate semantic similarity via shared conceptual density & token overlap
  const resumeWords = new Set(cleanedResume.split(' '));
  const jdWords = cleanedJd.split(' ').filter(w => w.length > 3);
  let overlapCount = 0;
  for (const w of jdWords) {
    if (resumeWords.has(w)) overlapCount++;
  }
  const tokenOverlap = jdWords.length > 0 ? (overlapCount / jdWords.length) : 0.5;
  const semanticScore = Math.min(96, Math.max(45, Math.round((0.55 * skillScore + tokenOverlap * 100 * 0.45) * 10) / 10));

  const finalScore = Math.round(((0.6 * skillScore) + (0.4 * semanticScore)) * 10) / 10;

  let label = "Average fit";
  if (finalScore >= 80) label = "Excellent fit";
  else if (finalScore >= 65) label = "Good fit";
  else if (finalScore >= 50) label = "Average fit";
  else if (finalScore >= 35) label = "Low fit";
  else label = "Poor fit";

  return {
    success: true,
    resume_skills: resumeSkills,
    jd_skills: jdSkills,
    gap_analysis: {
      matched_skills: matched,
      missing_skills: missing,
      extra_skills: extra,
      skill_match_score: skillScore
    },
    semantic_match: {
      semantic_score: semanticScore,
      semantic_label: semanticScore >= 80 ? "Strong match" : semanticScore >= 60 ? "Moderate match" : "Weak match"
    },
    final_result: {
      final_score: finalScore,
      final_label: label
    },
    ai_suggestions: {
      overall_feedback: `The candidate demonstrates strong alignment in core stack requirements (${matched.slice(0, 4).join(', ')}). Improving direct mentions of target enterprise tooling will push this resume past senior ATS thresholds.`,
      missing_keywords: missing.length > 0 ? missing : ["CI/CD pipelines", "System Architecture", "Performance Benchmarking"],
      top_improvements: [
        missing.length > 0 ? `Integrate required target technologies: ${missing.slice(0, 3).join(', ')} into your bullet points.` : "Highlight quantifiable system scale metrics (e.g. throughput, latency).",
        "Adopt standard STAR framework (Situation, Task, Action, Result) in recent professional experience.",
        "Emphasize technical leadership, code review cadence, and architectural decision records."
      ],
      rewritten_bullets: [
        "Architected and deployed resilient microservices reducing API latency by 34% while scaling to 10M+ daily events.",
        "Spearheaded automated CI/CD deployment pipelines using containerized test suites, eliminating manual deployment overhead."
      ],
      final_advice: "Your profile exhibits high contextual synergy with this role. Prioritize addressing the missing skill matrix tags in your summary and experience sections."
    },
    stats: {
      resume_words: cleanedResume.split(' ').length,
      jd_words: cleanedJd.split(' ').length,
      matched_count: matched.length,
      missing_count: missing.length,
      extra_count: extra.length
    }
  };
}
