import React, { useState, useEffect } from 'react';
import { User, BookOpen, Wrench, Briefcase, Award, FolderGit2, Check, Plus, X, Save, RefreshCw } from 'lucide-react';
import { normalizeSkillsApi } from '../services/api';

export default function ParsedResumeCard({ data, onSaveProfile }) {
  const [formData, setFormData] = useState({
    name: '',
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    experience: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newExp, setNewExp] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        education: Array.isArray(data.education) ? data.education : [],
        skills: Array.isArray(data.skills) ? data.skills : [],
        projects: Array.isArray(data.projects) ? data.projects : [],
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        experience: Array.isArray(data.experience) ? data.experience : []
      });
      setIsSaved(false);
    }
  }, [data]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    try {
      const normalized = await normalizeSkillsApi([...formData.skills, newSkill.trim()]);
      setFormData(prev => ({ ...prev, skills: normalized }));
      setNewSkill('');
    } catch (err) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.trim()) return;
    setFormData(prev => ({ ...prev, projects: [...prev.projects, newProject.trim()] }));
    setNewProject('');
  };

  const handleRemoveProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (!newCert.trim()) return;
    setFormData(prev => ({ ...prev, certifications: [...prev.certifications, newCert.trim()] }));
    setNewCert('');
  };

  const handleRemoveCert = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleAddExp = (e) => {
    e.preventDefault();
    if (!newExp.trim()) return;
    setFormData(prev => ({ ...prev, experience: [...prev.experience, newExp.trim()] }));
    setNewExp('');
  };

  const handleRemoveExp = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (onSaveProfile) {
      onSaveProfile(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Review Extracted Data
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">Structured Candidate Profile</h3>
          <p className="text-xs text-slate-500">Review and verify the AI-parsed resume information before committing to your profile.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            isSaved
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" /> Profile Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save to Profile
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {/* Name & Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" /> Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              placeholder="Student Name"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Education
            </label>
            <input
              type="text"
              value={formData.education.join(', ')}
              onChange={(e) => setFormData({ ...formData, education: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              placeholder="e.g. B.Tech Computer Science"
            />
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-indigo-600" /> Extracted & Normalized Skills ({formData.skills.length})
            </label>
            <span className="text-[11px] text-slate-400">Canonical taxonomy applied</span>
          </div>

          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[52px]">
            {formData.skills.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No skills extracted yet.</span>
            ) : (
              formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-indigo-200 rounded-md text-xs font-semibold text-indigo-900 shadow-xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          <form onSubmit={handleAddSkill} className="mt-2 flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g., JS, Docker, PostgreSQL)..."
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Skill
            </button>
          </form>
        </div>

        {/* Projects */}
        <div>
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2">
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" /> Projects ({formData.projects.length})
          </label>
          <div className="space-y-1.5">
            {formData.projects.map((proj, idx) => (
              <div key={idx} className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800">
                <span>{proj}</span>
                <button type="button" onClick={() => handleRemoveProject(idx)} className="text-slate-400 hover:text-red-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddProject} className="mt-2 flex gap-2">
            <input
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              placeholder="Add project title..."
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
            <button type="submit" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>
        </div>

        {/* Experience & Certifications in 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Experience */}
          <div>
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> Experience / Internships ({formData.experience.length})
            </label>
            <div className="space-y-1.5">
              {formData.experience.map((exp, idx) => (
                <div key={idx} className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800">
                  <span>{exp}</span>
                  <button type="button" onClick={() => handleRemoveExp(idx)} className="text-slate-400 hover:text-red-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddExp} className="mt-2 flex gap-2">
              <input
                type="text"
                value={newExp}
                onChange={(e) => setNewExp(e.target.value)}
                placeholder="Add role or internship..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
              />
              <button type="submit" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Certifications */}
          <div>
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2">
              <Award className="w-3.5 h-3.5 text-indigo-600" /> Certifications ({formData.certifications.length})
            </label>
            <div className="space-y-1.5">
              {formData.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800">
                  <span>{cert}</span>
                  <button type="button" onClick={() => handleRemoveCert(idx)} className="text-slate-400 hover:text-red-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddCert} className="mt-2 flex gap-2">
              <input
                type="text"
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                placeholder="Add certification..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
              />
              <button type="submit" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
