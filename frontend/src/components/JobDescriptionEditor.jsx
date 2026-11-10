import React from 'react';
import { Briefcase, Sparkles, Trash2 } from 'lucide-react';

export default function JobDescriptionEditor({
  jobDescription,
  setJobDescription,
  onSelectRoleSample
}) {
  const wordCount = jobDescription ? jobDescription.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = jobDescription ? jobDescription.length : 0;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Target Job Description</h2>
            <p className="text-xs text-slate-400">Paste job requirements, roles, & tech stacks</p>
          </div>
        </div>

        {jobDescription && (
          <button
            onClick={() => setJobDescription('')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Clear Job Description"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Editor textarea */}
      <div className="flex-1 flex flex-col">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the target job description here (e.g. Responsibilities, Technical Requirements, Qualifications, Preferred Skills)..."
          className="w-full flex-1 min-h-[220px] bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 font-mono resize-none leading-relaxed"
        />
      </div>

      {/* Footer & Sample Templates */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-cyan-400" />
          <span>Quick Load:</span>
          <button
            onClick={() => onSelectRoleSample('fullstack')}
            className="text-xs text-cyan-400 hover:underline hover:text-cyan-300"
          >
            Full Stack
          </button>
          <span>•</span>
          <button
            onClick={() => onSelectRoleSample('aiml')}
            className="text-xs text-cyan-400 hover:underline hover:text-cyan-300"
          >
            AI/ML
          </button>
          <span>•</span>
          <button
            onClick={() => onSelectRoleSample('devops')}
            className="text-xs text-cyan-400 hover:underline hover:text-cyan-300"
          >
            DevOps
          </button>
        </div>

        <div>
          <span>Words: <strong className="text-slate-300">{wordCount}</strong></span>
          <span className="ml-2">Chars: <strong className="text-slate-300">{charCount}</strong></span>
        </div>
      </div>
    </div>
  );
}
