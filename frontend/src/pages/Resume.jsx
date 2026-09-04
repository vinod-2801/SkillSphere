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
  const [isDragging, setIsDragging] = useState(false);
  const [analysisState, setAnalysisState] = useState('idle'); // 'idle' | 'analyzing' | 'complete'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await api.getProfile();
      setProfile(data);
    }
    loadData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysisState('idle'); // Reset analysis state for new file
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
      setFile(e.dataTransfer.files[0]);
      setAnalysisState('idle'); // Reset analysis state for new file
    }
  };

  const handleAnalyze = async () => {
    setAnalysisState('analyzing');
    const fileName = file ? file.name : (profile?.uploadedResumeName || 'candidate_resume.pdf');
    
    // Simulate 1.5s AI analysis execution
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await api.analyzeResume(fileName);

    setAnalysisState('complete');

    // Refresh profile state
    const updated = await api.getProfile();
    setProfile(updated);
  };

  if (!profile) return null;

  const currentFileName = file ? file.name : (profile.uploadedResumeName || 'candidate_resume.pdf');
  const fileSizeText = file ? `${(file.size / 1024).toFixed(1)} KB` : '240 KB';

  const extractedSkills = [
    { name: 'Python', category: 'Programming', verified: true },
    { name: 'Java', category: 'Programming', verified: true },
    { name: 'SQL', category: 'Database', verified: true },
    { name: 'React', category: 'Frontend', verified: true },
    { name: 'HTML', category: 'Frontend', verified: true },
    { name: 'CSS', category: 'Frontend', verified: true },
    { name: 'JavaScript', category: 'Frontend', verified: true },
    { name: 'Git', category: 'Tools', verified: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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

        {/* Top Split: Upload Area & Uploaded Resume Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Dropzone Card */}
          <Card title="Upload Resume PDF / DOCX" subtitle="Drag & drop your document or browse">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
                isDragging
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
              <label htmlFor="resume-input" className="cursor-pointer block">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                  <IconUpload className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  {file ? file.name : 'Drop your resume file here, or browse'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX up to 10MB</p>
              </label>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {file ? `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)` : 'Candidate resume ready for analysis'}
              </span>
              <Button
                onClick={handleAnalyze}
                variant="primary"
                loading={analysisState === 'analyzing'}
                disabled={analysisState === 'analyzing'}
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

          {/* Uploaded Document Overview Card */}
          <Card title="Uploaded Document Overview" subtitle="System parsed file state">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm shadow-2xs">
                  PDF
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{currentFileName}</h4>
                  <p className="text-xs text-slate-500">{fileSizeText}</p>
                </div>
              </div>

              {/* Status Badges */}
              {analysisState === 'idle' && (
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1">
                  <IconAlertCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ready to Analyze</span>
                </span>
              )}

              {analysisState === 'analyzing' && (
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1 animate-pulse">
                  <svg className="animate-spin h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

            {/* Dynamic Results Content */}
            {analysisState === 'idle' && (
              <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 text-center space-y-2">
                <p className="text-xs font-semibold text-slate-700">Ready to Analyze</p>
                <p className="text-xs text-slate-500">
                  Upload your resume and click <strong className="text-blue-600">Analyze Resume</strong> to extract skills and calculate employability score.
                </p>
              </div>
            )}

            {analysisState === 'analyzing' && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing Resume...</span>
                </div>
                <p className="text-xs text-slate-600">
                  Extracting skills and calculating employability score...
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse" />
                </div>
              </div>
            )}

            {analysisState === 'complete' && (
              <div className="space-y-2 text-xs transition-all duration-300">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Parsing Accuracy</span>
                  <span className="font-bold text-slate-900">98.4%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Extracted Skills</span>
                  <span className="font-bold text-blue-600">8 Key Skills</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Employability Index Boost</span>
                  <span className="font-bold text-emerald-600">+8 Score Points</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Progress Card Notification Banner during analysis */}
        {analysisState === 'analyzing' && (
          <Card className="border-blue-300 bg-blue-50/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">Analyzing Resume...</h4>
                <p className="text-xs text-slate-600">
                  Extracting skills and calculating employability score across course outcomes & industry standards.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Extracted Skills Section */}
        <Card
          title="Extracted Skills & Verification Status"
          subtitle={
            analysisState === 'complete'
              ? '8 proficiencies extracted automatically from resume'
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
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map((skill, index) => (
                  <SkillBadge
                    key={index}
                    name={skill.name}
                    verified={skill.verified}
                    level={skill.verified ? 'Verified' : 'Self-declared'}
                    size="md"
                  />
                ))}
              </div>

              {/* Extracted Skills Summary Grid */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
                {['Python', 'Java', 'SQL', 'React', 'HTML', 'CSS', 'JavaScript', 'Git'].map((s) => (
                  <div key={s} className="p-2 bg-white rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-800">{s}</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">Verified ✓</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-xl space-y-2">
              <IconSparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No Extracted Skills Displayed Yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload your resume and click <strong className="text-blue-600">Analyze Resume</strong> above to extract and verify your skills.
              </p>
            </div>
          )}
        </Card>

        {/* Skill Gap Analysis */}
        <Card title="Identified Industry Skill Gaps" subtitle="Skills missing to reach 95%+ match across Tier 1 opportunities">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-900">Missing Skill: Node.js</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-800">High Impact</span>
              </div>
              <p className="text-xs text-amber-800">
                Adding Node.js backend proficiency completes your Full-Stack Web stack, increasing your TechNova internship match from 89% to 96%.
              </p>
              <div className="pt-2">
                <Button size="sm" variant="outline" className="text-amber-800 border-amber-300 hover:bg-amber-100">
                  Enroll in Node.js Course
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-blue-900">Missing Skill: Docker</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200 text-blue-800">Medium Impact</span>
              </div>
              <p className="text-xs text-blue-800">
                Containerization basics required for cloud native apprentice applications at Apex Cloud Systems.
              </p>
              <div className="pt-2">
                <Button size="sm" variant="outline" className="text-blue-800 border-blue-300 hover:bg-blue-100">
                  Explore Micro-Credential
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
