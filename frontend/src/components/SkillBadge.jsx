import { IconCheck, IconAlertCircle } from './Icons';

export default function SkillBadge({
  name,
  verified = false,
  missing = false,
  level,
  size = 'md',
  className = '',
  onClick,
}) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 font-medium gap-1',
    md: 'text-xs px-3 py-1.5 font-medium gap-1.5',
    lg: 'text-sm px-3.5 py-2 font-medium gap-2',
  };

  let colorClasses = 'bg-blue-50 text-blue-700 border border-blue-200/60';
  
  if (missing) {
    colorClasses = 'bg-amber-50 text-amber-800 border border-amber-200/70';
  } else if (verified) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs';
  }

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-lg transition-all duration-150 ${sizeClasses[size]} ${colorClasses} ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      } ${className}`}
    >
      {verified && (
        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
          <IconCheck className="w-2.5 h-2.5 stroke-[3]" />
        </span>
      )}
      {missing && (
        <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center">
          <IconAlertCircle className="w-2.5 h-2.5 stroke-[2.5]" />
        </span>
      )}
      <span>{name}</span>
      {level && <span className="text-[10px] opacity-75 font-semibold uppercase tracking-wider">({level})</span>}
    </span>
  );
}
