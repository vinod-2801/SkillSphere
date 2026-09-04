import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { IconBuilding, IconCheckCircle } from '../components/Icons';

export default function InstitutionPartnerships() {
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await api.getPartnerships();
      setPartnerships(data);
      setLoading(false);
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
              <IconBuilding className="w-7 h-7 text-blue-600" />
              Industry Partnerships & Corporate MoUs
            </h1>
            <p className="text-xs text-slate-500 mt-1">Enterprise partner companies, hiring MoUs, and active recruiter contacts</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading industry partnerships...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerships.map((p) => (
              <Card key={p.id} padding="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{p.company}</h3>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold">{p.tier}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <IconCheckCircle className="w-3.5 h-3.5" /> {p.status}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Candidates Hired</span>
                    <span className="font-bold text-slate-900">{p.hiresCount} Hires</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recruiter Contact</span>
                    <span className="font-mono text-slate-700">{p.contact}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
