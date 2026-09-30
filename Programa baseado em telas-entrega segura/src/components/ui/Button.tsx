import type { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  'aria-label'?: string;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:bg-[#1E40AF]',
  secondary: 'border border-gray-200 text-gray-700 bg-white hover:bg-gray-50',
  ghost: 'text-[#2563EB] bg-transparent hover:bg-blue-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-[44px] px-4 text-sm',
  md: 'min-h-[48px] px-5 text-[15px]',
  lg: 'min-h-[52px] px-6 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        loading ? 'pointer-events-none' : 'active:scale-[0.98]',
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && <LoadingSpinner size={18} />}
      {children}
    </button>
  );
}
