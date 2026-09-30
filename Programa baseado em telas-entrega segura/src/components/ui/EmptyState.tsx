import type { ReactNode } from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        {icon ?? (
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M8 13h8M9 9h.01M15 9h.01" />
          </svg>
        )}
      </div>
      <p className="text-base font-bold text-gray-900">{title}</p>
      {subtitle && <p className="max-w-[280px] text-sm text-gray-500">{subtitle}</p>}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
