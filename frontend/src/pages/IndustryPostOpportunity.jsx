import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { IconBriefcase, IconCheckCircle } from '../components/Icons';

export default function IndustryPostOpportunity() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('TechNova Solutions');
  const [type, setType] = useState('Internship');
  const [stipend, setStipend] = useState('₹35,000 / month');
  const [location, setLocation] = useState('Bangalore / Remote');
  const [skills, setSkills] = useState('React, Python, SQL');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);

    const requiredSkillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);

    await api.addOpportunity({
      title,
      company,
      type,
      stipend,
      location,
      requiredSkills: requiredSkillsArray,
      description,
    });

    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconBriefcase className="w-7 h-7 text-blue-600" />
              Post New Opportunity
            </h1>
            <p className="text-xs text-slate-500 mt-1">Create a targeted internship or job post for verified candidates</p>
          </div>
          <Link to="/opportunities">
            <Button size="sm" variant="outline">
              View Active Opportunities
            </Button>
          </Link>
        </div>

        {success ? (
          <Card className="max-w-lg mx-auto text-center p-8 border-emerald-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <IconCheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Opportunity Posted Successfully!</h3>
            <p className="text-xs text-slate-600 mt-2">
              Your position for <strong className="text-slate-800">{title}</strong> has been added and AI matching is now analyzing candidate proficiencies.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button size="sm" variant="primary" onClick={() => { setSuccess(false); setTitle(''); setDescription(''); }}>
                Post Another Position
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto" padding="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer Intern"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Opportunity Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-slate-50/50"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Job">Full-time Job</option>
                    <option value="Research">Research Track</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stipend / Salary Range</label>
                  <input
                    type="text"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Python, SQL, Node.js"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe key responsibilities and expectations for candidates..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              <Button type="submit" size="lg" variant="primary" fullWidth loading={loading}>
                Submit & Publish Opportunity
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
