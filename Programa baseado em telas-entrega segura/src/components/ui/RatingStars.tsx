import { useId, useState } from 'react';

export interface RatingStarsProps {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  count?: number;
  showValue?: boolean;
  label?: string;
}

function Star({ fill, size, uid }: { fill: number; size: number; uid: string }) {
  const clipId = `star-clip-${uid}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false">
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={24 * fill} height="24" />
        </clipPath>
      </defs>
      <path
        d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.3l6.6-.9L12 2.5z"
        fill="#E5E7EB"
      />
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.3l6.6-.9L12 2.5z"
          fill="#F59E0B"
        />
      </g>
    </svg>
  );
}

export function RatingStars({
  value,
  onChange,
  size = 16,
  count,
  showValue = true,
  label = 'Avaliação',
}: RatingStarsProps) {
  const [hover, setHover] = useState(0);
  const uid = useId().replace(/:/g, '');
  const interactive = typeof onChange === 'function';
  const shown = interactive && hover > 0 ? hover : value;

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="flex items-center gap-0.5"
        role={interactive ? 'radiogroup' : undefined}
        aria-label={interactive ? label : undefined}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, shown - (i - 1)));
          if (!interactive) return <Star key={i} fill={fill} size={size} uid={`${uid}-${i}`} />;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={Math.round(value) === i}
              aria-label={`${i} ${i === 1 ? 'estrela' : 'estrelas'}`}
              onMouseEnter={() => setHover(i)}
              onClick={() => onChange?.(i)}
              className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Star fill={fill} size={size} uid={`${uid}-${i}`} />
            </button>
          );
        })}
      </div>
      {showValue && !interactive && (
        <span className="text-sm text-gray-600">
          {value > 0 ? value.toFixed(1) : 'Novo'}
          {typeof count === 'number' && count > 0 && (
            <span className="text-gray-400"> ({count})</span>
          )}
        </span>
      )}
    </div>
  );
}
