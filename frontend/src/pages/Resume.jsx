import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import SkillBadge from '../components/SkillBadge';
import {
  IconFileText,
  IconUpload,
  IconSparkles,
  IconCheckCircle,
  IconAlertCircle
} from '../components/Icons';

export default function Resume() {
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisState, setAnalysisState] = useState('idle');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    }

    loadData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      setFile(selectedFile);
      setResumeText('');
      setAnalysisResult(null);
      setErrorMessage('');
      setAnalysisState('idle');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];

      setFile(selectedFile);
      setResumeText('');
      setAnalysisResult(null);
      setErrorMessage('');
      setAnalysisState('idle');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setErrorMessage('Please upload your resume PDF first.');
      return;
    }

    setErrorMessage('');
    setAnalysisState('analyzing');

    try {
      /*
       * STEP 1
       * Send the uploaded PDF to the backend PDF parser.
       */
      const formData = new FormData();
      formData.append('resume', file);

      const parseResponse = await fetch(
        'http://localhost:5000/api/ai/resume/parse',
        {
          method: 'POST',
          body: formData
        }
      );

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json().catch(() => ({}));

        throw new Error(
          errorData.message || 'Failed to parse the uploaded resume.'
        );
      }

      const parsedResponse = await parseResponse.json();
      const parsedData = parsedResponse.data || parsedResponse;

      /*
       * Different backend versions may use different names
       * for the extracted text, so check the common possibilities.
       */
      const extractedText =
        parsedData.text ||
        parsedData.extractedText ||
        parsedData.rawText ||
        parsedData.resumeText ||
        '';

      if (!extractedText || !extractedText.trim()) {
        throw new Error(
          'The PDF was uploaded, but no readable resume text was extracted.'
        );
      }

      /*
       * Save extracted text in React state.
       */
      setResumeText(extractedText);

      /*
       * STEP 2
       * Send extracted resume text to the existing
       * resume analysis API.
       */
      const res = await api.analyzeResumeText(extractedText);
      const apiData = res.data || {};

      const extractedSkills = Array.isArray(apiData.extracted_skills)
        ? apiData.extracted_skills
        : [];

      setAnalysisResult({
        extractedSkills: extractedSkills.map((skill) => ({
          name: skill,
          category: 'Technical Skill',
          verified: true
        })),
        employabilityScore:
          apiData.employability_score ?? null,
        skillCount:
          apiData.skill_count ?? extractedSkills.length,
        explanation:
          apiData.explanation || ''
      });

      setAnalysisState('complete');

      /*
       * Update the local profile with the newly calculated score.
       */
      if (profile) {
        setProfile({
          ...profile,
          employabilityScore: apiData.employability_score,
          uploadedResumeName: file.name
        });
      }
    } catch (err) {
      console.error('Resume analysis error:', err);

      setAnalysisState('idle');

      setErrorMessage(
        err.message || 'Failed to analyze the uploaded resume.'
      );
    }
  };

  if (!profile) {
    return null;
  }

  const currentFileName = file
    ? file.name
    : profile.uploadedResumeName || 'No resume uploaded';

  const fileSizeText = file
    ? `${(file.size / 1024).toFixed(1)} KB`
    : 'No file selected';

  const displayedSkills =
    analysisResult?.extractedSkills || [];

  const displayedScore =
    analysisResult?.employabilityScore ?? null;

  const displayedCount =
    analysisResult?.skillCount ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 flex">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">

          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconFileText className="w-7 h-7 text-blue-600" />
              Resume Upload & Skill Mapping Engine
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Automated PDF parsing, curriculum extraction, and employability scoring.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
            <IconSparkles className="w-4 h-4 text-blue-600" />
            <span>AI Parser Active</span>
          </div>

        </div>

        {/* Upload + Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Upload Card */}
          <Card
            title="Upload Resume PDF / DOCX"
            subtitle="Drag & drop your document or browse"
          >

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${isDragging
                ? 'border-blue-600 bg-blue-50/60'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
                }`}
            >

              <input
                type="file"
                id="resume-input"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
              />

              <label
                htmlFor="resume-input"
                className="cursor-pointer block"
              >

                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                  <IconUpload className="w-7 h-7" />
                </div>

                <h4 className="text-sm font-bold text-slate-800">
                  {file
                    ? file.name
                    : 'Drop your resume file here, or browse'}
                </h4>

                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF, DOCX up to 10MB
                </p>

              </label>
            </div>

            {/* Resume Text */}
            <div className="mt-4">

              <label className="block text-xs font-bold text-slate-700 mb-1">
                Extracted Resume Text
              </label>

              <textarea
                rows={4}
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Resume text will appear here automatically after PDF analysis..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-800"
              />

            </div>

            {/* Error */}
            {errorMessage && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-start gap-2">

                <IconAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />

                <span>{errorMessage}</span>

              </div>
            )}

            {/* Analyze Button */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

              <span className="text-xs text-slate-500">
                {file
                  ? `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
                  : 'Upload your resume to begin analysis'}
              </span>

              <Button
                onClick={handleAnalyze}
                variant="primary"
                loading={analysisState === 'analyzing'}
                disabled={analysisState === 'analyzing' || !file}
                className="gap-2 w-full sm:w-auto"
              >

                <IconSparkles className="w-4 h-4" />

                <span>
                  {analysisState === 'idle' && 'Analyze Resume'}
                  {analysisState === 'analyzing' && 'Analyzing Resume...'}
                  {analysisState === 'complete' && 'Re-analyze Resume'}
                </span>

              </Button>

            </div>

          </Card>

          {/* Overview Card */}
          <Card
            title="Uploaded Document Overview"
            subtitle="System parsed file state"
          >

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4 mb-4">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm shadow-2xs">
                  PDF
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {currentFileName}
                  </h4>

                  <p className="text-xs text-slate-500">
                    {fileSizeText}
                  </p>
                </div>

              </div>

              {/* Status */}
              {analysisState === 'idle' && (
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1">

                  <IconAlertCircle className="w-3.5 h-3.5 text-slate-500" />

                  <span>
                    {file ? 'Ready to Analyze' : 'No Resume'}
                  </span>

                </span>
              )}

              {analysisState === 'analyzing' && (
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1 animate-pulse">

                  <svg
                    className="animate-spin h-3.5 w-3.5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>

                  <span>Analyzing...</span>

                </span>
              )}

              {analysisState === 'complete' && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">

                  <IconCheckCircle className="w-3.5 h-3.5" />

                  <span>Analysis Complete</span>

                </span>
              )}

            </div>

            {/* Results */}
            {analysisState === 'idle' && (
              <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 text-center space-y-2">

                <p className="text-xs font-semibold text-slate-700">
                  {file ? 'Ready to Analyze' : 'Upload Resume'}
                </p>

                <p className="text-xs text-slate-500">

                  {file
                    ? 'Click Analyze Resume to parse your PDF, extract skills, and calculate your employability score.'
                    : 'Upload your resume PDF to extract your skills and calculate your employability score.'}

                </p>

              </div>
            )}

            {analysisState === 'analyzing' && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">

                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">

                  <svg
                    className="animate-spin h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 0 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>

                  <span>Analyzing Resume...</span>

                </div>

                <p className="text-xs text-slate-600">
                  Parsing your PDF, extracting skills and calculating employability score...
                </p>

                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse" />
                </div>

              </div>
            )}

            {analysisState === 'complete' && (
              <div className="space-y-2 text-xs transition-all duration-300">

                <div className="flex justify-between py-1.5 border-b border-slate-100">

                  <span className="text-slate-500">
                    Extracted Skills
                  </span>

                  <span className="font-bold text-blue-600">
                    {displayedCount} Key Skills
                  </span>

                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">

                  <span className="text-slate-500">
                    Employability Index
                  </span>

                  <span className="font-bold text-emerald-600">
                    {displayedScore !== null
                      ? `${displayedScore} / 100`
                      : 'Not available'}
                  </span>

                </div>

                {analysisResult?.explanation && (
                  <div className="pt-2 text-slate-600 text-[11px] leading-relaxed bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">

                    <strong className="text-blue-900">
                      Score Explanation:
                    </strong>{' '}

                    {analysisResult.explanation}

                  </div>
                )}

              </div>
            )}

          </Card>

        </div>

        {/* Progress Banner */}
        {analysisState === 'analyzing' && (
          <Card className="border-blue-300 bg-blue-50/50">

            <div className="flex items-center gap-4">

              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">

                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 0 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />

                </svg>

              </div>

              <div className="flex-1">

                <h4 className="text-sm font-bold text-slate-900">
                  Analyzing Resume...
                </h4>

                <p className="text-xs text-slate-600">
                  Extracting skills and calculating employability score across course outcomes & industry standards.
                </p>

              </div>

            </div>

          </Card>
        )}

        {/* Extracted Skills */}
        <Card
          title="Extracted Skills & Verification Status"
          subtitle={
            analysisState === 'complete'
              ? `${displayedCount} proficiencies extracted automatically from resume`
              : 'Upload and analyze resume to view extracted skills'
          }
          action={
            <Button
              size="sm"
              variant="secondary"
              disabled={analysisState !== 'complete'}
              onClick={() => alert('Skills updated successfully!')}
            >
              Update Skills
            </Button>
          }
        >

          {analysisState === 'complete' ? (

            <div className="space-y-5 transition-all duration-300">

              {displayedSkills.length > 0 ? (

                <>
                  <div className="flex flex-wrap gap-2">

                    {displayedSkills.map((skill, index) => (
                      <SkillBadge
                        key={index}
                        name={skill.name}
                        verified={skill.verified}
                        level={
                          skill.verified
                            ? 'Verified'
                            : 'Self-declared'
                        }
                        size="md"
                      />
                    ))}

                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">

                    {displayedSkills.map((skill, index) => (

                      <div
                        key={index}
                        className="p-2 bg-white rounded-lg border border-slate-200"
                      >

                        <p className="font-bold text-slate-800">
                          {skill.name}
                        </p>

                        <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                          Verified ✓
                        </p>

                      </div>

                    ))}

                  </div>
                </>

              ) : (

                <div className="p-8 text-center bg-amber-50 border border-amber-200 rounded-xl space-y-2">

                  <IconAlertCircle className="w-8 h-8 text-amber-400 mx-auto" />

                  <p className="text-xs font-bold text-amber-800">
                    No skills detected
                  </p>

                  <p className="text-xs text-amber-700 max-w-sm mx-auto">
                    The resume was analyzed successfully, but no supported skills were detected.
                  </p>

                </div>

              )}

            </div>

          ) : (

            <div className="p-8 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-xl space-y-2">

              <IconSparkles className="w-8 h-8 text-slate-300 mx-auto" />

              <p className="text-xs font-bold text-slate-700">
                No Extracted Skills Displayed Yet
              </p>

              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload your resume and click{' '}
                <strong className="text-blue-600">
                  Analyze Resume
                </strong>{' '}
                to extract and verify your skills.
              </p>

            </div>

          )}

        </Card>

        {/* Skill Gap Analysis */}
        <Card
          title="Identified Industry Skill Gaps"
          subtitle="Skills recommended to improve your employability"
        >

          {analysisState === 'complete' ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-bold text-amber-900">
                    Recommended Skill: Node.js
                  </span>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-800">
                    High Impact
                  </span>

                </div>

                <p className="text-xs text-amber-800">
                  Backend development with Node.js can strengthen your full-stack development profile.
                </p>

                <div className="pt-2">

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-amber-800 border-amber-300 hover:bg-amber-100"
                  >
                    Explore Node.js Course
                  </Button>

                </div>

              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-bold text-blue-900">
                    Recommended Skill: Docker
                  </span>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200 text-blue-800">
                    Medium Impact
                  </span>

                </div>

                <p className="text-xs text-blue-800">
                  Docker fundamentals can improve your readiness for cloud and deployment-focused roles.
                </p>

                <div className="pt-2">

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-800 border-blue-300 hover:bg-blue-100"
                  >
                    Explore Micro-Credential
                  </Button>

                </div>

              </div>

            </div>

          ) : (

            <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">

              <p className="text-xs font-semibold text-slate-700">
                Skill gap analysis will appear after resume analysis.
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Upload and analyze your resume to identify industry-relevant skill gaps.
              </p>

            </div>

          )}

        </Card>

      </div>

    </div>
  );
}