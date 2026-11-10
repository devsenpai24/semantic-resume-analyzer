import React, { useState } from 'react';
import { Bot, Sparkles, CheckCircle2, Copy, Check, ArrowRight, Lightbulb, MessageSquareQuote } from 'lucide-react';

export default function AIOptimizerHub({ suggestions }) {
  const [copiedBulletIdx, setCopiedBulletIdx] = useState(null);
  const [copiedAllKeywords, setCopiedAllKeywords] = useState(false);

  if (!suggestions) return null;

  const feedback = suggestions.overall_feedback || 'Analysis completed successfully.';
  const keywords = suggestions.missing_keywords || [];
  const improvements = suggestions.top_improvements || [];
  const bullets = suggestions.rewritten_bullets || [];
  const advice = suggestions.final_advice || '';

  const copyBullet = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 1500);
  };

  const copyAllKeywords = () => {
    if (!keywords.length) return;
    navigator.clipboard.writeText(keywords.join(', '));
    setCopiedAllKeywords(true);
    setTimeout(() => setCopiedAllKeywords(false), 1500);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 border border-teal-500/30 text-teal-400">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide uppercase">
                AI Intelligence & Optimization Engine
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/30">
                Groq LLM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Technical recruiter critique, missing ATS keywords, and quantified bullet point transformations
            </p>
          </div>
        </div>
      </div>

      {/* 1. Executive Critique Card */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/80 border border-slate-800/90 p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">
          <MessageSquareQuote className="h-4 w-4" />
          Recruiter Executive Summary
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          {feedback}
        </p>
      </div>

      {/* 2-Column Grid: Missing Keywords & Actionable Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Missing Keywords Cloud */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/90 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Missing ATS Keywords
              </span>
              {keywords.length > 0 && (
                <button
                  onClick={copyAllKeywords}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition"
                  title="Copy comma-separated keyword list"
                >
                  {copiedAllKeywords ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied List</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy All</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Add these exact terms into your experience or summary sections to pass initial ATS screening filters:
            </p>
            <div className="flex flex-wrap gap-2">
              {keywords.length > 0 ? (
                keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-400 italic">No missing keywords identified!</span>
              )}
            </div>
          </div>
        </div>

        {/* Actionable Improvements */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/90 p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Top High-Impact Improvements
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Key structural and contextual revisions recommended before applying:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {improvements.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* 3. Rewritten Bullets (High Impact Before / After transformations) */}
      <div className="rounded-2xl bg-slate-950/80 border border-slate-800/90 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            ATS-Optimized Bullet Point Rewrites
          </div>
          <span className="text-[11px] text-slate-400">STAR Method & Quantified Impact</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Replace passive or vague bullet points on your resume with these metric-driven, action-oriented formulations:
        </p>

        <div className="space-y-3">
          {bullets.map((bullet, idx) => (
            <div
              key={idx}
              className="group relative bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 rounded-xl p-3.5 transition-all flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5 text-teal-400 text-xs font-bold">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-mono">
                  {bullet}
                </p>
              </div>

              <button
                onClick={() => copyBullet(bullet, idx)}
                className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-teal-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition"
                title="Copy bullet point"
              >
                {copiedBulletIdx === idx ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400 group-hover:text-slate-950" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Final Strategic Advice */}
      {advice && (
        <div className="rounded-2xl bg-teal-950/20 border border-teal-500/30 p-4 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 shrink-0">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-1">
              Final Strategic Verdict
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {advice}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
