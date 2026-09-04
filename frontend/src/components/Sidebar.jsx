import { NavLink, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  IconDashboard,
  IconFileText,
  IconBriefcase,
  IconFolder,
  IconAward,
  IconUser,
  IconLogOut,
  IconCheckCircle,
  IconSparkles,
  IconUsers,
  IconBookOpen,
  IconBuilding,
  IconBarChart,
  IconTrendingUp,
} from './Icons';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const currentUser = api.getCurrentUser();

  const handleLogout = () => {
    api.logoutUser();
    navigate('/');
    window.location.reload();
  };

  const role = currentUser.role || 'Student';
  const userName = currentUser.name || 'Platform User';
  
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'PU';

  // Role-Based Navigation Items Specification
  const navItemsByRole = {
    Student: [
      { name: 'Dashboard', path: '/dashboard', icon: IconDashboard },
      { name: 'Resume & Skills', path: '/resume', icon: IconFileText },
      { name: 'Opportunities', path: '/opportunities', icon: IconBriefcase },
      { name: 'Applications', path: '/applications', icon: IconCheckCircle },
      { name: 'Portfolio', path: '/portfolio', icon: IconFolder },
      { name: 'Credentials', path: '/credentials', icon: IconAward },
      { name: 'Profile', path: '/profile', icon: IconUser },
    ],
    Industry: [
      { name: 'Dashboard', path: '/dashboard', icon: IconDashboard },
      { name: 'Post Opportunities', path: '/post-opportunity', icon: IconBriefcase },
      { name: 'Candidates', path: '/candidates', icon: IconUsers },
      { name: 'Applications', path: '/applications', icon: IconCheckCircle },
      { name: 'Skill Demand', path: '/skill-demand', icon: IconBarChart },
      { name: 'Company Profile', path: '/profile', icon: IconBuilding },
    ],
    Academician: [
      { name: 'Dashboard', path: '/dashboard', icon: IconDashboard },
      { name: 'Research', path: '/research', icon: IconBookOpen },
      { name: 'FDPs', path: '/fdp', icon: IconAward },
      { name: 'Mentorship', path: '/mentorship', icon: IconUsers },
      { name: 'Collaborations', path: '/collaborations', icon: IconBuilding },
      { name: 'Profile', path: '/profile', icon: IconUser },
    ],
    Institution: [
      { name: 'Dashboard', path: '/dashboard', icon: IconDashboard },
      { name: 'Students', path: '/student-analytics', icon: IconUsers },
      { name: 'Faculty', path: '/faculty', icon: IconBookOpen },
      { name: 'Placements', path: '/placements', icon: IconTrendingUp },
      { name: 'Analytics', path: '/analytics', icon: IconBarChart },
      { name: 'Industry Partnerships', path: '/partnerships', icon: IconBuilding },
      { name: 'Profile', path: '/profile', icon: IconUser },
    ],
    'Institution Admin': [
      { name: 'Dashboard', path: '/dashboard', icon: IconDashboard },
      { name: 'Students', path: '/student-analytics', icon: IconUsers },
      { name: 'Faculty', path: '/faculty', icon: IconBookOpen },
      { name: 'Placements', path: '/placements', icon: IconTrendingUp },
      { name: 'Analytics', path: '/analytics', icon: IconBarChart },
      { name: 'Industry Partnerships', path: '/partnerships', icon: IconBuilding },
      { name: 'Profile', path: '/profile', icon: IconUser },
    ],
    'Platform Admin': [
      { name: 'Dashboard', path: '/admin/dashboard', icon: IconDashboard },
      { name: 'Users', path: '/admin/users', icon: IconUsers },
      { name: 'Institutions', path: '/admin/institutions', icon: IconBuilding },
      { name: 'Industry', path: '/admin/industry', icon: IconBriefcase },
      { name: 'Opportunities', path: '/admin/opportunities', icon: IconFolder },
      { name: 'Skill Verification', path: '/admin/verification', icon: IconCheckCircle },
      { name: 'Analytics', path: '/admin/analytics', icon: IconBarChart },
      { name: 'Reports', path: '/admin/reports', icon: IconFileText },
      { name: 'Profile', path: '/admin/profile', icon: IconUser },
    ],
  };

  const navItems = navItemsByRole[role] || navItemsByRole.Student;

  return (
    <aside
      className={`fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* User Profile Widget */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-2xs">
            {initials}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">{userName}</h4>
            <p className="text-xs text-cyan-400 font-semibold truncate">{role} Portal</p>
          </div>
        </div>

        {/* Role-Based Navigation Menu */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            {role} Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-md shadow-blue-600/20'
                      : 'hover:bg-slate-800/70 hover:text-white text-slate-400'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Engine Widget */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
            <IconSparkles className="w-4 h-4" />
            <span>AI {role} Engine</span>
          </div>
          <p className="text-slate-400 leading-relaxed mb-3">
            Real-time platform synchronization and monitoring active.
          </p>
          <div className="w-full bg-slate-750 rounded-full h-1.5 mb-1 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full w-[94%]" />
          </div>
          <p className="text-[10px] text-slate-400 text-right font-medium">System Active</p>
        </div>
      </div>

      {/* Footer Logout */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-900/40 transition-all cursor-pointer"
        >
          <IconLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
