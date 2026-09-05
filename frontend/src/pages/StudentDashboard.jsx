import React, { useState, useEffect } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import ParsedResumeCard from '../components/ParsedResumeCard';
import EmployabilityCard from '../components/EmployabilityCard';
import SkillGapCard from '../components/SkillGapCard';
import ExplainableMatchCard from '../components/ExplainableMatchCard';
import {
  getStudentProfileApi,
  getJobsApi,
  getEmployabilityScoreApi,
  getSkillGapApi,
  getExplainableMatchApi,
  saveStudentProfileApi
} from '../services/api';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [employabilityData, setEmployabilityData] = useState(null);
  const [skillGapResult, setSkillGapResult] = useState(null);
  const [explainableMatch, setExplainableMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [studentRes, jobsRes] = await Promise.all([
          getStudentProfileApi(),
          getJobsApi()
        ]);

        setProfile(studentRes);
        setJobs(jobsRes);

        const initialJobId = jobsRes[0]?.id;
        setSelectedJobId(initialJobId);

        // Calculate initial metrics
        if (studentRes) {
          recalculateMetrics(studentRes, initialJobId, jobsRes);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Recalculate metrics when profile or target job changes
  const recalculateMetrics = async (currentProfile, targetJobId, currentJobs = jobs) => {
    if (!currentProfile) return;

    try {
      // 1. Calculate Employability Score
      const empRes = await getEmployabilityScoreApi(currentProfile);
      setEmployabilityData(empRes);

      // 2. Calculate Skill Gap & Explainable Match for target job
      const targetJob = currentJobs.find(j => j.id === targetJobId) || currentJobs[0];
      if (targetJob) {
        const studentSkills = currentProfile.skills || [];
        const jobSkills = targetJob.required_skills || [];

        const [gapRes, matchRes] = await Promise.all([
          getSkillGapApi(studentSkills, jobSkills),
          getExplainableMatchApi(studentSkills, jobSkills, targetJob.title)
        ]);

        setSkillGapResult(gapRes);
        setExplainableMatch(matchRes);
      }
    } catch (err) {
      console.error('Recalculation error:', err);
    }
  };

  // Handler when PDF is parsed
  const handleResumeParsed = (parsedData) => {
    setProfile(parsedData);
    recalculateMetrics(parsedData, selectedJobId);
  };

  // Handler when student edits and saves profile
  const handleSaveProfile = async (updatedData) => {
    try {
      const saved = await saveStudentProfileApi(updatedData);
      setProfile(saved);
      recalculateMetrics(saved, selectedJobId);
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  // Handler when student picks another target job
  const handleSelectJob = (jobId) => {
    setSelectedJobId(jobId);
    recalculateMetrics(profile, jobId);
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> SIH 2026 AI Core
            </span>
            <span className="text-xs text-slate-300">Team INNOVEX</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AI Career Intelligence Dashboard</h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            End-to-end intelligent evaluation connecting resume parsing, skill normalization,
            deterministic gap analysis, employability scoring, and transparent role recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => recalculateMetrics(profile, selectedJobId)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/10 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Recompute AI Metrics
          </button>
        </div>
      </div>

      {/* Grid: Resume Upload & Structured Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <ResumeUpload onResumeParsed={handleResumeParsed} />
          {employabilityData && (
            <EmployabilityCard employabilityData={employabilityData} />
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <ParsedResumeCard
            data={profile}
            onSaveProfile={handleSaveProfile}
          />
        </div>
      </div>

      {/* Full Width Skill Gap & Explainable AI Match */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillGapCard
          jobs={jobs}
          selectedJobId={selectedJobId}
          onSelectJob={handleSelectJob}
          skillGapResult={skillGapResult}
          loading={loading}
        />

        <ExplainableMatchCard
          matchData={explainableMatch}
          jobTitle={selectedJob?.title}
        />
      </div>
    </div>
  );
}
