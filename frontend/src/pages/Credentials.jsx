import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { IconAward, IconShieldCheck, IconCheckCircle } from '../components/Icons';

export default function Credentials() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadCreds() {
      const data = await api.getCredentials();
      setCredentials(data);
      setLoading(false);
    }
    loadCreds();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <IconAward className="w-7 h-7 text-blue-600" />
              Verified Digital Credentials
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Cryptographically timestamped academic micro-credentials, course certificates, and industry skill badges
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <IconShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{credentials.length} Credentials Verified</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading credentials...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {credentials.map((cred) => (
              <Card key={cred.id} padding="p-6" className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
                      <IconAward className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{cred.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{cred.issuer}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                    <IconCheckCircle className="w-3.5 h-3.5" />
                    <span>{cred.status}</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Skill Domain</span>
                    <span className="font-bold text-blue-600">{cred.skill}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issue Date</span>
                    <span className="font-semibold text-slate-800">{cred.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Credential ID</span>
                    <span className="font-mono text-slate-700">{cred.credentialId}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 font-mono flex justify-between">
                    <span>Validation Hash</span>
                    <span>{cred.verificationHash}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Public Verifiable Certificate</span>
                  <button
                    onClick={() => alert(`Certificate ${cred.credentialId} verified via SkillSphere Platform Ledger`)}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Verify Certificate →
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
