'use client';

import { LeadTier } from '@/types/demo';

interface StatusBadgeProps {
  tier: LeadTier;
  score?: number;
}

const TIER_CONFIG: Record<
  LeadTier,
  { label: string; classes: string; dot: string }
> = {
  hot: {
    label: 'Hot Lead 🔥',
    classes: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
  warm: {
    label: 'Warm Lead',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  cold: {
    label: 'Cold Lead',
    classes: 'bg-slate-100 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
  },
};

export default function StatusBadge({ tier, score }: StatusBadgeProps) {
  const config = TIER_CONFIG[tier];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
      {score !== undefined && (
        <span className="opacity-60 font-normal ml-0.5">({score})</span>
      )}
    </span>
  );
}
