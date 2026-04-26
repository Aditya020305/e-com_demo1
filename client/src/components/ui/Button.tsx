import React from 'react';

/* ── Types ── */
type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

/* ── Spinner ── */
const Spinner: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/* ── Variant Styles (existing project colors — unchanged) ── */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary-500 to-primary-600 text-neutral-900 shadow-gold hover:from-primary-400 hover:to-primary-500 hover:shadow-gold-lg focus:ring-primary-400/50 disabled:from-neutral-700 disabled:to-neutral-700 disabled:text-neutral-500 disabled:shadow-none',
  secondary:
    'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:ring-indigo-400/50',
  outline:
    'bg-neutral-800 text-neutral-100 border border-neutral-600 hover:bg-neutral-700 hover:border-neutral-500 focus:ring-primary-500/40',
};

/* ── Size Styles ── */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2',
};

/* ── Spinner Sizes ── */
const spinnerSizes: Record<ButtonSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

/* ========================================
   Button Component
   ======================================== */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={[
        /* Base */
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900',
        /* Interaction */
        'hover:scale-[1.02]',
        'active:scale-[0.98]',
        /* Disabled */
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100',
        /* Variant */
        variantStyles[variant],
        /* Size */
        sizeStyles[size],
        /* Width */
        fullWidth ? 'w-full' : '',
        /* Custom */
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading && <Spinner className={spinnerSizes[size]} />}
      {children}
    </button>
  );
};

export default Button;
