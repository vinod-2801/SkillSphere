import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { IconBookOpen } from '../components/Icons';

export default function InstitutionFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await api.getFaculty();
      setFaculty(data);
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
              <IconBookOpen className="w-7 h-7 text-blue-600" />
              Faculty Directory & Research Output
            </h1>
            <p className="text-xs text-slate-500 mt-1">Institutional academic staff, departments, and active research projects</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading faculty directory...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faculty.map((f) => (
              <Card key={f.id} padding="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{f.name}</h3>
                    <p className="text-xs text-blue-700 font-semibold">{f.designation}</p>
                    <p className="text-xs text-slate-500">{f.department}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <p className="text-slate-400 font-bold uppercase text-[10px]">Research Papers</p>
                    <p className="text-sm font-black text-slate-800">{f.researchCount}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <p className="text-slate-400 font-bold uppercase text-[10px]">Active Grants</p>
                    <p className="text-sm font-black text-blue-600">{f.collaborations}</p>
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
