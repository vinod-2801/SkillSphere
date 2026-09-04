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

export default function Portfolio() {
  const [profile, setProfile] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900">{proj.title}</h4>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <IconStar className="w-3.5 h-3.5 fill-current" />
                    {proj.stars} Stars
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.techStack.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <IconCheck className="w-3.5 h-3.5" />
                    Peer Reviewed & Verified
                  </span>
                  <a href={proj.link} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">
                    View Code →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Certifications & Education Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certifications */}
          <Card title="Verified Micro-Credentials" subtitle="NPTEL, Oracle, Meta Certifications">
            <div className="space-y-3">
              {credentials.map((cred) => (
                <div key={cred.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900">{cred.name}</h5>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {cred.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{cred.issuer} • {cred.date}</p>
                  <p className="text-[10px] font-mono text-slate-400">Hash: {cred.verificationHash}</p>
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
