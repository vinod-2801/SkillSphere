import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './services/api';
import Navbar from './components/Navbar';

// Common Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume';
import Opportunities from './pages/Opportunities';
import MatchDetails from './pages/MatchDetails';
import Apply from './pages/Apply';
import ApplicationsList from './pages/ApplicationsList';
import Portfolio from './pages/Portfolio';
import Credentials from './pages/Credentials';
import Profile from './pages/Profile';

// Industry Pages
import IndustryPostOpportunity from './pages/IndustryPostOpportunity';
import IndustryCandidates from './pages/IndustryCandidates';
import IndustrySkillDemand from './pages/IndustrySkillDemand';

// Academician Pages
import AcademicianResearch from './pages/AcademicianResearch';
import AcademicianFDP from './pages/AcademicianFDP';
import AcademicianMentorship from './pages/AcademicianMentorship';
import AcademicianCollaborations from './pages/AcademicianCollaborations';

// Institution Pages
import InstitutionStudents from './pages/InstitutionStudents';
import InstitutionFaculty from './pages/InstitutionFaculty';
import InstitutionPlacements from './pages/InstitutionPlacements';
import InstitutionAnalytics from './pages/InstitutionAnalytics';
import InstitutionPartnerships from './pages/InstitutionPartnerships';

// Platform Admin Pages
import {
  AdminUsers,
  AdminInstitutions,
  AdminIndustry,
  AdminOpportunities,
  AdminVerification,
  AdminAnalytics,
  AdminReports,
  AdminProfile,
} from './pages/AdminPages';

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'Platform Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(() => api.getCurrentUser());

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-blue-500 selection:text-white flex flex-col">
        <Navbar user={user} />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/opportunities" element={<Opportunities />} />

            {/* Dashboard Routes for all 5 roles */}
            <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
            <Route path="/student/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
            <Route path="/industry/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
            <Route path="/academician/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
            <Route path="/institution/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />

            {/* Student Routes */}
            <Route path="/resume" element={<ProtectedRoute user={user}><Resume /></ProtectedRoute>} />
            <Route path="/match/:id" element={<ProtectedRoute user={user}><MatchDetails /></ProtectedRoute>} />
            <Route path="/apply/:id" element={<ProtectedRoute user={user} allowedRoles={['Student']}><Apply /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute user={user}><ApplicationsList /></ProtectedRoute>} />
            <Route path="/portfolio" element={<ProtectedRoute user={user}><Portfolio /></ProtectedRoute>} />
            <Route path="/credentials" element={<ProtectedRoute user={user}><Credentials /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />

            {/* Industry Routes */}
            <Route path="/post-opportunity" element={<ProtectedRoute user={user}><IndustryPostOpportunity /></ProtectedRoute>} />
            <Route path="/candidates" element={<ProtectedRoute user={user}><IndustryCandidates /></ProtectedRoute>} />
            <Route path="/skill-demand" element={<ProtectedRoute user={user}><IndustrySkillDemand /></ProtectedRoute>} />

            {/* Academician Routes */}
            <Route path="/research" element={<ProtectedRoute user={user}><AcademicianResearch /></ProtectedRoute>} />
            <Route path="/fdp" element={<ProtectedRoute user={user}><AcademicianFDP /></ProtectedRoute>} />
            <Route path="/mentorship" element={<ProtectedRoute user={user}><AcademicianMentorship /></ProtectedRoute>} />
            <Route path="/collaborations" element={<ProtectedRoute user={user}><AcademicianCollaborations /></ProtectedRoute>} />

            {/* Institution Routes */}
            <Route path="/student-analytics" element={<ProtectedRoute user={user}><InstitutionStudents /></ProtectedRoute>} />
            <Route path="/faculty" element={<ProtectedRoute user={user}><InstitutionFaculty /></ProtectedRoute>} />
            <Route path="/placements" element={<ProtectedRoute user={user}><InstitutionPlacements /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute user={user}><InstitutionAnalytics /></ProtectedRoute>} />
            <Route path="/partnerships" element={<ProtectedRoute user={user}><InstitutionPartnerships /></ProtectedRoute>} />

            {/* Platform Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute user={user} allowedRoles={['Platform Admin']}><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute user={user} allowedRoles={['Platform Admin']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/institutions" element={<ProtectedRoute user={user} allowedRoles={['Platform Admin']}><AdminInstitutions /></ProtectedRoute>} />
            <Route path="/admin/industry" element={<ProtectedRoute user={user} allowedRoles={['Platform Admin']}><AdminIndustry /></ProtectedRoute>} />
            <Route path="/admin/opportunities" element={<ProtectedRoute user={user} allowedRoles={['Platform Admin']}><AdminOpportunities /></ProtectedRoute>} />
            <Route path="/admin/verification" element={<ProtectedRoute user={user} allowedRoles={['Platform Admin']}><AdminVerification /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute user={user} allowedRoles={['Platform Admin']}><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute user={user} allowedRoles={['Platform Admin']}><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute user={user} allowedRoles={['Platform Admin']}><AdminProfile /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}