import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import SkillBadge from '../components/SkillBadge';
import { IconUser } from '../components/Icons';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadProf() {
      const data = await api.getProfile();
      setProfile(data);
      setFormData(data);
    }
    loadProf();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await api.updateProfile(formData);
    if (res.success) {
      setProfile(res.profile);
      setIsEditing(false);
    }
    setSaving(false);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconUser className="w-7 h-7 text-blue-600" />
              Candidate Profile & Preferences
            </h1>
            <p className="text-xs text-slate-500 mt-1">Manage personal details, target roles, and location preferences</p>
          </div>

          <Button
            size="sm"
            variant={isEditing ? 'secondary' : 'primary'}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            loading={saving}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Personal & Academic Profile (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <Card title="Personal Information" subtitle="Contact & identity details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-bold text-slate-900 text-sm">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-bold text-slate-900 text-sm">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Ecosystem Role</label>
                  <p className="font-bold text-blue-700 text-sm">{profile.role}</p>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-bold text-slate-900 text-sm">{profile.location}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 text-xs">
                <label className="block text-slate-500 font-medium mb-1">Professional Bio</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
                )}
              </div>
            </Card>

            {/* Education Card */}
            <Card title="Education & Academic Standing" subtitle="Verified institutional record">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Institution</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  ) : (
                    <p className="font-bold text-slate-900">{profile.institution}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Degree Program</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  ) : (
                    <p className="font-bold text-slate-900">{profile.degree}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Graduation Year</label>
                  <p className="font-bold text-slate-900">{profile.gradYear}</p>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Cumulative CGPA</label>
                  <p className="font-bold text-emerald-700">{profile.cgpa}</p>
                </div>
              </div>
            </Card>

            {/* Skills Overview */}
            <Card title="Skills Portfolio" subtitle="Extracted and verified skills">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s, idx) => (
                  <SkillBadge key={idx} name={s.name} verified={s.verified} level={s.level} />
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Career Preferences */}
          <div className="space-y-6">
            <Card title="Career Interests & Preferences" subtitle="Target role configuration">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Preferred Job Type</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="preferredType"
                      value={formData.preferredType || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold inline-block">
                      {profile.preferredType}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Preferred Work Mode / Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="preferredLocation"
                      value={formData.preferredLocation || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-bold inline-block">
                      {profile.preferredLocation}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="block text-slate-500 font-bold">Target Domains</label>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.careerInterests.map((interest, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
