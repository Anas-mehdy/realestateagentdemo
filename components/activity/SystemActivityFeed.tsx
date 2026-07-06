'use client';

import { SystemEvent } from '@/types/demo';
import ActivityEvent from './ActivityEvent';

interface SystemActivityFeedProps {
  events: SystemEvent[];
}

export default function SystemActivityFeed({ events }: SystemActivityFeedProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {events.length > 0 && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${events.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          </span>
          System Activity
        </h3>
        {events.length > 0 && (
          <span className="text-xs text-slate-400">{events.length} event{events.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="py-4 text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          </div>
          <p className="text-xs text-slate-400">Workflow events will appear here in real time</p>
        </div>
      )}

      {/* Events list — newest first */}
      {events.length > 0 && (
        <div className="overflow-y-auto max-h-48 space-y-0">
          {events.map((event, index) => (
            <ActivityEvent key={event.id} event={event} isNew={index === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
