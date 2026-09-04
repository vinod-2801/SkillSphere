import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  IconCheckCircle,
  IconFileText,
  IconFolder,
  IconChevronRight
} from '../components/Icons';

export default function Apply() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form State
  const [selectedResume, setSelectedResume] = useState('Verified_Candidate_CV.pdf (Verified)');
  const [selectedPortfolio, setSelectedPortfolio] = useState('SkillSphere Digital Portfolio (Public)');
  const [coverNote, setCoverNote] = useState(
    'I am excited to apply for this position. My verified skill profile in React, Python, and SQL aligns closely with your project requirements.'
  );

  useEffect(() => {
    async function loadData() {
      const [opp, prof] = await Promise.all([
        api.getOpportunityById(id || 'opp_1'),
        api.getProfile(),
      ]);
      setOpportunity(opp);
      setProfile(prof);
      if (prof && prof.name) {
        setSelectedResume(`${prof.name.replace(/\s+/g, '_')}_CV_2026.pdf (Verified)`);
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    await api.submitApplication({
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      company: opportunity.company,
      matchPercentage: opportunity.matchPercentage,
      coverNote,
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading || !opportunity || !profile) {
    return <div className="p-8 text-center text-slate-500">Loading Application Portal...</div>;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 min-w-0 p-6 flex items-center justify-center">
          <Card className="max-w-md w-full text-center p-8 shadow-xl border-emerald-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <IconCheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Application Submitted Successfully</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Your verified profile, resume, and skill credentials for <strong className="text-slate-900">{opportunity.title}</strong> have been securely submitted to {opportunity.company}.
            </p>

            <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Application ID</span>
                <span className="font-mono font-bold text-slate-800">APP-2026-9042</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submitted Score</span>
                <span className="font-bold text-emerald-600">
                  {api.hasUserData() ? `${opportunity.matchPercentage}% Match` : 'Complete Profile'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Under Review</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link to="/applications" className="block w-full">
                <Button fullWidth variant="primary" size="md">
                  View My Applications
                </Button>
              </Link>
              <Link to="/opportunities" className="block w-full">
                <Button fullWidth variant="outline" size="md">
                  Explore More Opportunities
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/opportunities" className="hover:text-blue-600">Opportunities</Link>
          <IconChevronRight className="w-3.5 h-3.5" />
          <Link to={`/match/${opportunity.id}`} className="hover:text-blue-600">{opportunity.title}</Link>
          <IconChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">Application Form</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Submit Candidate Application</h1>
          <p className="text-xs text-slate-500 mt-1">Direct submission with verified skill credentials</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Application Form (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Candidate Information" subtitle="Autofilled from your verified profile">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Candidate Name</label>
                  <input
                    type="text"
                    disabled
                    value={profile.name}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Email</label>
                  <input
                    type="text"
                    disabled
                    value={profile.email}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Institution</label>
                  <input
                    type="text"
                    disabled
                    value={profile.institution}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Employability Score</label>
                  <input
                    type="text"
                    disabled
                    value={`${profile.employabilityScore} / 100 Index`}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold"
                  />
                </div>
              </div>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Document Attachments */}
              <Card title="Application Attachments" subtitle="Select verified documents to include">
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <IconFileText className="w-4 h-4 text-blue-600" />
                      <span>Select Resume Version</span>
                    </label>
                    <select
                      value={selectedResume}
                      onChange={(e) => setSelectedResume(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                    >
                      <option value="Alex_Rivera_CV_2026.pdf (Verified)">Alex_Rivera_CV_2026.pdf (Verified AI Parsed)</option>
                      <option value="Alex_Rivera_Tech_CV.pdf">Alex_Rivera_Tech_CV.pdf</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <IconFolder className="w-4 h-4 text-blue-600" />
                      <span>Digital Portfolio Link</span>
                    </label>
                    <select
                      value={selectedPortfolio}
                      onChange={(e) => setSelectedPortfolio(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                    >
                      <option value="SkillSphere Digital Portfolio (Public)">SkillSphere Live Digital Portfolio (Verified Badges)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Statement of Interest / Cover Note</label>
                    <textarea
                      rows={4}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium text-slate-800 leading-relaxed"
                    />
                  </div>
                </div>
              </Card>

              <Button type="submit" size="lg" variant="primary" fullWidth loading={submitting}>
                Submit Application Now
              </Button>
            </form>
          </div>

          {/* Right Column: Opportunity Summary Card */}
          <div className="space-y-6">
            <Card title="Target Position" subtitle="Recruiter Summary">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{opportunity.title}</h4>
                  <p className="text-slate-600 font-medium">{opportunity.company}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>Location</span>
                    <span className="font-semibold text-slate-800">{opportunity.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span className="font-semibold text-slate-800">{opportunity.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Match Score</span>
                    <span className="font-bold text-emerald-600">{opportunity.matchPercentage}%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Verification Guarantee" subtitle="Platform Security Protocol">
              <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                <p>
                  All skill badges and academic transcripts attached to this application carry digital verification recognized by university placement cells and hiring partners.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
