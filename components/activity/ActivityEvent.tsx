'use client';

import { SystemEvent, SystemEventType } from '@/types/demo';
import { formatRelativeTime } from '@/lib/helpers';

interface ActivityEventProps {
  event: SystemEvent;
  isNew?: boolean;
}

type EventConfig = {
  icon: string;
  color: string;
  dot: string;
};

const EVENT_CONFIG: Record<SystemEventType, EventConfig> = {
  intent_detected:    { icon: '🎯', color: 'text-blue-700',    dot: 'bg-blue-500' },
  lead_updated:       { icon: '✏️', color: 'text-slate-700',   dot: 'bg-slate-400' },
  property_search_started:   { icon: '🔍', color: 'text-violet-700', dot: 'bg-violet-500' },
  property_search_completed: { icon: '✅', color: 'text-emerald-700', dot: 'bg-emerald-500' },
  lead_saved:         { icon: '💾', color: 'text-emerald-700', dot: 'bg-emerald-500' },
  hot_lead_notification: { icon: '🔥', color: 'text-red-700', dot: 'bg-red-500' },
  human_handoff_requested: { icon: '👤', color: 'text-amber-700', dot: 'bg-amber-500' },
  claude_response:    { icon: '💬', color: 'text-blue-600',    dot: 'bg-blue-400' },
  error:              { icon: '⚠️', color: 'text-red-600',     dot: 'bg-red-400' },
  session_started:    { icon: '🚀', color: 'text-slate-600',   dot: 'bg-slate-400' },
  viewing_requested:  { icon: '📅', color: 'text-amber-700',    dot: 'bg-amber-500' },
  contact_captured:   { icon: '👤', color: 'text-indigo-700',   dot: 'bg-indigo-500' },
  sales_alert_sent:   { icon: '🔥', color: 'text-rose-700',     dot: 'bg-rose-500' },
};

export default function ActivityEvent({ event, isNew }: ActivityEventProps) {
  const config = EVENT_CONFIG[event.type] ?? {
    icon: '•',
    color: 'text-slate-600',
    dot: 'bg-slate-400',
  };

  return (
    <div className={`flex items-start gap-2.5 py-2 border-b border-slate-50 last:border-0 ${isNew ? 'event-enter' : ''}`}>
      {/* Dot indicator */}
      <div className="mt-1.5 flex-shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full block ${config.dot}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium leading-snug ${config.color}`}>
          <span className="mr-1">{config.icon}</span>
          {event.label}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {formatRelativeTime(event.timestamp)}
        </p>
      </div>
    </div>
  );
}
