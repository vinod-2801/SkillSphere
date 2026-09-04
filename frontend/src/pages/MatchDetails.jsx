import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  IconSparkles,
  IconBuilding,
  IconMapPin,
  IconArrowRight,
  IconChevronRight
} from '../components/Icons';

export default function MatchDetails() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = api.getCurrentUser();
  const isStudent = currentUser.role === 'Student';

  useEffect(() => {
    async function loadOpp() {
      const opp = await api.getOpportunityById(id || 'opp_1');
      setOpportunity(opp);
      setLoading(false);
    }
    loadOpp();
  }, [id]);

  if (loading || !opportunity) {
    return <div className="p-8 text-center text-slate-500">Loading AI Match Breakdown...</div>;
  }

  const {
    title,
    company,
    location,
    type,
    stipend,
    matchPercentage,
    matchedSkills = [],
    missingSkills = [],
    recommendedNextSkill,
    whyMatches,
    employabilityImpact,
    description,
  } = opportunity;

  const hasUserData = api.hasUserData();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/opportunities" className="hover:text-blue-600">Opportunities</Link>
          <IconChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">{title}</span>
        </div>

        {/* Opportunity Summary Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border border-slate-800">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-cyan-300 text-xs font-bold mb-3 border border-blue-400/20">
              <IconSparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>SkillSphere Explainable AI Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
              <span className="flex items-center gap-1">
                <IconBuilding className="w-4 h-4 text-blue-400" />
                {company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <IconMapPin className="w-4 h-4 text-blue-400" />
                {location}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 font-semibold">{type}</span>
              {stipend && <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 font-semibold">{stipend}</span>}
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center md:items-end bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Match</span>
            {hasUserData ? (
              <>
                <span className="text-4xl font-extrabold text-emerald-400">{matchPercentage}%</span>
                <span className="text-[11px] text-cyan-300 mt-0.5 font-semibold">{employabilityImpact}</span>
              </>
            ) : isStudent ? (
              <Link to="/resume" className="mt-1.5 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors">
                Upload Resume
              </Link>
            ) : (
              <Link to="/profile" className="mt-1.5 px-3 py-1 rounded-lg bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 transition-colors">
                Complete Profile
              </Link>
            )}
          </div>
        </div>

        {/* AI Rationale & Explanation Card */}
        <Card title="Why This Opportunity Matches" subtitle="Algorithmic compatibility breakdown">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
              <IconSparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">{whyMatches}</p>
              {recommendedNextSkill && (
                <p className="text-xs text-slate-600 mt-2">
                  Completing recommended next skill <strong className="text-blue-700 font-bold">{recommendedNextSkill}</strong> will boost match confidence to 96%+.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-600 leading-relaxed">
            <h5 className="font-bold text-slate-900 mb-1">Role Description & Context</h5>
            <p>{description}</p>
          </div>
        </Card>

        {/* Skill Matrix Grid: Matched vs Missing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matched Skills */}
          <Card title="Matched Skills (Verified)" subtitle="Skills required for this position">
            <div className="space-y-3">
              {matchedSkills.map((skill) => (
                <div key={skill} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                      ✓
                    </div>
                    <span className="text-sm font-bold text-slate-900">{skill}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">100% Match</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Missing Skills */}
          <Card title="Missing / Gap Skills" subtitle="Recommended skills for 100% fit">
            <div className="space-y-3">
              {missingSkills.map((skill) => (
                <div key={skill} className="flex items-center justify-between p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                      ○
                    </div>
                    <span className="text-sm font-bold text-slate-900">{skill}</span>
                  </div>
                  <span className="text-xs font-bold text-amber-700">Gap Skill</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CTA Banner: Rendered ONLY for Student Role */}
        {isStudent ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Ready to Submit Application?</h4>
              <p className="text-xs text-slate-500">Submit your verified portfolio and resume directly to recruiter.</p>
            </div>
            <Link to={`/apply/${opportunity.id}`}>
              <Button size="lg" variant="primary" className="gap-2">
                <span>Apply for {title}</span>
                <IconArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-600 font-medium flex items-center justify-between">
            <span>Viewing opportunity in {currentUser.role} mode.</span>
            <Link to="/opportunities" className="text-blue-600 font-bold hover:underline">
              Back to Opportunities →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
