export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  headerBorder = true,
  footer,
  hoverable = false,
  padding = 'p-6',
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-200 ${
        hoverable ? 'hover:shadow-md hover:border-slate-300' : ''
      } ${className}`}
    >
      {(title || subtitle || action) && (
        <div className={`flex items-center justify-between px-6 py-4 ${headerBorder ? 'border-b border-slate-100' : ''}`}>
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900 leading-6">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={padding}>{children}</div>
      {footer && <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 rounded-b-2xl">{footer}</div>}
    </div>
  );
}
