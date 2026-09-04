import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { IconCheckCircle } from '../components/Icons';

export default function ApplicationsList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = api.getCurrentUser();
  const isStudent = currentUser.role === 'Student';

  useEffect(() => {
    async function loadApps() {
      const data = await api.getApplications();
      setApplications(data);
      setLoading(false);
    }
    loadApps();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const res = await api.updateApplicationStatus(id, newStatus);
    if (res.success) {
      setApplications(res.applications);
    }
  };

  const hasUserData = api.hasUserData();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconCheckCircle className="w-7 h-7 text-blue-600" />
              {isStudent ? 'My Submitted Applications' : 'Applications Received'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {isStudent ? 'Track interview schedules, review stages, and recruiter responses' : 'Review candidate applications, shortlist profiles, and manage hiring pipeline'}
            </p>
          </div>
          {isStudent && (
            <Link to="/opportunities">
              <Button size="sm" variant="primary">
                Find More Positions
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading applications...</div>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} padding="p-6" className="hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900">{app.title}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          app.status === 'Shortlisted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {isStudent ? `Company: ${app.company}` : `Applicant: ${app.candidateName || 'Candidate'}`} • Submitted: {app.submittedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <p className="text-slate-400 font-semibold uppercase text-[10px]">Match Index</p>
                      {hasUserData ? (
                        <p className="text-base font-black text-blue-600">{app.matchPercentage}% Match</p>
                      ) : (
                        <p className="text-xs font-bold text-amber-600">Upload Resume</p>
                      )}
                    </div>

                    {isStudent ? (
                      <Link to={`/match/${app.opportunityId}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={app.status === 'Shortlisted' ? 'secondary' : 'primary'}
                          onClick={() => handleStatusChange(app.id, app.status === 'Shortlisted' ? 'Applied' : 'Shortlisted')}
                        >
                          {app.status === 'Shortlisted' ? 'Shortlisted ✓' : 'Shortlist'}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleStatusChange(app.id, 'Rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-slate-500 text-sm">No applications found.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
