import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Edit3, X, Eye } from 'lucide-react';

export default function ResumeDropzone({
  file,
  setFile,
  resumeText,
  setResumeText,
  backendOnline
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (uploadedFile) => {
    if (!uploadedFile) return;
    if (!uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF files are supported.');
      return;
    }

    setUploadError(null);
    setFile(uploadedFile);

    // Try parsing via backend if online
    if (backendOnline) {
      setIsParsing(true);
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        const res = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          setResumeText(data.text);
        } else {
          // Keep file reference for direct /api/analyze multipart
          console.warn('Backend parse failed, file stored for direct analysis');
        }
      } catch (err) {
        console.error('PDF parse failed:', err);
      } finally {
        setIsParsing(false);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const wordCount = resumeText ? resumeText.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Candidate Resume</h2>
            <p className="text-xs text-slate-400">Upload PDF or paste plain text</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowEditor(!showEditor)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              showEditor 
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' 
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Edit3 className="h-3 w-3" />
            <span>{showEditor ? 'Hide Text' : 'Edit Text'}</span>
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      {!file && !showEditor && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex-1 flex flex-col items-center justify-center ${
            isDragging 
              ? 'border-teal-400 bg-teal-500/10 shadow-lg shadow-teal-500/10' 
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/40'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-teal-400 mb-3 shadow-inner">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-200">
            Drag & drop candidate resume <span className="text-teal-400">PDF</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supports multi-page ATS & standard PDF layouts via PyMuPDF
          </p>
          <span className="mt-4 inline-block px-3 py-1 rounded-md bg-slate-900 text-xs font-medium text-slate-300 border border-slate-800 hover:border-teal-500/40 transition">
            Browse Files
          </span>
        </div>
      )}

      {/* Uploaded File Info Card */}
      {file && !showEditor && (
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <FileText className="h-5 w-5" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{(file.size / 1024).toFixed(1)} KB</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Ready for NLP
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Remove File"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Text Area Editor */}
      {(showEditor || (!file && !resumeText)) && (
        <div className="flex-1 flex flex-col mt-2">
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste raw resume text here, or edit the parsed content..."
            className="w-full flex-1 min-h-[220px] bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 font-mono resize-none leading-relaxed"
          />
        </div>
      )}

      {/* Parsing state or footer */}
      {isParsing && (
        <div className="mt-3 py-2 px-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-teal-400 animate-ping"></div>
          <span>Parsing PDF with PyMuPDF...</span>
        </div>
      )}

      {uploadError && (
        <div className="mt-3 py-2 px-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Word and status footer */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Tokens / Words: <strong className="text-slate-300">{wordCount}</strong></span>
        <span>{file ? 'PDF Parsed' : resumeText ? 'Direct Input' : 'Waiting for input'}</span>
      </div>
    </div>
  );
}
