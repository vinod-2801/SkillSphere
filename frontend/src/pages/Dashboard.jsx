import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import ScoreCard from '../components/ScoreCard';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  IconFileText,
  IconCheckCircle,
  IconBriefcase,
  IconBuilding,
  IconBookOpen,
  IconBarChart,
  IconAward,
  IconUsers,
  IconShieldCheck,
} from '../components/Icons';

/* ==========================================================================
   1. STUDENT DASHBOARD VIEW
   ========================================================================== */
function StudentDashboardView({ profile, opportunities, applications }) {
  const hasUserData = api.hasUserData();
  const verifiedSkillsCount = profile.skills ? profile.skills.filter((s) => s.verified).length : 0;
  const recommendedOpps = opportunities.slice(0, 3);
  const userName = profile.name || 'Candidate';
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;

  return (
    <div className="space-y-6">
      {/* Welcome Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome back, {userName}! 👋
            </h1>
            {hasUserData ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Verified Candidate
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                Profile Incomplete
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {profile.degree || 'Undergraduate Student'} • {profile.institution || 'SkillSphere Network'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/resume">
            <Button size="sm" variant="outline" className="gap-1.5">
              <IconFileText className="w-4 h-4 text-blue-600" />
              <span>Upload Resume</span>
            </Button>
          </Link>
          <Link to="/opportunities">
            <Button size="sm" variant="primary" className="gap-1.5">
              <IconBriefcase className="w-4 h-4" />
              <span>Explore Hub</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employability Score Card */}
        <div className="lg:col-span-2">
          <ScoreCard
            score={hasUserData ? (profile.employabilityScore || 82) : "Not available"}
            maxScore={100}
            title="Employability Index"
            subtitle={hasUserData ? "Calculated via curriculum outcomes, verified project badges & industry demand match." : "Upload your resume or complete your profile to calculate your employability index."}
          />
        </div>

        {/* Quick Metrics Stack */}
        <div className="space-y-4">
          <Card padding="p-5" className="border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Verification</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900">{verifiedSkillsCount}</span>
                  <span className="text-xs font-semibold text-slate-500">/ {profile.skills ? profile.skills.length : 0} Skills</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <IconCheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Last Verified: {hasUserData ? 'Jan 2026' : 'None'}</span>
              <Link to="/resume" className="text-blue-600 font-semibold hover:underline">
                Manage Skills
              </Link>
            </div>
          </Card>

          <Card padding="p-5" className="border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Applications</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-blue-600">{applications.length}</span>
                  <span className="text-xs font-semibold text-slate-500">Applications Submitted</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <IconBriefcase className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Shortlisted Stage: {shortlistedCount}</span>
              <Link to="/applications" className="text-blue-600 font-semibold hover:underline">
                View Applications →
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Recommended Opportunities */}
      <Card
        title="AI Recommendations"
        subtitle={hasUserData ? "Top matched positions based on your verified credentials" : "Complete your profile or upload a resume to get personalized recommendations"}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedOpps.map((opp) => (
            <div key={opp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{opp.title}</h4>
                  {hasUserData ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {opp.matchPercentage}% Match
                    </span>
                  ) : (
                    <Link to="/resume" className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 hover:bg-amber-200">
                      Upload Resume
                    </Link>
                  )}
                </div>
                <p className="text-xs text-slate-500">{opp.company} • {opp.location}</p>
                <p className="text-xs text-slate-600 font-semibold mt-2">{opp.stipend}</p>
              </div>
              <Link to={`/match/${opp.id}`} className="mt-4 text-xs font-bold text-blue-600 hover:underline">
                View Match Analysis →
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ==========================================================================
   2. INDUSTRY / RECRUITER DASHBOARD VIEW
   ========================================================================== */
function IndustryDashboardView({ candidates, opportunities, userName }) {
  const [candidateList, setCandidateList] = useState(candidates);

  const toggleShortlist = (id) => {
    setCandidateList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Shortlisted' ? 'Applied' : 'Shortlisted' } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <IconBuilding className="w-7 h-7 text-blue-600" />
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Recruitment Overview & Candidate Intelligence
          </p>
        </div>

        <Link to="/opportunities">
          <Button size="sm" variant="primary" className="gap-2">
            <IconBriefcase className="w-4 h-4" />
            <span>Post New Opportunity</span>
          </Button>
        </Link>
      </div>

      {/* Recruitment Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Job Posts</p>
          <p className="text-3xl font-black text-slate-900">{opportunities.length} Roles</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Tech & Research Active</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applications</p>
          <p className="text-3xl font-black text-blue-600">27 Received</p>
          <p className="text-[11px] text-slate-500">+8 this week</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortlisted Candidates</p>
          <p className="text-3xl font-black text-emerald-600">5 Candidates</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Interview Stage</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Skill Match Rate</p>
          <p className="text-3xl font-black text-slate-900">89% Match</p>
          <p className="text-[11px] text-cyan-600 font-semibold">High Qualification Fit</p>
        </div>
      </div>

      {/* Candidate Matches Table */}
      <Card title="Candidate Matches & Verified Profiles" subtitle="Student candidates ranked by skill compatibility">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Candidate Name</th>
                <th className="px-4 py-3">Degree & Institution</th>
                <th className="px-4 py-3">Employability Index</th>
                <th className="px-4 py-3">Verified Skills</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidateList.map((cand) => (
                <tr key={cand.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-bold text-slate-900">{cand.name}</td>
                  <td className="px-4 py-3 text-slate-600">{cand.degree} • {cand.institution}</td>
                  <td className="px-4 py-3">
                    <span className="font-extrabold text-blue-600">{cand.score} / 100</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {cand.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">
                          {s} ✓
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cand.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                      {cand.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => toggleShortlist(cand.id)}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors ${cand.status === 'Shortlisted' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {cand.status === 'Shortlisted' ? 'Remove Shortlist' : 'Shortlist'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ==========================================================================
   3. ACADEMICIAN DASHBOARD VIEW
   ========================================================================== */
function AcademicianDashboardView({ userName }) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <IconBookOpen className="w-7 h-7 text-blue-600" />
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Academician & Research Collaboration Portal
          </p>
        </div>

        <Button size="sm" variant="primary" className="gap-2" onClick={() => alert("New Research Project Proposal initiated.")}>
          <IconBookOpen className="w-4 h-4" />
          <span>New Research Proposal</span>
        </Button>
      </div>

      {/* Academician Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Research Grants</p>
          <p className="text-3xl font-black text-slate-900">3 Projects</p>
          <p className="text-[11px] text-emerald-600 font-semibold">₹14.5L Funding</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">FDP Modules</p>
          <p className="text-3xl font-black text-blue-600">2 Enrolled</p>
          <p className="text-[11px] text-slate-500">Outcome-based Education</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students Mentored</p>
          <p className="text-3xl font-black text-emerald-600">8 Candidates</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Project Reviewers</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Collaboration Requests</p>
          <p className="text-3xl font-black text-slate-900">4 Pending</p>
          <p className="text-[11px] text-cyan-600 font-semibold">Industry Partners</p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. INSTITUTION DASHBOARD VIEW
   ========================================================================== */
function InstitutionDashboardView({ userName }) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <IconAward className="w-7 h-7 text-blue-600" />
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional Analytics & Placement Readiness
          </p>
        </div>

        <Button size="sm" variant="primary" className="gap-2" onClick={() => alert("Institutional NIRF Report generated.")}>
          <IconBarChart className="w-4 h-4" />
          <span>Export NIRF Placement Report</span>
        </Button>
      </div>

      {/* Institution Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Student Skill Score</p>
          <p className="text-3xl font-black text-slate-900">84.2 Index</p>
          <p className="text-[11px] text-emerald-600 font-semibold">+6.4% YoY</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Readiness</p>
          <p className="text-3xl font-black text-emerald-600">86% Ready</p>
          <p className="text-[11px] text-slate-500">Tier 1 Eligible</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Students</p>
          <p className="text-3xl font-black text-blue-600">450+ Enrolled</p>
          <p className="text-[11px] text-blue-600 font-semibold">Verified Credentials</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry Partners</p>
          <p className="text-3xl font-black text-slate-900">32 Partners</p>
          <p className="text-[11px] text-cyan-600 font-semibold">Active Recruiters</p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. PLATFORM ADMIN DASHBOARD VIEW
   ========================================================================== */
function PlatformAdminDashboardView({ userName, stats }) {
  const adminStats = stats || {
    totalUsers: 32,
    students: 18,
    industryAccounts: 4,
    academicians: 6,
    institutions: 4,
    activeOpportunities: 5,
    verifiedSkills: 342,
    applications: 27,
    recentRegistrations: [],
    recentOpportunities: [],
    platformActivity: [],
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <IconShieldCheck className="w-7 h-7 text-blue-600" />
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Platform Admin Control Panel & Governance Dashboard
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/analytics">
            <Button size="sm" variant="outline" className="gap-1.5">
              <IconBarChart className="w-4 h-4 text-blue-600" />
              <span>Full System Analytics</span>
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button size="sm" variant="primary" className="gap-1.5">
              <IconUsers className="w-4 h-4" />
              <span>Manage Users</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mock Platform Statistics Grid (8 Metrics Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
          <p className="text-3xl font-black text-slate-900">{adminStats.totalUsers}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Registered Ecosystem</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Candidates</p>
          <p className="text-3xl font-black text-blue-600">{adminStats.students}</p>
          <p className="text-[11px] text-blue-600 font-semibold">Active Profiles</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry Accounts</p>
          <p className="text-3xl font-black text-cyan-600">{adminStats.industryAccounts}</p>
          <p className="text-[11px] text-cyan-600 font-semibold">Corporate Partners</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academicians</p>
          <p className="text-3xl font-black text-amber-600">{adminStats.academicians}</p>
          <p className="text-[11px] text-amber-600 font-semibold">Faculty Mentors</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Institutions</p>
          <p className="text-3xl font-black text-purple-600">{adminStats.institutions}</p>
          <p className="text-[11px] text-purple-600 font-semibold">Universities & Colleges</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Opportunities</p>
          <p className="text-3xl font-black text-slate-900">{adminStats.activeOpportunities}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Live Postings</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Skills</p>
          <p className="text-3xl font-black text-emerald-600">{adminStats.verifiedSkills}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Issued Badges</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applications</p>
          <p className="text-3xl font-black text-blue-600">{adminStats.applications}</p>
          <p className="text-[11px] text-slate-500">Processed Submissions</p>
        </div>
      </div>

      {/* Grid: Recent Activity & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Platform Activity" subtitle="Live system events and verifications">
          <div className="space-y-3 text-xs">
            {adminStats.platformActivity && adminStats.platformActivity.map((act) => (
              <div key={act.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{act.action}</p>
                  <p className="text-[11px] text-slate-500">{act.type} Event</p>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Live Opportunities" subtitle="Active posts across the ecosystem">
          <div className="space-y-3 text-xs">
            {adminStats.recentOpportunities && adminStats.recentOpportunities.map((opp) => (
              <div key={opp.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{opp.title}</p>
                  <p className="text-[11px] text-slate-500">{opp.company} • {opp.type}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {opp.postedDate}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN DASHBOARD ROUTER COMPONENT
   ========================================================================== */
export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = api.getCurrentUser();
  const role = currentUser.role || 'Student';
  const userName = currentUser.name || (profile ? profile.name : 'User');

  useEffect(() => {
    async function fetchData() {
      try {
        const [profData, oppData, appData, candData] = await Promise.all([
          api.getProfile(),
          api.getOpportunities(),
          api.getApplications(),
          api.getCandidates(),
        ]);
        setProfile(profData);
        setOpportunities(oppData);
        setApplications(appData);
        setCandidates(candData);

        if (role === 'Platform Admin') {
          const stats = await api.getAdminStats();
          setAdminStats(stats);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-blue-600 font-semibold">
          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading {role} Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Dashboard Workspace */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        {role === 'Student' && (
          <StudentDashboardView
            profile={profile || { name: userName, skills: [] }}
            opportunities={opportunities}
            applications={applications}
          />
        )}

        {role === 'Industry' && (
          <IndustryDashboardView
            candidates={candidates}
            opportunities={opportunities}
            userName={userName}
          />
        )}

        {role === 'Academician' && <AcademicianDashboardView userName={userName} />}

        {(role === 'Institution' || role === 'Institution Admin') && <InstitutionDashboardView userName={userName} />}

        {role === 'Platform Admin' && (
          <PlatformAdminDashboardView userName={userName} stats={adminStats} />
        )}
      </div>
    </div>
  );
}
