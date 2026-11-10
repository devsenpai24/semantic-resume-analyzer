import React from 'react';
import { Target, Zap, ShieldCheck, CheckCircle2, AlertTriangle, TrendingUp, HelpCircle } from 'lucide-react';

export default function ScoreDashboard({ result }) {
  if (!result) return null;

  const finalScore = result.final_result?.final_score ?? 0;
  const finalLabel = result.final_result?.final_label ?? 'Evaluating';
  const semanticScore = result.semantic_match?.semantic_score ?? 0;
  const semanticLabel = result.semantic_match?.semantic_label ?? 'Moderate';
  const skillScore = result.gap_analysis?.skill_match_score ?? 0;

  // Color config based on score tier
  const getScoreTheme = (score) => {
    if (score >= 80) return { stroke: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    if (score >= 65) return { stroke: '#14b8a6', bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' };
    if (score >= 50) return { stroke: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
    return { stroke: '#f43f5e', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' };
  };

  const theme = getScoreTheme(finalScore);

  // SVG Gauge calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (finalScore / 100) * circumference;

  return (
    <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-teal-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/95 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
          
          {/* Main Radial Circular Gauge */}
          <div className="flex items-center gap-6">
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Progress bar */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={theme.stroke}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              {/* Inner score label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
                  {finalScore}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  / 100 ATS
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.bg} ${theme.text} ${theme.border} flex items-center gap-1.5 shadow-sm`}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {finalLabel}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Overall Alignment Score
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Aggregated composite combining <strong>60% Skill Gap Matrix</strong> and <strong>40% Semantic Vector Embedding</strong> similarity.
              </p>
            </div>
          </div>

          {/* Submetrics breakdown */}
          <div className="w-full lg:w-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            
            {/* Semantic Match Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  Semantic Resonance
                </span>
                <span className="font-mono text-cyan-400 font-bold">{semanticScore}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80 mb-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, semanticScore))}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Sentence Transformers</span>
                <span className="text-slate-300 font-medium">{semanticLabel}</span>
              </div>
            </div>

            {/* Skill Match Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <Target className="h-3.5 w-3.5 text-emerald-400" />
                  Skill Coverage
                </span>
                <span className="font-mono text-emerald-400 font-bold">{skillScore}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80 mb-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, skillScore))}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Matched / JD Skills</span>
                <span className="text-slate-300 font-medium font-mono">
                  {result.gap_analysis?.matched_skills?.length ?? 0} / {(result.gap_analysis?.matched_skills?.length ?? 0) + (result.gap_analysis?.missing_skills?.length ?? 0)}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Stats bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-xs text-slate-400">Matched Skills</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {result.gap_analysis?.matched_skills?.length || 0}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-xs text-slate-400">Missing Gaps</div>
            <div className="text-lg font-bold text-rose-400 font-mono">
              {result.gap_analysis?.missing_skills?.length || 0}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-xs text-slate-400">Extra Candidate Skills</div>
            <div className="text-lg font-bold text-indigo-400 font-mono">
              {result.gap_analysis?.extra_skills?.length || 0}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-xs text-slate-400">ATS Weighting</div>
            <div className="text-sm font-semibold text-slate-300 mt-0.5">
              60% Skill + 40% Sem.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
