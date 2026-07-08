'use client';

import { Lead, LeadCapture, SystemEvent } from '@/types/demo';
import LeadPreview from '@/components/lead/LeadPreview';
import SystemActivityFeed from '@/components/activity/SystemActivityFeed';

interface RightPanelProps {
  lead: Lead;
  leadCapture: LeadCapture;
  systemEvents: SystemEvent[];
}

export default function RightPanel({ lead, leadCapture, systemEvents }: RightPanelProps) {
  return (
    <aside className="flex flex-col gap-4 h-full overflow-y-auto">
      {/* Lead Preview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
        <LeadPreview lead={lead} leadCapture={leadCapture} />
      </div>

      {/* System Activity Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex-1">
        <SystemActivityFeed events={systemEvents} />
      </div>

      {/* Info note */}
      <div className="hidden text-xs text-slate-400 text-center leading-relaxed px-1 xl:block">
        This panel updates in real time as Sofia processes the conversation through the n8n workflow.
      </div>
    </aside>
  );
}
