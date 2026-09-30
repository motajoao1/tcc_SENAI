import type { ReactNode } from 'react';
import { BackIcon } from '../ui/Icons';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';

export interface ShellProps {
  children: ReactNode;
  /** Render sidebar (desktop) and bottom tabs (mobile). */
  nav?: boolean;
  /** Background of the app surface. */
  bg?: 'gray' | 'white';
}

export function Shell({ children, nav = false, bg = 'gray' }: ShellProps) {
  return (
    <div className="flex h-dvh w-full justify-center bg-gray-200">
      <div
        className={`flex h-dvh w-full max-w-[430px] overflow-hidden md:max-w-[768px] lg:max-w-[1200px] lg:flex-row ${
          bg === 'white' ? 'bg-white' : 'bg-gray-50'
        }`}
      >
        {nav && <Sidebar />}
        <div className="flex h-dvh min-w-0 flex-1 flex-col">
          {children}
          {nav && <BottomNav />}
        </div>
      </div>
    </div>
  );
}

export function ScrollArea({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex-1 overflow-y-auto overscroll-contain ${className}`}>{children}</div>
  );
}

export interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
  sticky?: boolean;
}

export function PageHeader({
  title,
  eyebrow,
  subtitle,
  onBack,
  right,
  sticky = true,
}: PageHeaderProps) {
  return (
    <header
      className={`shrink-0 border-b border-gray-100 bg-white px-4 pb-4 md:px-6 ${
        sticky ? 'z-20' : ''
      }`}
      style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top, 0px))' }}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-3 -ml-2 inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm font-semibold text-[#2563EB] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <BackIcon size={16} />
          Voltar
        </button>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-[#2563EB]">
              {eyebrow}
            </p>
          )}
          <h1 className="text-[22px] font-bold leading-tight text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
      </div>
    </header>
  );
}
