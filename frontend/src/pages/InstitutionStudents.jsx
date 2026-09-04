import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { IconUsers, IconCheckCircle } from '../components/Icons';

export default function InstitutionStudents() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await api.getCandidates();
      setCandidates(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconUsers className="w-7 h-7 text-blue-600" />
              Institutional Student Skill Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">Aggregate student skill scores, verification statuses, and institutional readiness</p>
          </div>
        </div>

        <Card padding="p-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name or skill..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </Card>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading student directory...</div>
        ) : (
          <Card title="Enrolled Students & Employability Scores">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Degree & Batch</th>
                    <th className="px-4 py-3">Employability Score</th>
                    <th className="px-4 py-3">Verified Proficiencies</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-bold text-slate-900">{cand.name}</td>
                      <td className="px-4 py-3 text-slate-600">{cand.degree}</td>
                      <td className="px-4 py-3 font-black text-blue-600">{cand.score} / 100</td>
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
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                          <IconCheckCircle className="w-3 h-3" /> Verified Student
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
