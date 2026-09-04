import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { IconAward, IconCheckCircle } from '../components/Icons';

export default function AcademicianFDP() {
  const [fdps, setFdps] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await api.getFDPs();
      setFdps(data);
    }
    loadData();
  }, []);

  const handleRegister = (id) => {
    setFdps(prev => prev.map(f => f.id === id ? { ...f, status: 'Enrolled' } : f));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconAward className="w-7 h-7 text-blue-600" />
              Faculty Development Programs (FDP)
            </h1>
            <p className="text-xs text-slate-500 mt-1">Outcome-based education modules, curriculum alignment, and technical workshops</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fdps.map((item) => (
            <Card key={item.id} padding="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : item.status === 'Enrolled' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mb-3">Issuer: {item.issuer} • Duration: {item.duration}</p>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">NPTEL / University Approved</span>
                {item.status === 'Open' ? (
                  <Button size="sm" variant="primary" onClick={() => handleRegister(item.id)}>
                    Register for FDP
                  </Button>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <IconCheckCircle className="w-4 h-4" /> {item.status}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
