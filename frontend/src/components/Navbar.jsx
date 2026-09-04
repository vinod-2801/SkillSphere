import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Button from './Button';
import { IconLogo, IconMenu, IconX, IconLogOut, IconShieldCheck } from './Icons';

export default function Navbar({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    api.logoutUser();
    navigate('/');
    window.location.reload();
  };

  const isDashboardArea = [
    '/dashboard',
    '/admin',
    '/resume',
    '/opportunities',
    '/portfolio',
    '/credentials',
    '/profile',
    '/applications',
    '/post-opportunity',
    '/candidates',
    '/skill-demand',
    '/research',
    '/fdp',
    '/mentorship',
    '/collaborations',
    '/student-analytics',
    '/faculty',
    '/placements',
    '/analytics',
    '/partnerships',
  ].some((path) => location.pathname.startsWith(path));

  const dashboardPath = user && user.role === 'Platform Admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <IconLogo className="w-9 h-9 group-hover:scale-105 transition-transform duration-200" />
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              SkillSphere
            </span>
          </Link>

          {/* Navigation Links for Public Views */}
          {!isDashboardArea && (
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#ecosystem" className="hover:text-blue-600 transition-colors">Ecosystem</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
              <Link to="/opportunities" className="hover:text-blue-600 transition-colors">Opportunities</Link>
            </nav>
          )}

          {/* User Status / Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user && user.isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link to={dashboardPath} className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                    <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-0.5">
                      <IconShieldCheck className="w-3 h-3 inline" />
                      {user.role || 'Student'}
                    </span>
                  </div>
                </Link>
                <Link to={dashboardPath}>
                  <Button size="sm" variant="secondary">
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <IconLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          {!isDashboardArea && (
            <div className="space-y-2 py-2 text-sm font-medium text-slate-600">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50">Features</a>
              <a href="#ecosystem" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50">Ecosystem</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50">How It Works</a>
              <Link to="/opportunities" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50">Opportunities</Link>
            </div>
          )}

          {user && user.isLoggedIn ? (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="px-3 py-2">
                <p className="text-sm font-bold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <Link to={dashboardPath} onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <Button fullWidth variant="primary" size="sm">
                  Go to Dashboard
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-2"
              >
                <IconLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button fullWidth variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button fullWidth variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
