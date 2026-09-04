import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { IconBuilding } from '../components/Icons';

export default function AcademicianCollaborations() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([
    { id: 1, partner: 'TechNova Solutions', topic: 'Full-Stack Developer Curriculum Review', status: 'Pending Request' },
    { id: 2, partner: 'Cloud Native Foundation', topic: 'Kubernetes Microservices Student Fellowship', status: 'Accepted' },
    { id: 3, partner: 'Indo-Global Research Council', topic: 'Demographic AI Dataset Grant', status: 'Accepted' },
  ]);

  const handleAccept = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Accepted' } : r));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconBuilding className="w-7 h-7 text-blue-600" />
              Industry & Research Collaborations
            </h1>
            <p className="text-xs text-slate-500 mt-1">Manage joint industry research requests, grants, and curriculum co-design</p>
          </div>
        </div>

        <div className="space-y-4">
          {requests.map((r) => (
            <Card key={r.id} padding="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{r.topic}</h3>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${r.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{r.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Industry Partner: <strong className="text-slate-800">{r.partner}</strong></p>
                </div>
                {r.status === 'Pending Request' ? (
                  <Button size="sm" variant="primary" onClick={() => handleAccept(r.id)}>
                    Accept Collaboration
                  </Button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600">MoU Active ✓</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
