import { Link } from 'react-router-dom';
import { api } from '../services/api';
import SkillBadge from './SkillBadge';
import Button from './Button';
import { IconMapPin, IconBuilding, IconSparkles, IconChevronRight, IconFileText } from './Icons';

export default function OpportunityCard({ opportunity }) {
  const currentUser = api.getCurrentUser();
  const isStudent = currentUser.role === 'Student';
  const hasUserData = api.hasUserData();

  const {
    id,
    title,
    company,
    logo = 'OP',
    location,
    type,
    stipend,
    duration,
    matchPercentage,
    requiredSkills = [],
    matchedSkills = [],
  } = opportunity;

  let matchBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  if (matchPercentage >= 90) {
    matchBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (matchPercentage >= 80) {
    matchBadgeColor = 'bg-cyan-50 text-cyan-800 border-cyan-200';
  } else if (matchPercentage < 70) {
    matchBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center font-bold text-blue-700 text-base shadow-2xs group-hover:scale-105 transition-transform duration-200">
              {logo}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 font-medium">
                  <IconBuilding className="w-3.5 h-3.5 text-slate-400" />
                  {company}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <IconMapPin className="w-3.5 h-3.5 text-slate-400" />
                  {location}
                </span>
              </div>
            </div>
          </div>

          {/* AI Match Badge or Upload Resume / Complete Profile */}
          {hasUserData ? (
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl border text-xs font-bold ${matchBadgeColor}`}>
              <IconSparkles className="w-3.5 h-3.5" />
              <span>{matchPercentage}% Match</span>
            </div>
          ) : isStudent ? (
            <Link to="/resume" className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors">
              <IconFileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Upload Resume</span>
            </Link>
          ) : (
            <Link to="/profile" className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors">
              <span>Complete Profile</span>
            </Link>
          )}
        </div>

        {/* Opportunity Metadata Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold">{type}</span>
          {stipend && <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold">{stipend}</span>}
          {duration && <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">{duration}</span>}
        </div>

        {/* Required Skills */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.map((skill) => {
              const isMatched = matchedSkills.includes(skill);
              return (
                <SkillBadge
                  key={skill}
                  name={skill}
                  verified={isMatched}
                  missing={!isMatched}
                  size="sm"
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer: Render Apply Now ONLY when current role is Student */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <Link to={`/match/${id}`} className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
          <span>View Details</span>
          <IconChevronRight className="w-3.5 h-3.5" />
        </Link>
        {isStudent && (
          <Link to={`/apply/${id}`}>
            <Button size="sm" variant="primary">
              Apply Now
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
