import { IconSparkles, IconTrendingUp, IconAward } from './Icons';

export default function ScoreCard({
  score = 82,
  maxScore = 100,
  title = "Employability Score",
  subtitle = "Calculated via curriculum outcomes, verified project badges & industry demand match.",
  trend = "+4% this month",
}) {
  const percentage = Math.min(Math.max(score, 0), maxScore);
  const strokeDasharray = 251.2; // 2 * pi * 40
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-slate-800">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-cyan-300 text-xs font-semibold mb-3 border border-blue-400/20">
            <IconSparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Verified Employability Index</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-sm leading-relaxed">{subtitle}</p>

          <div className="mt-4 flex items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
              <IconTrendingUp className="w-3.5 h-3.5" />
              <span>{trend}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-300">
              <IconAward className="w-3.5 h-3.5" />
              <span>Tier 1 Enterprise Eligible</span>
            </div>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="48"
              className="text-slate-800"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="48"
              className="text-blue-500 transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="url(#gradientScoreSaaS)"
              fill="transparent"
            />
            <defs>
              <linearGradient id="gradientScoreSaaS" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center px-2">
            {typeof score === 'number' && score > 0 ? (
              <>
                <span className="text-3xl font-extrabold text-white tracking-tight">{score}</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">/ {maxScore}</span>
              </>
            ) : (
              <span className="text-xs font-bold text-amber-400 tracking-tight">{score || "Not available"}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
