import React, { useState } from 'react';
import { api } from '../services/api';
import {
  IconSparkles,
  IconCheckCircle,
  IconBookOpen,
  IconFolder,
  IconTrendingUp,
  IconArrowRight,
  IconAlertCircle,
} from './Icons';

export default function CareerRoadmapCard({ initialRole = '' }) {
  const [targetRole, setTargetRole] = useState(initialRole);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!targetRole.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.getCareerRoadmap(targetRole.trim());
      // Handle response.data or direct object
      const data = response.data || response;
      setRoadmap(data);
    } catch (err) {
      console.error('Failed to generate career roadmap:', err);
      setError(err.message || 'Unable to generate career roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSkillName = (skill) => {
    if (typeof skill === 'string') return skill;
    if (skill && typeof skill === 'object') return skill.name || skill.title || JSON.stringify(skill);
    return String(skill);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <IconTrendingUp className="w-5 h-5 text-indigo-600" />
            Career Development Plan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Get a personalized, step-by-step learning roadmap tailored to your target role and existing skills.
          </p>
        </div>
      </div>

      {/* Target Role Form */}
      <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Enter your target role (e.g. Full Stack Developer, AI Engineer, Data Scientist...)"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !targetRole.trim()}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating Roadmap...</span>
            </>
          ) : (
            <>
              <IconSparkles className="w-4 h-4" />
              <span>Generate Roadmap</span>
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800">
          <IconAlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error Generating Roadmap</p>
            <p className="mt-0.5 text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Roadmap Output */}
      {roadmap && (
        <div className="space-y-6 pt-2 border-t border-slate-100">
          {/* Top Overview Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-slate-50 to-blue-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                Target Role
              </span>
              <h4 className="text-xl font-extrabold text-slate-900 mt-1">{roadmap.targetRole}</h4>
            </div>

            {roadmap.estimatedTimeline && (
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-indigo-100 shadow-2xs self-start sm:self-auto">
                <span className="text-xs font-semibold text-slate-500">Timeline:</span>
                <span className="text-xs font-extrabold text-indigo-600">{roadmap.estimatedTimeline}</span>
              </div>
            )}
          </div>

          {/* Current Skills vs Skills to Learn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Skills */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <IconCheckCircle className="w-4 h-4 text-emerald-600" />
                Current Skills ({roadmap.currentSkills ? roadmap.currentSkills.length : 0})
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {roadmap.currentSkills && roadmap.currentSkills.length > 0 ? (
                  roadmap.currentSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-2xs flex items-center gap-1"
                    >
                      <span className="text-emerald-600 font-bold">✓</span> {renderSkillName(skill)}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No current skills retrieved.</p>
                )}
              </div>
            </div>

            {/* Skills to Learn */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                <IconArrowRight className="w-4 h-4 text-indigo-600" />
                Skills to Learn ({roadmap.skillsToLearn ? roadmap.skillsToLearn.length : 0})
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {roadmap.skillsToLearn && roadmap.skillsToLearn.length > 0 ? (
                  roadmap.skillsToLearn.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-900 text-xs font-semibold shadow-2xs"
                    >
                      + {renderSkillName(skill)}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No skills to learn listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Learning Phases */}
          {roadmap.learningPhases && roadmap.learningPhases.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <IconBookOpen className="w-4 h-4 text-indigo-600" />
                Structured Learning Phases
              </h5>
              <div className="grid grid-cols-1 gap-3">
                {roadmap.learningPhases.map((phase, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <h6 className="font-bold text-slate-900 text-xs sm:text-sm">{phase.phase}</h6>
                      </div>
                      {phase.duration && (
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-200/70 px-2.5 py-0.5 rounded-md self-start sm:self-auto">
                          ⏱ {phase.duration}
                        </span>
                      )}
                    </div>
                    {phase.topics && phase.topics.length > 0 && (
                      <div className="pl-8 flex flex-wrap gap-1.5 pt-1">
                        {phase.topics.map((topic, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium"
                          >
                            • {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Capstone Projects */}
          {roadmap.projects && roadmap.projects.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <IconFolder className="w-4 h-4 text-indigo-600" />
                Recommended Portfolio Projects
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roadmap.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                    <h6 className="font-bold text-slate-900 text-xs sm:text-sm text-indigo-950 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      {proj.title}
                    </h6>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Preparation */}
          {roadmap.interviewPreparation && roadmap.interviewPreparation.length > 0 && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <IconSparkles className="w-4 h-4 text-blue-600" />
                Interview Preparation Strategy
              </h5>
              <ul className="space-y-1.5">
                {roadmap.interviewPreparation.map((tip, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
