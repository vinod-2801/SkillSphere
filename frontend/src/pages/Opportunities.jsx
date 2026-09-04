import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import OpportunityCard from '../components/OpportunityCard';
import Card from '../components/Card';
import Button from '../components/Button';
import { IconSearch, IconFilter, IconSparkles, IconBriefcase } from '../components/Icons';

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [minMatch, setMinMatch] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadOpps() {
      const data = await api.getOpportunities();
      setOpportunities(data);
      setLoading(false);
    }
    loadOpps();
  }, []);

  const tabs = ['All', 'Internships', 'Jobs', 'Research', 'FDP', 'Mentorship'];

  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab = activeTab === 'All' || opp.category === activeTab || opp.type === activeTab;
    const matchesMin = opp.matchPercentage >= minMatch;

    return matchesSearch && matchesTab && matchesMin;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconBriefcase className="w-7 h-7 text-blue-600" />
              Academia–Industry Opportunity Hub
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Curated internships, project grants, FDP programs, and hiring tracks sorted by AI Match.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
            <IconSparkles className="w-4 h-4 text-blue-600" />
            <span>{opportunities.length} Active Positions</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-4 shadow-2xs">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IconSearch className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by role title, company, or skill (e.g. React, Python, SQL)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>

            {/* Min Match Filter */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <IconFilter className="w-4 h-4 text-blue-600" />
              <span>Min Match:</span>
              <select
                value={minMatch}
                onChange={(e) => setMinMatch(Number(e.target.value))}
                className="bg-transparent font-bold text-blue-700 focus:outline-none cursor-pointer"
              >
                <option value={0}>All Scores</option>
                <option value={80}>80%+ High Match</option>
                <option value={90}>90%+ Top Match</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-3 text-xs font-semibold">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunity Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading opportunities...</div>
        ) : filteredOpps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredOpps.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <IconBriefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No Opportunities Found</h4>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms or filter constraints.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setActiveTab('All');
                setMinMatch(0);
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
