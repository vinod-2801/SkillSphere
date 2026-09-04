import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { IconBarChart } from '../components/Icons';

export default function IndustrySkillDemand() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const skillDemands = [
    { skill: 'Python & Data Engineering', demand: 96, growth: '+14% YoY', positions: '142 Open Positions' },
    { skill: 'React & Frontend Architecture', demand: 91, growth: '+9% YoY', positions: '118 Open Positions' },
    { skill: 'SQL & Database Systems', demand: 88, growth: '+11% YoY', positions: '105 Open Positions' },
    { skill: 'Cloud Native & Docker', demand: 84, growth: '+22% YoY', positions: '89 Open Positions' },
    { skill: 'Java & Microservices', demand: 81, growth: '+6% YoY', positions: '76 Open Positions' },
    { skill: 'Machine Learning & PyTorch', demand: 78, growth: '+28% YoY', positions: '64 Open Positions' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconBarChart className="w-7 h-7 text-blue-600" />
              Industry Skill Demand Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-1">Real-time market analytics on required candidate proficiencies</p>
          </div>
        </div>

        <Card title="Highest Demanded Skills in Active Hiring Tracks">
          <div className="space-y-5">
            {skillDemands.map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-900 text-sm">{item.skill}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-600 font-semibold">{item.growth}</span>
                    <span className="text-blue-600 text-sm">{item.demand}% Market Demand</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 h-3 rounded-full" style={{ width: `${item.demand}%` }} />
                </div>
                <p className="text-[11px] text-slate-500">{item.positions}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
