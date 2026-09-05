import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { parseResumeApi } from '../services/api';

export default function ResumeUpload({ onResumeParsed }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileProcess = async (file) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation: Accept PDF files only
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setErrorMessage('Please upload a PDF resume.');
      return;
    }

    // Validation: Check empty file
    if (file.size === 0) {
      setErrorMessage('Unable to extract information from this resume. The file is empty.');
      return;
    }

    try {
      setIsUploading(true);
      const parsedData = await parseResumeApi(file);
      setSuccessMessage(`Successfully parsed resume for ${parsedData.name || 'Student'}!`);
      if (onResumeParsed) {
        onResumeParsed(parsedData);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to extract information from this resume.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const loadSampleBenchmarkData = () => {
    // Allows instant demo review without needing to generate a PDF manually
    const sampleParsed = {
      name: "Rahul Kumar",
      education: ["B.Tech Computer Science"],
      skills: ["Python", "Java", "React", "SQL"],
      projects: ["E-Commerce Website"],
      certifications: ["Python Certification"],
      experience: ["Web Development Intern"]
    };
    setErrorMessage(null);
    setSuccessMessage('Loaded SIH 2026 Sample Resume benchmark data.');
    if (onResumeParsed) {
      onResumeParsed(sampleParsed);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Resume Intelligence & Extraction
          </h2>
          <p className="text-xs text-slate-500">Upload your PDF resume to extract skills, experience, and calculate role readiness.</p>
        </div>
        <button
          type="button"
          onClick={loadSampleBenchmarkData}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Load Sample PDF Data
        </button>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50'
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileProcess(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <div className="flex flex-col items-center py-3">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-2" />
              <p className="text-sm font-semibold text-slate-800">Extracting resume data via NLP...</p>
              <p className="text-xs text-slate-500">Detecting sections: Skills, Education, Projects, Experience</p>
            </div>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                <span className="text-indigo-600 underline decoration-indigo-300 underline-offset-2">Click to upload</span> or drag and drop your resume
              </p>
              <p className="text-xs text-slate-400">PDF format only (Max size 10MB)</p>
            </>
          )}
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
}
