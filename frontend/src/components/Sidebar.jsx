import React from 'react';
import { LayoutDashboard, Briefcase, FileCheck, Award, Cpu, ShieldCheck } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menu = [
    { id: 'dashboard', label: 'AI Intelligence Hub', icon: LayoutDashboard, badge: 'Active' },
    { id: 'jobs', label: 'Industry Job Match', icon: Briefcase, badge: '3 Roles' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-4 flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
            Core Modules
          </span>
          <nav className="mt-2 space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Feature Highlights Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-indigo-300" />
            <span className="text-xs font-bold text-indigo-200">INNOVEX AI Pipeline</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            6-factor AI intelligence engine: Parser, Extraction, Normalization, Gap Analysis, Explainability & Score.
          </p>
          <div className="text-[10px] text-indigo-300/80 font-mono bg-indigo-950/60 p-2 rounded border border-indigo-800/40">
            SIH 2026 Prototype
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400">SkillSphere Portal v1.0</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Team INNOVEX</p>
      </div>
    </aside>
  );
}
