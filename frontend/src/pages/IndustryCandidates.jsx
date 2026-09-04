import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { IconUsers, IconSparkles } from '../components/Icons';

export default function IndustryCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await api.getCandidates();
      setCandidates(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const toggleShortlist = (id) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Shortlisted' ? 'Applied' : 'Shortlisted' } : c))
    );
  };

  const filtered = candidates.filter(
    (c) =>
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
              Verified Candidates Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">Review student profiles, verified skills, and shortlist candidates</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
            <IconSparkles className="w-4 h-4 text-blue-600" />
            <span>{candidates.length} Verified Candidates</span>
          </div>
        </div>

        <Card padding="p-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidates by name or skill (e.g. Python, React)..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </Card>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading candidates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((cand) => (
              <Card key={cand.id} padding="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{cand.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{cand.degree} • {cand.institution}</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
                    {cand.score} / 100 Index
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Verified Proficiencies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cand.skills.map((s) => (
                      <span key={s} className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold">
                        {s} ✓
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedCandidate(cand)}>
                    View Candidate Details
                  </Button>
                  <Button
                    size="sm"
                    variant={cand.status === 'Shortlisted' ? 'secondary' : 'primary'}
                    onClick={() => toggleShortlist(cand.id)}
                  >
                    {cand.status === 'Shortlisted' ? 'Shortlisted ✓' : 'Shortlist'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <Card className="max-w-md w-full bg-white p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCandidate.name}</h3>
                  <p className="text-xs text-slate-500">{selectedCandidate.degree} • {selectedCandidate.institution}</p>
                </div>
                <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Employability Index</span><span className="font-bold text-blue-600">{selectedCandidate.score} / 100</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Contact Email</span><span className="font-semibold text-slate-800">{selectedCandidate.email}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-bold text-emerald-600">{selectedCandidate.status}</span></div>
              </div>

              <Button fullWidth variant="primary" size="sm" onClick={() => { toggleShortlist(selectedCandidate.id); setSelectedCandidate(null); }}>
                {selectedCandidate.status === 'Shortlisted' ? 'Remove from Shortlist' : 'Shortlist Candidate Now'}
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
