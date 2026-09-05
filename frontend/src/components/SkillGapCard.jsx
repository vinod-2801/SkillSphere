import React from 'react';
import { Target, CheckCircle, XCircle, Briefcase, ChevronRight } from 'lucide-react';

export default function SkillGapCard({
  jobs = [],
  selectedJobId,
  onSelectJob,
  skillGapResult,
  loading
}) {
  const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const matchedSkills = skillGapResult?.matchedSkills || [];
  const missingSkills = skillGapResult?.missingSkills || [];
  const totalRequired = skillGapResult?.totalRequired || 0;
  const matchedCount = skillGapResult?.matchedCount || 0;
  const missingCount = skillGapResult?.missingCount || 0;
  const matchPercentage = skillGapResult?.matchPercentage || 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Skill Gap Analysis
          </h3>
          <p className="text-xs text-slate-500">Real-time comparison between student profile and job requirements.</p>
        </div>

        {/* Job Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Target Role:</label>
          <select
            value={selectedJobId || (currentJob?.id ?? '')}
            onChange={(e) => onSelectJob(Number(e.target.value))}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Job Overview Card */}
      {currentJob && (
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base">{currentJob.title}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                {currentJob.company}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{currentJob.description}</p>
          </div>

          {/* Match Score Badge */}
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-lg border border-slate-200 shadow-xs flex-shrink-0">
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 block">Match Score</span>
              <span className="text-2xl font-black text-indigo-600 leading-none">{matchPercentage}%</span>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-indigo-600 flex items-center justify-center font-bold text-xs text-indigo-600">
              {matchedCount}/{totalRequired}
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Required Skills</span>
          <p className="text-lg font-bold text-slate-800">{totalRequired}</p>
        </div>
        <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 text-center">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase">Matched Skills</span>
          <p className="text-lg font-bold text-emerald-700">{matchedCount}</p>
        </div>
        <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-100 text-center">
          <span className="text-[11px] font-semibold text-rose-600 uppercase">Missing Skills</span>
          <p className="text-lg font-bold text-rose-700">{missingCount}</p>
        </div>
      </div>

      {/* Side-by-Side Skills Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched Skills */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Matched Skills ({matchedSkills.length})
          </h4>
          <div className="space-y-1.5">
            {matchedSkills.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No skills matched yet.</p>
            ) : (
              matchedSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center justify-between px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> {skill}
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Ready</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-3">
            <XCircle className="w-4 h-4 text-rose-600" />
            Missing Skills ({missingSkills.length})
          </h4>
          <div className="space-y-1.5">
            {missingSkills.length === 0 ? (
              <p className="text-xs text-emerald-600 font-medium">All required skills acquired!</p>
            ) : (
              missingSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center justify-between px-3 py-1.5 bg-white border border-rose-200 rounded-lg text-xs font-semibold text-rose-900 shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-rose-600 font-bold">✗</span> {skill}
                  </span>
                  <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-medium">Gap</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
