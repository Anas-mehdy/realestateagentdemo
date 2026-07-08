// ─────────────────────────────────────────────────────────────
// lib/helpers.ts
// Utility functions for the demo
// ─────────────────────────────────────────────────────────────

import { Lead, Message, SystemEvent, SystemEventType } from '@/types/demo';

// ── Session ID ───────────────────────────────────────────────
export function generateSessionId(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  return `sess_${ts}_${rand}`;
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId();
  const stored = localStorage.getItem('re_demo_session_id');
  if (stored) return stored;
  const newId = generateSessionId();
  localStorage.setItem('re_demo_session_id', newId);
  return newId;
}

export function createNewSessionId(): string {
  const newId = generateSessionId();
  if (typeof window !== 'undefined') {
    localStorage.setItem('re_demo_session_id', newId);
  }
  return newId;
}

// ── Message helpers ──────────────────────────────────────────
export function createMessage(
  role: 'user' | 'assistant',
  content: string,
  properties?: Message['properties']
): Message {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
    properties,
  };
}

export const SOFIA_GREETING =
  "Hi there! 👋 I'm Sofia, your property assistant. Whether you're looking to buy, rent, sell, or invest — I'm here to help you find exactly what you need. What brings you here today?";

// ── System event helpers ─────────────────────────────────────
export function createSystemEvent(
  type: SystemEventType,
  label: string
): SystemEvent {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    type,
    label,
    timestamp: new Date().toISOString(),
  };
}

export function mergeSystemEvents(
  existing: SystemEvent[],
  incoming: Omit<SystemEvent, 'id'>[]
): SystemEvent[] {
  const newEvents = incoming.map((e) => ({
    ...e,
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
  }));
  // Newest first, cap at 50
  return [...newEvents, ...existing].slice(0, 50);
}

// ── Lead merge ───────────────────────────────────────────────
export function mergeLead(current: Lead, incoming: Partial<Lead>): Lead {
  return {
    intent: incoming.intent ?? current.intent,
    city: incoming.city ?? current.city,
    budget: incoming.budget ?? current.budget,
    budget_currency: incoming.budget_currency ?? current.budget_currency,
    bedrooms: incoming.bedrooms ?? current.bedrooms,
    timeline: incoming.timeline ?? current.timeline,
    lead_score: incoming.lead_score ?? current.lead_score,
    lead_tier: incoming.lead_tier ?? current.lead_tier,
  };
}

// ── Formatting ───────────────────────────────────────────────
export function formatCurrency(value: number | null, currency = 'AED'): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return formatTimestamp(iso);
}

// ── Message history builder ──────────────────────────────────
export function buildMessageHistory(
  messages: Message[]
): { role: 'user' | 'assistant'; content: string }[] {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}
