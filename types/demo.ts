// ─────────────────────────────────────────────────────────────
// types/demo.ts
// Central TypeScript types for the Real Estate AI Demo
// ─────────────────────────────────────────────────────────────

export type Intent = 'buy' | 'rent' | 'sell' | 'invest' | null;
export type LeadTier = 'hot' | 'warm' | 'cold';
export type DealType = 'sale' | 'rent';

// ── Property ────────────────────────────────────────────────
export interface Property {
  property_id: string;
  title: string;
  deal_type: DealType;
  city: string;
  area: string;
  price: number | null;
  price_per_month: number | null;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  size_sqm: number;
  features: string;
  description: string;
  image_url: string;
  availability: string;
  investment_yield_pct?: number | null;
}

// ── Lead ────────────────────────────────────────────────────
export interface Lead {
  intent: Intent;
  city: string | null;
  budget: number | null;
  budget_currency?: string | null;
  bedrooms: number | null;
  timeline: string | null;
  lead_score: number;
  lead_tier: LeadTier;
}

export const EMPTY_LEAD: Lead = {
  intent: null,
  city: null,
  budget: null,
  budget_currency: null,
  bedrooms: null,
  timeline: null,
  lead_score: 0,
  lead_tier: 'cold',
};

// ── Lead Capture ─────────────────────────────────────────────
export interface LeadCapture {
  name: string | null;
  phone: string | null;
  email: string | null;
  requested_action:
    | 'more_details'
    | 'schedule_viewing'
    | 'speak_to_agent'
    | 'valuation_request'
    | 'general_question'
    | 'shortlist_request'
    | 'broker_leads_request'
    | null;
  selected_property_id: string | null;
  selected_property_title: string | null;
  preferred_date_time: string | null;
  capture_status: 'not_started' | 'waiting_for_contact' | 'contact_captured' | 'waiting_for_time' | 'saved' | 'notified';
  save_status: 'not_saved' | 'saved' | 'failed';
}

export const EMPTY_LEAD_CAPTURE: LeadCapture = {
  name: null,
  phone: null,
  email: null,
  requested_action: null,
  selected_property_id: null,
  selected_property_title: null,
  preferred_date_time: null,
  capture_status: 'not_started',
  save_status: 'not_saved',
};

// ── System Events ───────────────────────────────────────────
export type SystemEventType =
  | 'intent_detected'
  | 'lead_updated'
  | 'property_search_started'
  | 'property_search_completed'
  | 'lead_saved'
  | 'hot_lead_notification'
  | 'human_handoff_requested'
  | 'claude_response'
  | 'error'
  | 'session_started'
  | 'viewing_requested'
  | 'contact_captured'
  | 'sales_alert_sent';

export interface SystemEvent {
  id: string;
  type: SystemEventType;
  label: string;
  timestamp: string;
}

// ── Chat Messages ───────────────────────────────────────────
export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  properties?: Property[];
}

// ── API Contract ─────────────────────────────────────────────
export interface ChatRequest {
  client_id: string;
  session_id: string;
  user_message: string;
  message_history: { role: MessageRole; content: string }[];
  current_lead?: Lead;
  current_lead_capture?: LeadCapture;
  last_properties?: Property[];
}

export interface ChatResponse {
  session_id: string;
  timestamp: string;
  reply: string;
  lead: Lead;
  lead_capture: LeadCapture;
  properties: Property[];
  system_events: Omit<SystemEvent, 'id'>[];
}

// ── Demo State ───────────────────────────────────────────────
export interface DemoState {
  sessionId: string;
  messages: Message[];
  lead: Lead;
  leadCapture: LeadCapture;
  systemEvents: SystemEvent[];
  isTyping: boolean;
  error: string | null;
}

// ── Demo Scenarios ───────────────────────────────────────────
export interface DemoScenario {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}

export interface DemoPromptGroup {
  title: string;
  icon: string;
  prompts: string[];
  note?: string;
}

export interface DemoClientConfig {
  clientId: string;
  companyName: string;
  assistantName: string;
  websiteUrl: string;
  logoUrl?: string;
  initials: string;
  market: string;
  serviceAreas: string[];
  companyStrengths: string[];
  propertyTypes: string[];
  welcomeMessage: string;
  demoPromptGroups: DemoPromptGroup[];
  n8nClientId: string;
}
