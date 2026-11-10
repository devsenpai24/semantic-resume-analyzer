import React, { useState } from 'react';
import { CheckCircle2, XCircle, PlusCircle, Filter, Copy, Check } from 'lucide-react';
import { SKILL_CATEGORIES } from '../utils/analyzer';

export default function SkillIntelligence({ gapAnalysis }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedSkill, setCopiedSkill] = useState(null);

  if (!gapAnalysis) return null;

  const matched = gapAnalysis.matched_skills || [];
  const missing = gapAnalysis.missing_skills || [];
  const extra = gapAnalysis.extra_skills || [];

  const copySkill = (skill) => {
    navigator.clipboard.writeText(skill);
    setCopiedSkill(skill);
    setTimeout(() => setCopiedSkill(null), 1500);
  };

  const filterByCategory = (skills) => {
    if (activeCategory === 'All') return skills;
    const categorySkills = new Set(SKILL_CATEGORIES[activeCategory] || []);
    return skills.filter(skill => categorySkills.has(skill.toLowerCase()));
  };

  const filteredMatched = filterByCategory(matched);
  const filteredMissing = filterByCategory(missing);
  const filteredExtra = filterByCategory(extra);

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800/80">
      
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
            Skill Gap Matrix & Competency Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Rule-based NLP entity extractor matching aliases across 5 technical disciplines
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {['All', 'Languages', 'Frameworks', 'Cloud & DevOps', 'AI & ML', 'Databases & Data'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm shadow-teal-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 3 Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Matched Skills */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-emerald-500/20 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Matched Skills
            </span>
            <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              {filteredMatched.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">Found in both resume and target job requirements.</p>
          
          <div className="flex-1 flex flex-wrap gap-2 content-start">
            {filteredMatched.length > 0 ? (
              filteredMatched.map((skill) => (
                <button
                  key={skill}
                  onClick={() => copySkill(skill)}
                  className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono transition"
                  title="Click to copy"
                >
                  <span>{skill}</span>
                  {copiedSkill === skill ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No matched skills under this filter</span>
            )}
          </div>
        </div>

        {/* 2. Missing Skills */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-rose-500/20 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
              <XCircle className="h-4 w-4" />
              Missing Skills (Gaps)
            </span>
            <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
              {filteredMissing.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">Required by JD but omitted in the candidate profile.</p>

          <div className="flex-1 flex flex-wrap gap-2 content-start">
            {filteredMissing.length > 0 ? (
              filteredMissing.map((skill) => (
                <button
                  key={skill}
                  onClick={() => copySkill(skill)}
                  className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono transition"
                  title="Click to copy missing keyword"
                >
                  <span>{skill}</span>
                  {copiedSkill === skill ? (
                    <Check className="h-3 w-3 text-rose-400" />
                  ) : (
                    <Copy className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))
            ) : (
              <span className="text-xs text-emerald-400/90 italic flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> No skill gaps identified in this domain!
              </span>
            )}
          </div>
        </div>

        {/* 3. Extra Candidate Skills */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-indigo-500/20 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <PlusCircle className="h-4 w-4" />
              Additional Competencies
            </span>
            <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              {filteredExtra.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">Candidate strengths that exceed current JD requirements.</p>

          <div className="flex-1 flex flex-wrap gap-2 content-start">
            {filteredExtra.length > 0 ? (
              filteredExtra.map((skill) => (
                <span
                  key={skill}
                  className="inline-block px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No additional skills found</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
