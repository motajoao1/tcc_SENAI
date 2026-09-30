export interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = 20, className = '', label }: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin"
        aria-hidden
        focusable="false"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.2" />
        <path
          d="M21 12a9 9 0 00-9-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {label ? <span className="text-sm">{label}</span> : <span className="sr-only">Carregando</span>}
    </span>
  );
}
