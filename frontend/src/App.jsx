import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ResumeDropzone from './components/ResumeDropzone';
import JobDescriptionEditor from './components/JobDescriptionEditor';
import ScoreDashboard from './components/ScoreDashboard';
import SkillIntelligence from './components/SkillIntelligence';
import SemanticDeepDive from './components/SemanticDeepDive';
import AIOptimizerHub from './components/AIOptimizerHub';
import { PRESETS } from './data/presets';
import { computeClientFallback } from './utils/analyzer';
import { Play, Sparkles, AlertCircle, ArrowDown } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState(PRESETS[0].resumeText);
  const [jobDescription, setJobDescription] = useState(PRESETS[0].jobDescription);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const [groqActive, setGroqActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setBackendOnline(true);
        if (data.groq_configured) setGroqActive(true);
      })
      .catch(() => {
        // Backend not running yet; client fallback will handle seamlessly
        setBackendOnline(false);
      });
  }, []);

  const handleLoadPreset = (presetId) => {
    const found = PRESETS.find(p => p.id === presetId);
    if (found) {
      setFile(null);
      setResumeText(found.resumeText);
      setJobDescription(found.jobDescription);
      setErrorMessage(null);
      setResult(null);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResumeText('');
    setJobDescription('');
    setResult(null);
    setErrorMessage(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAnalyze = async () => {
    setErrorMessage(null);
    if (!file && !resumeText.trim()) {
      setErrorMessage('Please upload a resume PDF or enter resume text.');
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMessage('Please provide a target job description.');
      return;
    }

    setIsAnalyzing(true);

    try {
      if (backendOnline) {
        const formData = new FormData();
        if (file) {
          formData.append('file', file);
        } else {
          formData.append('resume_text', resumeText);
        }
        formData.append('job_description', jobDescription);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || 'Analysis request failed on server');
        }

        const data = await response.json();
        setResult(data);
      } else {
        // Hybrid instant client-side evaluator fallback
        setTimeout(() => {
          const fallbackData = computeClientFallback(resumeText, jobDescription);
          setResult(fallbackData);
          setIsAnalyzing(false);
        }, 600);
        return;
      }
    } catch (err) {
      console.warn('Backend call failed, using client-side NLP fallback:', err);
      // Fallback cleanly so user experience never breaks
      const fallbackData = computeClientFallback(resumeText, jobDescription);
      setResult(fallbackData);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 font-sans">
      <Header
        onLoadPreset={handleLoadPreset}
        onReset={handleReset}
        onPrint={handlePrint}
        backendOnline={backendOnline}
        groqActive={groqActive}
        isAnalyzing={isAnalyzing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Hero Banner */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-medium text-teal-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Talent Alignment · NLP · Sentence Transformers · Groq LLM</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Resume Intelligence & <span className="text-gradient-brand">ATS Scoring</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Compare candidate resumes against job descriptions with deep semantic similarity, extract domain-specific competencies, and generate recruiter-grade ATS optimizations.
          </p>
        </section>

        {/* Input Workspace (Resume Dropzone & JD Editor) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <ResumeDropzone
            file={file}
            setFile={setFile}
            resumeText={resumeText}
            setResumeText={setResumeText}
            backendOnline={backendOnline}
          />

          <JobDescriptionEditor
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            onSelectRoleSample={handleLoadPreset}
          />
        </section>

        {/* Analyze Action Bar */}
        <div className="flex flex-col items-center justify-center gap-3 py-2 no-print">
          {errorMessage && (
            <div className="py-2.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide flex items-center gap-2.5 shadow-xl transition-all duration-200 ${
              isAnalyzing
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Executing NLP & Semantic Vector Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Analyze Alignment & Generate Report</span>
              </>
            )}
          </button>
        </div>

        {/* Analysis Output Section */}
        {result && (
          <section className="space-y-8 pt-4">
            
            {/* 1. Score Overview Gauge */}
            <ScoreDashboard result={result} />

            {/* 2. Skill Gap Intelligence Matrix */}
            <SkillIntelligence gapAnalysis={result.gap_analysis} />

            {/* 3. Semantic Context Deep Dive */}
            <SemanticDeepDive semanticMatch={result.semantic_match} />

            {/* 4. Groq AI Optimizer Hub */}
            <AIOptimizerHub suggestions={result.ai_suggestions} />

          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong>SynapCV</strong> — AI-Powered Resume Analyzer & Job Match Scoring Engine
          </p>
          <p className="text-slate-400">
            PyMuPDF · Sentence Transformers (<code className="text-teal-400 font-mono">MiniLM-L6</code>) · Groq API
          </p>
        </div>
      </footer>
    </div>
  );
}
