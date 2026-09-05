import React from 'react';
import { Lightbulb, ArrowRight, BookOpen, Compass, CheckCircle2 } from 'lucide-react';

export default function ExplainableMatchCard({ matchData, jobTitle }) {
  const matchScore = matchData?.matchScore ?? 50;
  const matchedSkills = matchData?.matchedSkills ?? [];
  const missingSkills = matchData?.missingSkills ?? [];
  const recommendations = matchData?.recommendations ?? [];
  const explanation = matchData?.explanation ?? 'The student matches core requirements but needs further alignment on missing tools.';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Explainable AI Job Match
          </h3>
          <p className="text-xs text-slate-500">Transparent rationale and guided learning pathways for {jobTitle || 'Target Role'}.</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-semibold flex items-center gap-1">
          <Compass className="w-3.5 h-3.5" /> Explainable AI
        </span>
      </div>

      {/* Dynamic Natural Language Explanation */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50/70 via-slate-50 to-white border border-indigo-100">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
          Match Explanation & Reasoning
        </span>
        <p className="text-sm font-medium text-slate-800 leading-relaxed">
          {explanation}
        </p>
      </div>

      {/* Concrete Actionable Recommendations */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          Recommended Next Steps ({recommendations.length})
        </h4>

        {recommendations.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No additional learning recommendations needed for this profile.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition-all text-xs font-medium text-slate-800 shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <span>{rec}</span>
                </span>
                <span className="text-[10px] bg-indigo-100/60 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                  Course Available
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
