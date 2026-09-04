import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { IconUsers } from '../components/Icons';

export default function AcademicianMentorship() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mentees = [
    { id: 1, student: 'Annavarapu Vinod Kumar', project: 'Smart Skill Mapping Portal', domain: 'React & Python', status: 'Active Mentorship' },
    { id: 2, student: 'Priya Sharma', project: 'Automated Placement Management Tool', domain: 'Java & SQL', status: 'In Review' },
    { id: 3, student: 'Rahul Verma', project: 'Distributed ML Feature Store', domain: 'Python & PyTorch', status: 'Approved' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconUsers className="w-7 h-7 text-blue-600" />
              Student Project Mentorships
            </h1>
            <p className="text-xs text-slate-500 mt-1">Review student capstone projects, approve milestones, and offer industry guidance</p>
          </div>
          <Button size="sm" variant="primary" onClick={() => alert("Mentorship slot published for students.")}>
            Open Mentorship Slot
          </Button>
        </div>

        <div className="space-y-4">
          {mentees.map((m) => (
            <Card key={m.id} padding="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{m.project}</h3>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">{m.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Student: <strong className="text-slate-800">{m.student}</strong> • Domain: {m.domain}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => alert(`Reviewing project milestones for ${m.student}`)}>
                  Review Milestones
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
