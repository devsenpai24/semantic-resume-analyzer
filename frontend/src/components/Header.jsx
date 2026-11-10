import React from 'react';
import { Sparkles, Terminal, FileCheck, Printer, RefreshCw, Cpu, Layers } from 'lucide-react';

export default function Header({ 
  onLoadPreset, 
  onReset, 
  onPrint, 
  backendOnline, 
  groqActive, 
  isAnalyzing 
}) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-500 p-0.5 shadow-lg shadow-teal-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="h-5 w-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                Synap<span className="text-teal-400">CV</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                PRO v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Neural Resume Intelligence & Semantic ATS Matcher
            </p>
          </div>
        </div>

        {/* Engine status & actions */}
        <div className="flex items-center gap-3">
          {/* Backend Status indicator */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <span className={`h-2 w-2 rounded-full ${backendOnline ? 'bg-emerald-400 shadow-sm shadow-emerald-400/80' : 'bg-amber-400'}`}></span>
            <span>{backendOnline ? 'FastAPI Core' : 'Hybrid Client Mode'}</span>
            {groqActive && (
              <span className="flex items-center gap-1 text-teal-400 font-medium pl-1 border-l border-slate-700">
                <Cpu className="h-3 w-3" /> Groq Active
              </span>
            )}
          </div>

          {/* Quick preset selector */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
            <span className="text-slate-400 px-2 font-medium hidden lg:inline">Presets:</span>
            <button
              onClick={() => onLoadPreset('fullstack')}
              className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Load Full Stack Profile"
            >
              Full Stack
            </button>
            <button
              onClick={() => onLoadPreset('aiml')}
              className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Load AI/ML Profile"
            >
              AI / ML
            </button>
            <button
              onClick={() => onLoadPreset('devops')}
              className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Load Cloud / DevOps Profile"
            >
              DevOps
            </button>
          </div>

          {/* Reset & Print */}
          <button
            onClick={onPrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition"
          >
            <Printer className="h-3.5 w-3.5 text-slate-400" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            title="Reset Workspace"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
}
