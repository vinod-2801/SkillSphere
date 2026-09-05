import React from 'react';
import { Gauge, CheckCircle2, TrendingUp } from 'lucide-react';

export default function EmployabilityCard({ employabilityData }) {
  const score = employabilityData?.score ?? 78;
  const breakdown = employabilityData?.breakdown ?? {
    skills: 24,
    projects: 17,
    certifications: 12,
    experience: 15,
    profileCompleteness: 10
  };

  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (val >= 60) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    if (val >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const pillars = [
    { label: 'Technical Skills', key: 'skills', current: breakdown.skills, max: 30, color: 'bg-indigo-600' },
    { label: 'Projects Portfolio', key: 'projects', current: breakdown.projects, max: 20, color: 'bg-blue-600' },
    { label: 'Industry Certifications', key: 'certifications', current: breakdown.certifications, max: 15, color: 'bg-cyan-600' },
    { label: 'Work Experience / Internships', key: 'experience', current: breakdown.experience, max: 20, color: 'bg-emerald-600' },
    { label: 'Profile Completeness', key: 'profileCompleteness', current: breakdown.profileCompleteness, max: 15, color: 'bg-violet-600' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-indigo-600" />
            Employability Score
          </h3>
          <p className="text-xs text-slate-500">Deterministic scoring derived from verifiable profile credentials.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multi-factor Model</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Big Score Meter */}
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-50/50 to-white rounded-xl border border-indigo-100 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Overall Score</span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-extrabold tracking-tight text-slate-900">{score}</span>
            <span className="text-xl font-bold text-slate-400">/ 100</span>
          </div>

          <div className="mt-4 w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, score)}%` }}
            />
          </div>

          <p className="text-xs font-medium text-slate-600 mt-3 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {score >= 75 ? 'Strong Industry Readiness' : score >= 50 ? 'Moderate Readiness' : 'Needs Skill Building'}
          </p>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
            <span>Evaluation Factor</span>
            <span>Points Earned</span>
          </div>

          {pillars.map((item) => {
            const percentage = Math.round((item.current / item.max) * 100);
            return (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>{item.label}</span>
                  <span className="font-semibold text-slate-900">
                    {item.current} <span className="text-slate-400">/ {item.max} pts</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
