interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

function base({ size = 22, className = '', strokeWidth = 2 }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
    focusable: false,
  };
}

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 12l9-9 9 9M4 11v9a1 1 0 001 1h5v-5h4v5h5a1 1 0 001-1v-9" />
  </svg>
);

export const ChartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

export const BoxIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8" />
  </svg>
);

export const ReceiptIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 2h12a1 1 0 011 1v18l-3-2-3 2-3-2-3 2V3a1 1 0 011-1z" />
    <path d="M9 7h6M9 11h6M9 15h4" />
  </svg>
);

export const UserIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

export const CartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export const BellIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
    <path d="M13.7 21a2 2 0 01-3.4 0" />
  </svg>
);

export const BackIcon = (p: IconProps) => (
  <svg {...base({ strokeWidth: 2.5, ...p })}>
    <path d="M15 19l-7-7 7-7" />
  </svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base({ strokeWidth: 2, ...p })}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base({ strokeWidth: 2.5, ...p })}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base({ strokeWidth: 2.5, ...p })}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base({ strokeWidth: 2.5, ...p })}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: IconProps) => (
  <svg {...base({ strokeWidth: 2.5, ...p })}>
    <path d="M5 12h14" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const EditIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3l8 3v6c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V6l8-3z" />
  </svg>
);

export const StoreIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 9l1.5-5h15L21 9M3 9h18M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0" />
  </svg>
);

export const LockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 118 0v3" />
  </svg>
);

export const LogoutIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const RulesIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 3h10a2 2 0 012 2v16l-7-3-7 3V5a2 2 0 012-2z" />
  </svg>
);

export const CashIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const TruckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 16V6a1 1 0 011-1h10v11H3zM14 9h4l3 3v4h-7V9z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export const BuildingIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 21V5a2 2 0 012-2h7a2 2 0 012 2v16M15 9h3a2 2 0 012 2v10M8 7h3M8 11h3M8 15h3M2 21h20" />
  </svg>
);

export const SparkIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </svg>
);
