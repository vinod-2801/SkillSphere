import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  IconUsers,
  IconBuilding,
  IconBriefcase,
  IconFolder,
  IconCheckCircle,
  IconBarChart,
  IconFileText,
  IconUser,
} from '../components/Icons';

/* ==========================================================================
   1. USER MANAGEMENT PAGE (/admin/users)
   ========================================================================== */
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const data = await api.getAdminUsers();
      setUsers(data);
    }
    loadUsers();
  }, []);

  const handleStatusToggle = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Deactivated' : 'Active';
    await api.updateAdminUserStatus(userId, nextStatus);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconUsers className="w-7 h-7 text-blue-600" />
              Platform User Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">Review, approve, and manage ecosystem user accounts across all roles</p>
          </div>
        </div>

        <Card title="Ecosystem Registered Users" subtitle="Live directory of platform members">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Institution / Org</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.institution || 'SkillSphere Network'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleStatusToggle(u.id, u.status || 'Active')}
                        className={`px-2.5 py-1 rounded font-bold ${
                          u.status === 'Active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'Active' ? 'Deactivate' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedUser && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">User Profile Details</h3>
              <div className="space-y-2 text-xs">
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Institution:</strong> {selectedUser.institution || 'N/A'}</p>
                <p><strong>Status:</strong> {selectedUser.status || 'Active'}</p>
              </div>
              <Button fullWidth variant="secondary" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   2. INSTITUTION MANAGEMENT PAGE (/admin/institutions)
   ========================================================================== */
export function AdminInstitutions() {
  const [institutions, setInstitutions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedInst, setSelectedInst] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await api.getAdminInstitutions();
      setInstitutions(data);
    }
    loadData();
  }, []);

  const handleAction = async (id, status) => {
    await api.updateAdminInstitutionStatus(id, status);
    setInstitutions((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconBuilding className="w-7 h-7 text-blue-600" />
              Institution Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">Manage institutional partners, NIRF statistics, and campus accounts</p>
          </div>
        </div>

        <Card title="Registered Institutions" subtitle="Academic partners on SkillSphere">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Institution Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Enrolled Students</th>
                  <th className="px-4 py-3">Placement Readiness</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {institutions.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{inst.name}</td>
                    <td className="px-4 py-3 text-slate-600">{inst.location}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{inst.students}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">{inst.readiness}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inst.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inst.status === 'Suspended'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inst.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => setSelectedInst(inst)} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold hover:bg-slate-200">
                        View
                      </button>
                      {inst.status !== 'Approved' && (
                        <button onClick={() => handleAction(inst.id, 'Approved')} className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100">
                          Approve
                        </button>
                      )}
                      {inst.status !== 'Suspended' && (
                        <button onClick={() => handleAction(inst.id, 'Suspended')} className="px-2.5 py-1 rounded bg-red-50 text-red-600 font-bold hover:bg-red-100">
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedInst && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">{selectedInst.name}</h3>
              <div className="space-y-2 text-xs">
                <p><strong>Location:</strong> {selectedInst.location}</p>
                <p><strong>Enrolled Students:</strong> {selectedInst.students}</p>
                <p><strong>Placement Readiness Index:</strong> {selectedInst.readiness}</p>
                <p><strong>Verification Status:</strong> {selectedInst.status}</p>
              </div>
              <Button fullWidth variant="secondary" onClick={() => setSelectedInst(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   3. INDUSTRY MANAGEMENT PAGE (/admin/industry)
   ========================================================================== */
export function AdminIndustry() {
  const [industryList, setIndustryList] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await api.getAdminIndustry();
      setIndustryList(data);
    }
    loadData();
  }, []);

  const handleAction = async (id, status) => {
    await api.updateAdminIndustryStatus(id, status);
    setIndustryList((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconBriefcase className="w-7 h-7 text-blue-600" />
              Industry Partner Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">Review corporate recruiter profiles, active job posts, and corporate partnerships</p>
          </div>
        </div>

        <Card title="Corporate Industry Partners" subtitle="Active recruiter accounts">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Industry Domain</th>
                  <th className="px-4 py-3">Open Opportunities</th>
                  <th className="px-4 py-3">Applications Received</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {industryList.map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{ind.name}</td>
                    <td className="px-4 py-3 text-slate-600">{ind.industry}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">{ind.openOpportunities}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{ind.applications}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ind.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ind.status === 'Suspended'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ind.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => setSelectedCompany(ind)} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold hover:bg-slate-200">
                        View
                      </button>
                      {ind.status !== 'Approved' && (
                        <button onClick={() => handleAction(ind.id, 'Approved')} className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100">
                          Approve
                        </button>
                      )}
                      {ind.status !== 'Suspended' && (
                        <button onClick={() => handleAction(ind.id, 'Suspended')} className="px-2.5 py-1 rounded bg-red-50 text-red-600 font-bold hover:bg-red-100">
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedCompany && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">{selectedCompany.name}</h3>
              <div className="space-y-2 text-xs">
                <p><strong>Industry Domain:</strong> {selectedCompany.industry}</p>
                <p><strong>Open Positions:</strong> {selectedCompany.openOpportunities}</p>
                <p><strong>Total Applications:</strong> {selectedCompany.applications}</p>
                <p><strong>Status:</strong> {selectedCompany.status}</p>
              </div>
              <Button fullWidth variant="secondary" onClick={() => setSelectedCompany(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   4. OPPORTUNITY MANAGEMENT PAGE (/admin/opportunities)
   ========================================================================== */
export function AdminOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await api.getAdminOpportunities();
      setOpportunities(data);
    }
    loadData();
  }, []);

  const handleAction = async (id, status) => {
    await api.updateAdminOpportunityStatus(id, status);
    if (status === 'Removed') {
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
    } else {
      setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconFolder className="w-7 h-7 text-blue-600" />
              Platform Opportunities Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">Audit, approve, or remove job listings, internships, and research grants</p>
          </div>
        </div>

        <Card title="Platform Opportunities Directory" subtitle="Live listings across all roles">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Company / Org</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Applications</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{opp.title}</td>
                    <td className="px-4 py-3 text-slate-600">{opp.company}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{opp.type}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">{opp.applicationsCount || 12}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {opp.status || 'Approved'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => setSelectedOpp(opp)} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold hover:bg-slate-200">
                        View
                      </button>
                      <button onClick={() => handleAction(opp.id, 'Removed')} className="px-2.5 py-1 rounded bg-red-50 text-red-600 font-bold hover:bg-red-100">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedOpp && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">{selectedOpp.title}</h3>
              <div className="space-y-2 text-xs">
                <p><strong>Company:</strong> {selectedOpp.company}</p>
                <p><strong>Location:</strong> {selectedOpp.location}</p>
                <p><strong>Stipend / Compensation:</strong> {selectedOpp.stipend}</p>
                <p><strong>Required Skills:</strong> {selectedOpp.requiredSkills ? selectedOpp.requiredSkills.join(', ') : 'N/A'}</p>
                <p><strong>Description:</strong> {selectedOpp.description}</p>
              </div>
              <Button fullWidth variant="secondary" onClick={() => setSelectedOpp(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   5. SKILL VERIFICATION PAGE (/admin/verification)
   ========================================================================== */
export function AdminVerification() {
  const [verifications, setVerifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedVer, setSelectedVer] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await api.getAdminVerifications();
      setVerifications(data);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconCheckCircle className="w-7 h-7 text-blue-600" />
              Skill Verification Audit
            </h1>
            <p className="text-xs text-slate-500 mt-1">Review student skill badges, verification scores, and automated test results</p>
          </div>
        </div>

        <Card title="Student Skill Verifications" subtitle="Cryptographically verified outcome records">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Skill</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Verification Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {verifications.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{v.studentName}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">{v.skill}</td>
                    <td className="px-4 py-3 text-slate-600">{v.category}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{v.score}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${v.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelectedVer(v)} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold hover:bg-slate-200">
                        View Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedVer && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Verification Report: {selectedVer.skill}</h3>
              <div className="space-y-2 text-xs">
                <p><strong>Candidate:</strong> {selectedVer.studentName}</p>
                <p><strong>Category:</strong> {selectedVer.category}</p>
                <p><strong>Benchmark Score:</strong> {selectedVer.score}</p>
                <p><strong>Verification Status:</strong> {selectedVer.status}</p>
                <p><strong>Verified Date:</strong> {selectedVer.date}</p>
              </div>
              <Button fullWidth variant="secondary" onClick={() => setSelectedVer(null)}>
                Close Audit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   6. PLATFORM ANALYTICS PAGE (/admin/analytics)
   ========================================================================== */
export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconBarChart className="w-7 h-7 text-blue-600" />
              Platform Analytics & Governance
            </h1>
            <p className="text-xs text-slate-500 mt-1">Cross-ecosystem metrics, student readiness trends, and industry engagement</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Skill Readiness</p>
            <p className="text-3xl font-black text-slate-900">{analytics ? analytics.skillReadinessAverage : '84.6%'}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">+4.2% Month-over-Month</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Readiness</p>
            <p className="text-3xl font-black text-blue-600">{analytics ? analytics.placementReadiness : '88%'}</p>
            <p className="text-[11px] text-blue-600 font-semibold">Tier-1 Eligible Candidates</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry Partners</p>
            <p className="text-3xl font-black text-cyan-600">{analytics ? analytics.industryParticipation : '32 Companies'}</p>
            <p className="text-[11px] text-cyan-600 font-semibold">Actively Recruiting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Skill Index Growth" subtitle="Skill readiness benchmark over recent cycles">
            <div className="space-y-4 text-xs">
              {[
                { domain: 'Full-Stack Web Engineering', rate: 92 },
                { domain: 'Data Structures & Algorithms', rate: 88 },
                { domain: 'Cloud & DevOps Containerization', rate: 81 },
                { domain: 'AI & Data Science Analytics', rate: 76 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{item.domain}</span>
                    <span className="text-blue-600">{item.rate}% Readiness</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2.5 rounded-full" style={{ width: `${item.rate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Application & Hiring Activity" subtitle="Ecosystem pipeline metrics">
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">Total Applications Processed</p>
                  <p className="text-[11px] text-slate-500">Student submissions</p>
                </div>
                <span className="text-xl font-black text-blue-600">128</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">Candidate Shortlists Issued</p>
                  <p className="text-[11px] text-slate-500">Industry stage reviews</p>
                </div>
                <span className="text-xl font-black text-emerald-600">45</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">Verified Credentials Issued</p>
                  <p className="text-[11px] text-slate-500">Outcome-based badges</p>
                </div>
                <span className="text-xl font-black text-cyan-600">342</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   7. REPORTS PAGE (/admin/reports)
   ========================================================================== */
export function AdminReports() {
  const [reports, setReports] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await api.getAdminReports();
      setReports(data);
    }
    loadData();
  }, []);

  const handleResolve = async (id) => {
    await api.updateAdminReportStatus(id, 'Resolved');
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Resolved' } : r)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconFileText className="w-7 h-7 text-blue-600" />
              Platform Compliance & Reports
            </h1>
            <p className="text-xs text-slate-500 mt-1">Review user flags, reported opportunities, and pending compliance reviews</p>
          </div>
        </div>

        <Card title="Reported Items & Compliance Queue" subtitle="Pending items requiring administrator review">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Report Type</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Reporter</th>
                  <th className="px-4 py-3">Reported Target</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{rep.type}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{rep.title}</td>
                    <td className="px-4 py-3 text-slate-600">{rep.reporter}</td>
                    <td className="px-4 py-3 text-slate-600">{rep.reportedTarget}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${rep.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {rep.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => alert(`Reviewing report: ${rep.title}`)} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold hover:bg-slate-200">
                        Review
                      </button>
                      {rep.status !== 'Resolved' && (
                        <button onClick={() => handleResolve(rep.id)} className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100">
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ==========================================================================
   8. ADMIN PROFILE PAGE (/admin/profile)
   ========================================================================== */
export function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await api.getProfile();
      setProfile(data);
      setFormData(data);
    }
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await api.updateProfile(formData);
    if (res.success) {
      setProfile(res.profile);
      setIsEditing(false);
    }
    setSaving(false);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconUser className="w-7 h-7 text-blue-600" />
              Platform Admin Profile
            </h1>
            <p className="text-xs text-slate-500 mt-1">Manage system administrator identity, credentials, and preferences</p>
          </div>

          <Button
            size="sm"
            variant={isEditing ? 'secondary' : 'primary'}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            loading={saving}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>

        <Card title="Administrator Credentials & Identity" subtitle="Platform administrator account">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="font-bold text-slate-900 text-sm">{profile.name || 'Platform Administrator'}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="font-bold text-slate-900 text-sm">{profile.email || 'admin@skillsphere.com'}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Ecosystem Role</label>
              <p className="font-bold text-blue-700 text-sm">Platform Admin</p>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Organization</label>
              {isEditing ? (
                <input
                  type="text"
                  name="institution"
                  value={formData.institution || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="font-bold text-slate-900 text-sm">{profile.institution || 'SkillSphere Core Administration'}</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
