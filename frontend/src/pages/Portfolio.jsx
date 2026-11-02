import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import SkillBadge from '../components/SkillBadge';
import Button from '../components/Button';
import {
  IconDownload,
  IconFileText,
  IconShieldCheck,
  IconGraduationCap,
  IconMapPin,
  IconCheck,
  IconStar
} from '../components/Icons';

const emptyProjectForm = {
  project_name: '',
  description: '',
  technologies_used: '',
  github_url: '',
  demo_url: '',
  is_featured: false,
};

const emptyCertificateForm = {
  certificate_name: '',
  issuing_organization: '',
  issue_date: '',
  expiry_date: '',
  credential_id: '',
  credential_url: '',
  certificate_file_name: '',
};

export default function Portfolio() {
  const [profile, setProfile] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [savingProject, setSavingProject] = useState(false);
  const [certificateForm, setCertificateForm] = useState(emptyCertificateForm);
  const [editingCertificateId, setEditingCertificateId] = useState(null);
  const [savingCertificate, setSavingCertificate] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [prof, creds, projs] = await Promise.all([
        api.getProfile(),
        api.getCredentials(),
        api.getProjects(),
      ]);
      setProfile(prof);
      setCredentials(creds);
      setProjects(projs);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleCertificateSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      certificate_name: certificateForm.certificate_name.trim(),
      issuing_organization: certificateForm.issuing_organization.trim(),
      issue_date: certificateForm.issue_date,
      expiry_date: certificateForm.expiry_date || null,
      credential_id: certificateForm.credential_id.trim() || null,
      credential_url: certificateForm.credential_url.trim() || null,
      certificate_file_name: certificateForm.certificate_file_name || null,
    };

    if (!payload.certificate_name || !payload.issuing_organization || !payload.issue_date) return;

    setSavingCertificate(true);
    const result = editingCertificateId
      ? await api.updateCertificate(editingCertificateId, payload)
      : await api.addCertificate(payload);

    if (result.success) {
      const refreshed = await api.getCredentials();
      setCredentials(refreshed);
      setCertificateForm(emptyCertificateForm);
      setEditingCertificateId(null);
    }
    setSavingCertificate(false);
  };

  const handleDeleteCertificate = async (certId) => {
    const result = await api.deleteCertificate(certId);
    if (result.success) {
      const refreshed = await api.getCredentials();
      setCredentials(refreshed);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      project_name: projectForm.project_name.trim(),
      description: projectForm.description.trim(),
      technologies_used: projectForm.technologies_used
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      github_url: projectForm.github_url.trim(),
      demo_url: projectForm.demo_url.trim(),
      is_featured: projectForm.is_featured,
    };

    if (!payload.project_name) return;

    setSavingProject(true);
    const result = editingProjectId
      ? await api.updateProject(editingProjectId, payload)
      : await api.addProject(payload);

    if (result.success) {
      const refreshed = await api.getProjects();
      setProjects(refreshed);
      setProjectForm(emptyProjectForm);
      setEditingProjectId(null);
    }
    setSavingProject(false);
  };

  const handleDeleteProject = async (projectId) => {
    const result = await api.deleteProject(projectId);
    if (result.success) {
      const refreshed = await api.getProjects();
      setProjects(refreshed);
    }
  };

  const handleDownload = () => {
    const filename = profile && profile.name ? `${profile.name.replace(/\s+/g, '_')}_Portfolio.pdf` : 'SkillSphere_Portfolio.pdf';
    alert(`SkillSphere Digital Portfolio (PDF export generated). Downloading ${filename}`);
  };

  if (loading || !profile) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Profile Header Hero Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-black text-3xl text-white shadow-lg border-2 border-white/20 flex-shrink-0">
              AR
            </div>

            {/* Candidate Details */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black">{profile.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 flex items-center gap-1">
                  <IconShieldCheck className="w-3.5 h-3.5 inline" />
                  Verified Candidate
                </span>
              </div>
              <p className="text-sm font-semibold text-cyan-300">
                {profile.role} • {profile.degree}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1">
                  <IconGraduationCap className="w-4 h-4 text-blue-400" />
                  {profile.institution}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <IconMapPin className="w-4 h-4 text-blue-400" />
                  {profile.location}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">CGPA: {profile.cgpa}</span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl pt-2 leading-relaxed font-normal">
                {profile.bio}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full sm:w-auto flex-shrink-0">
              <Button size="sm" variant="primary" onClick={handleDownload} className="gap-2">
                <IconDownload className="w-4 h-4" />
                <span>Download Portfolio</span>
              </Button>
              <Link to="/resume">
                <Button size="sm" variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2">
                  <IconFileText className="w-4 h-4" />
                  <span>View Resume</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Verified Skill Badges Grid */}
        <Card title="Verified Skill Credentials" subtitle="Validated via academic assessment & industry certifications">
          <div className="flex flex-wrap gap-2.5">
            {profile.skills.map((skill, idx) => (
              <SkillBadge
                key={idx}
                name={skill.name}
                verified={skill.verified}
                level={skill.level}
                size="lg"
              />
            ))}
          </div>
        </Card>

        {/* Featured Projects Grid */}
        <Card title="Featured Industry Projects" subtitle="Hands-on software and research implementations">
          <form onSubmit={handleProjectSubmit} className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={projectForm.project_name}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, project_name: e.target.value }))}
                placeholder="Project Name"
                className="px-3 py-2 rounded-xl border border-slate-300"
              />
              <input
                type="text"
                value={projectForm.technologies_used}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, technologies_used: e.target.value }))}
                placeholder="React, Node.js, PostgreSQL"
                className="px-3 py-2 rounded-xl border border-slate-300"
              />
              <input
                type="url"
                value={projectForm.github_url}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, github_url: e.target.value }))}
                placeholder="GitHub URL"
                className="px-3 py-2 rounded-xl border border-slate-300"
              />
              <input
                type="url"
                value={projectForm.demo_url}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, demo_url: e.target.value }))}
                placeholder="Demo URL"
                className="px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <textarea
              rows={3}
              value={projectForm.description}
              onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Project Description"
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={projectForm.is_featured}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
                />
                Featured project
              </label>
              <div className="flex gap-2">
                <button type="submit" disabled={savingProject} className="rounded-xl bg-blue-600 text-white px-4 py-2 text-xs font-bold disabled:opacity-60">
                  {savingProject ? 'Saving...' : editingProjectId ? 'Update Project' : 'Add Project'}
                </button>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm(emptyProjectForm);
                    }}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-base font-bold text-slate-900">{proj.title}</h4>
                  {proj.featured && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <IconStar className="w-3.5 h-3.5 fill-current" />
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(proj.techStack || []).map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs gap-2">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <IconCheck className="w-3.5 h-3.5" />
                    Peer Reviewed & Verified
                  </span>
                  <div className="flex items-center gap-2">
                    {(proj.githubUrl || proj.demoUrl) && (
                      <a href={proj.githubUrl || proj.demoUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">
                        View →
                      </a>
                    )}
                    <button type="button" onClick={() => { setEditingProjectId(proj.id); setProjectForm({ project_name: proj.title || proj.project_name || '', description: proj.description || '', technologies_used: (proj.techStack || []).join(', '), github_url: proj.githubUrl || '', demo_url: proj.demoUrl || '', is_featured: Boolean(proj.featured) }); }} className="text-blue-700 font-bold">Edit</button>
                    <button type="button" onClick={() => handleDeleteProject(proj.id)} className="text-rose-600 font-bold">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Certifications & Education Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certifications */}
          <Card title="Certifications" subtitle="Add certificates and track verification status">
            <form onSubmit={handleCertificateSubmit} className="mb-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={certificateForm.certificate_name}
                  onChange={(e) => setCertificateForm((prev) => ({ ...prev, certificate_name: e.target.value }))}
                  placeholder="Certificate name"
                  className="px-3 py-2 rounded-xl border border-slate-300"
                />
                <input
                  type="text"
                  value={certificateForm.issuing_organization}
                  onChange={(e) => setCertificateForm((prev) => ({ ...prev, issuing_organization: e.target.value }))}
                  placeholder="Issuing organization"
                  className="px-3 py-2 rounded-xl border border-slate-300"
                />
                <input
                  type="date"
                  value={certificateForm.issue_date}
                  onChange={(e) => setCertificateForm((prev) => ({ ...prev, issue_date: e.target.value }))}
                  className="px-3 py-2 rounded-xl border border-slate-300"
                />
                <input
                  type="date"
                  value={certificateForm.expiry_date}
                  onChange={(e) => setCertificateForm((prev) => ({ ...prev, expiry_date: e.target.value }))}
                  className="px-3 py-2 rounded-xl border border-slate-300"
                />
                <input
                  type="text"
                  value={certificateForm.credential_id}
                  onChange={(e) => setCertificateForm((prev) => ({ ...prev, credential_id: e.target.value }))}
                  placeholder="Credential ID (optional)"
                  className="px-3 py-2 rounded-xl border border-slate-300"
                />
                <input
                  type="url"
                  value={certificateForm.credential_url}
                  onChange={(e) => setCertificateForm((prev) => ({ ...prev, credential_url: e.target.value }))}
                  placeholder="Credential URL (optional)"
                  className="px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    setCertificateForm((prev) => ({ ...prev, certificate_file_name: file ? file.name : '' }));
                  }}
                  className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-blue-700"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <button type="submit" disabled={savingCertificate} className="rounded-xl bg-blue-600 text-white px-4 py-2 text-xs font-bold disabled:opacity-60">
                  {savingCertificate ? 'Saving...' : editingCertificateId ? 'Update Certificate' : 'Add Certificate'}
                </button>
                {editingCertificateId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCertificateId(null);
                      setCertificateForm(emptyCertificateForm);
                    }}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="space-y-3">
              {credentials.map((cred) => (
                <div key={cred.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-xs font-bold text-slate-900">{cred.name}</h5>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cred.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : cred.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                      {cred.status || 'Pending Verification'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{cred.issuer} • {cred.date}</p>
                  {cred.credentialId && <p className="text-[10px] text-slate-500">Credential ID: {cred.credentialId}</p>}
                  {cred.credentialUrl && (
                    <a href={cred.credentialUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-bold hover:underline">
                      View credential →
                    </a>
                  )}
                  {cred.certificateFileName && <p className="text-[10px] text-slate-500">File: {cred.certificateFileName}</p>}
                  {cred.rejectionReason && <p className="text-[10px] text-rose-700">Reason: {cred.rejectionReason}</p>}
                  <div className="flex items-center gap-2 pt-1">
                    <button type="button" onClick={() => { setEditingCertificateId(cred.id); setCertificateForm({ certificate_name: cred.name || '', issuing_organization: cred.issuer || '', issue_date: cred.date || '', expiry_date: cred.expiryDate || '', credential_id: cred.credentialId || '', credential_url: cred.credentialUrl || '', certificate_file_name: cred.certificateFileName || '' }); }} className="text-[10px] font-bold text-blue-700">Edit</button>
                    <button type="button" onClick={() => handleDeleteCertificate(cred.id)} className="text-[10px] font-bold text-rose-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Education & Academic Record */}
          <Card title="Education & Academic Standing" subtitle="NIRF Accredited University">
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-blue-950">{profile.degree}</h4>
                  <span className="font-bold text-blue-700">Class of {profile.gradYear}</span>
                </div>
                <p className="text-blue-900 font-semibold">{profile.institution}</p>
                <div className="pt-2 border-t border-blue-200/60 flex justify-between">
                  <span className="text-slate-600">Cumulative GPA:</span>
                  <span className="font-bold text-emerald-700">{profile.cgpa}</span>
                </div>
              </div>

              <div className="space-y-2 text-slate-600">
                <p className="font-bold text-slate-800">Core Academic Coursework:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Data Structures & Algorithms', 'Database Systems', 'Object Oriented Java', 'Web Technologies', 'Software Engineering'].map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
