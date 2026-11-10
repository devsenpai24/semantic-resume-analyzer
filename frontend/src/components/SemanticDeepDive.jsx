import React from 'react';
import { Cpu, Zap, Binary, GitCommit } from 'lucide-react';

export default function SemanticDeepDive({ semanticMatch }) {
  if (!semanticMatch) return null;

  const score = semanticMatch.semantic_score ?? 0;
  const label = semanticMatch.semantic_label ?? 'Evaluating';

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide uppercase">
              Semantic Context Vector Analysis
            </h3>
            <p className="text-xs text-slate-400">
              High-dimensional 384-d dense embeddings via <code className="text-cyan-300 font-mono">all-MiniLM-L6-v2</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Contextual Resonance:</span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/30">
            {score}% ({label})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
            <Zap className="h-3.5 w-3.5" />
            Why Semantic Embeddings Matter
          </div>
          <p className="text-slate-400 leading-relaxed">
            Legacy ATS systems rely strictly on exact string matching. SynapCV projects your entire resume and job description into dense vector space, capturing nuanced conceptual equivalence such as <span className="text-slate-200">"managed distributed clusters"</span> matching <span className="text-slate-200">"orchestrated multi-node infrastructure"</span>.
          </p>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-teal-400 font-semibold mb-2">
            <Binary className="h-3.5 w-3.5" />
            Model Pipeline Details
          </div>
          <p className="text-slate-400 leading-relaxed">
            Text is tokenized, normalized, and converted into dense tensors. Cosine similarity is computed across cross-attention layers to ensure your narrative flow aligns with the hiring team's intended seniority and core scope.
          </p>
        </div>
      </div>
    </div>
  );
}
