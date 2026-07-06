'use client';

import { Lead, LeadCapture } from '@/types/demo';
import { formatCurrency } from '@/lib/helpers';
import StatusBadge from '@/components/ui/StatusBadge';

interface LeadPreviewProps {
  lead: Lead;
  leadCapture: LeadCapture;
}

interface FieldProps {
  label: string;
  value: string | number | null | undefined;
  highlight?: boolean;
}

function Field({ label, value, highlight }: FieldProps) {
  const display = value !== null && value !== undefined && value !== '' ? String(value) : null;

  return (
    <div className={`flex items-center justify-between py-2 border-b border-slate-50 last:border-0 ${highlight ? 'bg-blue-50 px-1 rounded -mx-1 animate-pulse' : ''}`}>
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      {display ? (
        <span className="text-xs font-semibold text-slate-800 text-right max-w-[55%] truncate">
          {display}
        </span>
      ) : (
        <span className="text-xs text-slate-300 italic">Not collected yet</span>
      )}
    </div>
  );
}

const INTENT_LABELS: Record<string, string> = {
  buy: '🏠 Buy',
  rent: '🔑 Rent',
  sell: '🏷️ Sell',
  invest: '📈 Invest',
};

const ACTION_LABELS: Record<string, string> = {
  more_details: '📄 More details',
  schedule_viewing: '📅 Schedule viewing',
  speak_to_agent: '👤 Speak to agent',
  valuation_request: '🏷️ Valuation request',
  general_question: '❓ General question',
};

const CAPTURE_STATUS_CFG: Record<string, { label: string; style: string }> = {
  not_started: { label: 'Not started', style: 'bg-slate-50 text-slate-500 border border-slate-200' },
  waiting_for_contact: { label: 'Waiting for contact', style: 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' },
  waiting_for_time: { label: 'Waiting for time', style: 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' },
  contact_captured: { label: 'Contact captured', style: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
  saved: { label: 'Saved to Sheets', style: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold' },
  notified: { label: 'Sales Alert Sent', style: 'bg-rose-50 text-rose-700 border border-rose-200 font-bold' },
};

export default function LeadPreview({ lead, leadCapture }: LeadPreviewProps) {
  const hasLeadData = lead.intent || lead.city || lead.budget || lead.bedrooms;
  const hasCaptureData = leadCapture.name || leadCapture.phone || leadCapture.email || leadCapture.requested_action;

  const capCfg = CAPTURE_STATUS_CFG[leadCapture.capture_status] || {
    label: leadCapture.capture_status,
    style: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          Lead Qualification
        </h3>
        <StatusBadge tier={lead.lead_tier} score={lead.lead_score} />
      </div>

      {/* Lead Score */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500 font-medium">Qualification Score</span>
          <span className="text-xs font-bold text-slate-800">{lead.lead_score} / 100</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full score-bar-fill transition-all duration-500 ${
              lead.lead_tier === 'hot'
                ? 'bg-gradient-to-r from-orange-400 to-red-500'
                : lead.lead_tier === 'warm'
                ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                : 'bg-gradient-to-r from-slate-300 to-slate-400'
            }`}
            style={{ width: `${lead.lead_score}%` }}
          />
        </div>
      </div>

      {/* ── SECTION 1: SEARCH CRITERIA ── */}
      <div className="border-t border-slate-100 pt-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Qualifications
        </h4>
        {!hasLeadData ? (
          <p className="text-xs text-slate-400 italic py-1">No qualifications detected yet.</p>
        ) : (
          <div className="space-y-0">
            <Field
              label="Intent"
              value={lead.intent ? INTENT_LABELS[lead.intent] : null}
            />
            <Field label="City" value={lead.city} />
            <Field
              label="Budget"
              value={lead.budget ? formatCurrency(lead.budget) : null}
            />
            <Field
              label="Bedrooms"
              value={lead.bedrooms !== null ? `${lead.bedrooms} bedroom${lead.bedrooms !== 1 ? 's' : ''}` : null}
            />
            <Field label="Timeline" value={lead.timeline} />
          </div>
        )}
      </div>

      {/* ── SECTION 2: LEAD CAPTURE ── */}
      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Lead Capture Status
          </h4>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${capCfg.style}`}>
            {capCfg.label}
          </span>
        </div>

        {!hasCaptureData ? (
          <p className="text-xs text-slate-400 italic py-1">No contact info captured yet.</p>
        ) : (
          <div className="space-y-0">
            <Field label="Name" value={leadCapture.name} highlight={!!leadCapture.name} />
            <Field label="Phone" value={leadCapture.phone} highlight={!!leadCapture.phone} />
            <Field label="Email" value={leadCapture.email} highlight={!!leadCapture.email} />
            <Field
              label="Requested Action"
              value={leadCapture.requested_action ? ACTION_LABELS[leadCapture.requested_action] : null}
            />
            <Field
              label="Selected Property"
              value={
                leadCapture.selected_property_id
                  ? `${leadCapture.selected_property_id} · ${leadCapture.selected_property_title}`
                  : null
              }
            />
            <Field label="Preferred Time" value={leadCapture.preferred_date_time} />
          </div>
        )}
      </div>

      {/* Tier explanation / notification status */}
      <div className={`text-xs rounded-lg px-3 py-2 text-center ${
        lead.lead_tier === 'hot'
          ? 'bg-red-50 text-red-700 border border-red-100'
          : lead.lead_tier === 'warm'
          ? 'bg-amber-50 text-amber-700 border border-amber-100'
          : 'bg-slate-50 text-slate-500 border border-slate-100'
      }`}>
        {leadCapture.capture_status === 'notified' && '🔥 Hot lead — Telegram sales alert sent!'}
        {leadCapture.capture_status === 'saved' && '💾 Lead saved to Google Sheets leads database.'}
        {leadCapture.capture_status === 'contact_captured' && '✅ Contact details validated.'}
        {leadCapture.capture_status === 'waiting_for_time' && '⏳ Waiting for preferred viewing slot…'}
        {leadCapture.capture_status === 'waiting_for_contact' && '🔑 Sofia is asking for contact details…'}
        {leadCapture.capture_status === 'not_started' && '💬 Sofia is qualifying the visitor.'}
      </div>
    </div>
  );
}
