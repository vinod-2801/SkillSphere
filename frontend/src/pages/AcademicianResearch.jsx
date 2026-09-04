import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { IconBookOpen, IconCheckCircle } from '../components/Icons';

export default function AcademicianResearch() {
  const [research, setResearch] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await api.getResearch();
      setResearch(data);
    }
    loadData();
  }, []);

  const handleJoin = (id) => {
    setResearch(prev => prev.map(r => r.id === id ? { ...r, status: 'Joined' } : r));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconBookOpen className="w-7 h-7 text-blue-600" />
              Academic Research & Grant Opportunities
            </h1>
            <p className="text-xs text-slate-500 mt-1">Joint academia-industry research papers, grants, and data analytics tracks</p>
          </div>
          <Button size="sm" variant="primary" onClick={() => alert("New Research Proposal form submitted.")}>
            New Research Proposal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {research.map((item) => (
            <Card key={item.id} padding="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${item.status === 'Joined' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mb-3">Partner: {item.partner} • Duration: {item.duration}</p>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="font-extrabold text-emerald-700">{item.stipend}</span>
                {item.status === 'Joined' ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <IconCheckCircle className="w-4 h-4" /> Joined Track
                  </span>
                ) : (
                  <Button size="sm" variant="primary" onClick={() => handleJoin(item.id)}>
                    Join Collaboration
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
