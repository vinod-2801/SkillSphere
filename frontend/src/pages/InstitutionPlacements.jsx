import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { IconTrendingUp } from '../components/Icons';

export default function InstitutionPlacements() {
  const [placements, setPlacements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await api.getPlacements();
      setPlacements(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading || !placements) {
    return <div className="p-8 text-center text-slate-500">Loading placement data...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconTrendingUp className="w-7 h-7 text-blue-600" />
              Campus Placement Statistics & Records
            </h1>
            <p className="text-xs text-slate-500 mt-1">Placement rate, hiring partners, average salary packages, and placement metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Rate</p>
            <p className="text-3xl font-black text-emerald-600">{placements.placementRate}</p>
            <p className="text-[11px] text-slate-500">{placements.studentsPlaced} / {placements.totalEligible} Students</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students Placed</p>
            <p className="text-3xl font-black text-blue-600">{placements.studentsPlaced}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">Tier 1 & 2 Companies</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Package</p>
            <p className="text-3xl font-black text-slate-900">{placements.averagePackage}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">+12% vs last year</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Highest Package</p>
            <p className="text-3xl font-black text-slate-900">{placements.highestPackage}</p>
            <p className="text-[11px] text-cyan-600 font-semibold">Cloud Architecture Track</p>
          </div>
        </div>

        <Card title="Top Hiring Partners on Campus" subtitle="Companies hiring graduating candidates">
          <div className="space-y-3">
            {placements.topRecruiters.map((rec, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                    {rec.logo}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{rec.name}</h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {rec.hires} Students Placed
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
