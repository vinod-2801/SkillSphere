export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-2xs';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 text-white hover:opacity-95 hover:shadow-blue-500/20 hover:shadow-md focus:ring-blue-500',
    secondary: 'bg-cyan-50 text-cyan-900 hover:bg-cyan-100/80 border border-cyan-200/80 focus:ring-cyan-500',
    outline: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 focus:ring-blue-500',
    dark: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    text: 'bg-transparent text-slate-600 hover:text-blue-600 hover:bg-slate-100/50 shadow-none focus:ring-blue-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5 font-bold',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}
