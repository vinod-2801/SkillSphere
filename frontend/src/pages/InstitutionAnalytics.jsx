import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { IconBarChart } from '../components/Icons';

export default function InstitutionAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconBarChart className="w-7 h-7 text-blue-600" />
              Institutional Analytics & Placement Readiness
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Department-wise skill readiness, NIRF outcome analytics, and employability statistics.
            </p>
          </div>

          <Button size="sm" variant="primary" className="gap-2" onClick={() => alert("Institutional NIRF Report generated.")}>
            <IconBarChart className="w-4 h-4" />
            <span>Export NIRF Report</span>
          </Button>
        </div>

        {/* Institution Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Student Skill Score</p>
            <p className="text-3xl font-black text-slate-900">84.2 Index</p>
            <p className="text-[11px] text-emerald-600 font-semibold">+6.4% YoY</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Readiness</p>
            <p className="text-3xl font-black text-emerald-600">86% Ready</p>
            <p className="text-[11px] text-slate-500">Tier 1 Eligible</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Students</p>
            <p className="text-3xl font-black text-blue-600">450+ Enrolled</p>
            <p className="text-[11px] text-blue-600 font-semibold">Verified Credentials</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry Partners</p>
            <p className="text-3xl font-black text-slate-900">32 Partners</p>
            <p className="text-[11px] text-cyan-600 font-semibold">Active Recruiters</p>
          </div>
        </div>

        {/* Department Skill Readiness Analytics */}
        <Card title="Departmental Skill Readiness Analytics" subtitle="Aggregate employability index across engineering disciplines">
          <div className="space-y-4 text-xs">
            {[
              { dept: 'Computer Science & Engineering', score: 88, count: '180 Candidates' },
              { dept: 'Information Technology', score: 84, count: '120 Candidates' },
              { dept: 'Electronics & Communication', score: 79, count: '90 Candidates' },
              { dept: 'Mechanical Engineering', score: 74, count: '60 Candidates' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{item.dept}</span>
                  <span className="text-blue-600">{item.score} Index</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2.5 rounded-full" style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
