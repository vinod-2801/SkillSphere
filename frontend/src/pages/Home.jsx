import { Link } from 'react-router-dom';
import Button from '../components/Button';
import {
  IconLogo,
  IconShieldCheck,
  IconGraduationCap,
  IconBuilding,
  IconBookOpen,
  IconAward,
  IconCheck,
  IconArrowRight,
  IconSparkles,
  IconBarChart,
  IconBriefcase,
  IconTrendingUp,
  IconCheckCircle
} from '../components/Icons';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-blue-50/70 via-slate-50 to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide">
                <IconLogo className="w-4 h-4" />
                <span>Academia–Industry Collaboration Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                One Ecosystem.{' '}
                <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Smarter Skills.
                </span>{' '}
                Stronger Careers.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Connect skills, opportunities and collaboration through one intelligent platform.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" fullWidth className="gap-2">
                    <span>Get Started</span>
                    <IconArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/opportunities" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" fullWidth>
                    Explore Opportunities
                  </Button>
                </Link>
              </div>

              {/* Key Trust Checkmarks */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <IconCheck className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  Verified Skill Credentials
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCheck className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  Explainable AI Match
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCheck className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  Direct Recruiter Flow
                </span>
              </div>
            </div>

            {/* Right Product Illustration Column */}
            <div className="lg:col-span-5 relative">
              {/* Outer Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-cyan-400/20 to-transparent rounded-3xl blur-2xl pointer-events-none" />

              {/* Product Card Graphic Mockup */}
              <div className="relative bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-800 space-y-5 overflow-hidden">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
                      AR
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Candidate Digital Twin</h4>
                      <p className="text-[11px] text-cyan-400 font-medium">Verified Profile • NIT Campus</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 flex items-center gap-1">
                    <IconShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>

                {/* Network Node Skill Diagram */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Skill Network Mapping</span>
                    <span className="text-cyan-400 font-bold">82 / 100 Index</span>
                  </div>

                  {/* Connected Graph Visualization */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-900 border border-blue-500/40 text-blue-300 font-bold">
                      Python ✓
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold">
                      React ✓
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold">
                      Node.js ○
                    </div>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full w-[82%]" />
                  </div>
                </div>

                {/* AI Match Card Preview */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/90 to-slate-900 border border-blue-500/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">Recommended Opportunity</span>
                    <h5 className="text-xs font-bold text-white mt-0.5">Software Developer Intern</h5>
                    <p className="text-[11px] text-slate-400">TechNova Solutions • Remote</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-400/30 block">
                      89% Match
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Metrics Section */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Verified Skills', val: 'Enterprise Verified', icon: IconShieldCheck },
              { label: 'Matched Opportunities', val: 'AI Compatible', icon: IconBriefcase },
              { label: 'Industry Connections', val: 'Quad-Ecosystem', icon: IconBuilding },
              { label: 'Career Growth', val: 'Continuous Tracking', icon: IconTrendingUp },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-center space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-lg font-black text-slate-900">{stat.val}</p>
                  <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">Enterprise Capabilities</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Everything You Need to Build a Stronger Career</p>
            <p className="text-slate-600 mt-3 text-sm">
              Integrated skill mapping, employability intelligence, and verifiable credentials for academia and hiring partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: IconCheckCircle,
                title: 'Skill Verification',
                desc: 'Validate practical skills through real-world challenges, academic course outcomes, and verified micro-credentials.',
              },
              {
                icon: IconBarChart,
                title: 'Employability Digital Twin',
                desc: 'Track your employability score (0-100) and simulate future skill growth needed for target role advancement.',
              },
              {
                icon: IconSparkles,
                title: 'Explainable AI Matching',
                desc: 'Understand exactly why an opportunity matches your skills with itemized matched (✓) and missing (○) skill matrices.',
              },
              {
                icon: IconAward,
                title: 'Verified Digital Portfolio',
                desc: 'Showcase credentials, project code links, and academic achievements that can be trusted by industry recruiters.',
              },
              {
                icon: IconBuilding,
                title: 'Academia–Industry Collaboration',
                desc: 'Connect with research grants, FDPs, mentorship tracks, and direct hiring opportunities.',
              },
            ].map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div key={index} className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-5 shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">Simple 4-Step Process</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">How SkillSphere Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Build Your Profile', desc: 'Create your digital profile and upload your resume to auto-extract core skills and coursework.' },
              { step: '02', title: 'Verify Your Skills', desc: 'Validate proficiencies via course credentials, verified projects, and skill assessments.' },
              { step: '03', title: 'Discover Smart Matches', desc: 'Browse AI-ranked internships, jobs, research tracks, and FDPs tailored to your profile.' },
              { step: '04', title: 'Apply & Grow', desc: 'Submit one-click applications with verifiable credentials and track your career growth.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3 relative">
                <span className="text-3xl font-black text-blue-600/30 block">{item.step}</span>
                <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholder Ecosystem Section */}
      <section id="ecosystem" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 mb-2">Connected Quad-Ecosystem</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">Four Stakeholders. One Unified Platform.</p>
            <p className="text-slate-400 mt-3 text-sm">
              SkillSphere sits at the center of academic institutions, students, industry partners, and academicians.
            </p>
          </div>

          {/* Central Hub Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                role: 'Students',
                icon: IconGraduationCap,
                desc: 'Upload resume, receive automated skill gap analysis, build verifiable portfolios, and match with top internships.',
              },
              {
                role: 'Industry Partners',
                icon: IconBuilding,
                desc: 'Post targeted internships, jobs, and project grants filtered by verified skill proficiencies.',
              },
              {
                role: 'Academia & Faculty',
                icon: IconBookOpen,
                desc: 'Map course outcomes against live industry job specs, create FDP modules, and mentor candidates.',
              },
              {
                role: 'Institutions',
                icon: IconAward,
                desc: 'Track aggregate institutional employability metrics, outcome-based education compliance, and placements.',
              },
            ].map((stk, index) => {
              const Icon = stk.icon;
              return (
                <div key={index} className="bg-slate-800/90 border border-slate-700/80 p-6 rounded-2xl space-y-4 hover:border-cyan-400/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{stk.role}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{stk.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to Transform Your Career Intelligence?</h2>
          <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto">
            Join candidates, faculty members, and hiring managers collaborating on SkillSphere.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="primary" className="shadow-lg shadow-blue-500/25">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white/10 border-white/30">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IconLogo className="w-7 h-7" />
                <span className="text-base font-bold text-white tracking-tight">SkillSphere</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                One Ecosystem. Smarter Skills. Stronger Careers. Academia–Industry Collaboration Platform.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Platform</h5>
              <ul className="space-y-2">
                <li><Link to="/opportunities" className="hover:text-white">Opportunities Hub</Link></li>
                <li><Link to="/resume" className="hover:text-white">Resume Analyzer</Link></li>
                <li><Link to="/credentials" className="hover:text-white">Digital Credentials</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Ecosystem</h5>
              <ul className="space-y-2">
                <li><a href="#ecosystem" className="hover:text-white">For Students</a></li>
                <li><a href="#ecosystem" className="hover:text-white">For Industry</a></li>
                <li><a href="#ecosystem" className="hover:text-white">For Academia & Colleges</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Product Info</h5>
              <p className="text-slate-500">Built with React, Vite, & Tailwind CSS.</p>
              <p className="text-slate-500 mt-2">© 2026 SkillSphere Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
