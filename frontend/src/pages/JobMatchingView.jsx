import React, { useState, useEffect } from 'react';
import { getJobsApi, getStudentProfileApi, getSkillGapApi, getExplainableMatchApi } from '../services/api';
import { Briefcase, MapPin, Building, Target, CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react';

export default function JobMatchingView() {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [jobsData, profileData] = await Promise.all([
          getJobsApi(),
          getStudentProfileApi()
        ]);
        setJobs(jobsData);
        setProfile(profileData);

        if (jobsData.length > 0) {
          selectJob(jobsData[0], profileData);
        }
      } catch (err) {
        console.error('Failed to load jobs view:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const selectJob = async (job, studentProfile = profile) => {
    setSelectedJob(job);
    if (!studentProfile) return;
    try {
      const studentSkills = studentProfile.skills || [];
      const jobSkills = job.required_skills || [];

      const [gap, match] = await Promise.all([
        getSkillGapApi(studentSkills, jobSkills),
        getExplainableMatchApi(studentSkills, jobSkills, job.title)
      ]);

      setMatchDetails({ gap, match });
    } catch (err) {
      console.error('Error fetching job match details:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Industry Collaboration & Job Matching</h1>
        <p className="text-xs text-slate-500">Explore partner company roles evaluated through the SkillSphere AI match engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Jobs List */}
        <div className="lg:col-span-5 space-y-3">
          {jobs.map((job) => {
            const isSelected = selectedJob?.id === job.id;
            return (
              <div
                key={job.id}
                onClick={() => selectJob(job)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                    <p className="text-xs text-indigo-700 font-semibold mt-0.5">{job.company}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {job.department}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
                  </span>
                  <span>•</span>
                  <span>{job.required_skills?.length || 0} required skills</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {(job.required_skills || []).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Job Match Details */}
        <div className="lg:col-span-7">
          {selectedJob && matchDetails ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    Target Opportunity
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedJob.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedJob.company} • {selectedJob.location}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 block">Candidate Fit</span>
                  <span className="text-3xl font-black text-indigo-600">
                    {matchDetails.match.matchScore}%
                  </span>
                </div>
              </div>

              {/* Dynamic Explanation */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold uppercase text-amber-900">Explainable Match Verdict</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {matchDetails.match.explanation}
                </p>
              </div>

              {/* Matched vs Missing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Matched Skills ({matchDetails.match.matchedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchDetails.match.matchedSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-900 rounded-md text-xs font-semibold">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-200">
                  <span className="text-xs font-bold text-rose-800 flex items-center gap-1 mb-2">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Missing Skills ({matchDetails.match.missingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchDetails.match.missingSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 bg-white border border-rose-300 text-rose-900 rounded-md text-xs font-semibold">
                        ✗ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Actionable Upskilling Pathway
                </span>
                <div className="space-y-2">
                  {matchDetails.match.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800">
                      <span className="flex items-center gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-semibold">{rec}</span>
                      </span>
                      <span className="text-[10px] text-indigo-600 font-semibold hover:underline cursor-pointer">
                        View Tutorial & Practice Test →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
              Select a job from the list to view its explainable AI match.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
