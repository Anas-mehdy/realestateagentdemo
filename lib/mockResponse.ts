// ─────────────────────────────────────────────────────────────
// lib/mockResponse.ts
// Realistic fallback responses when n8n is not connected.
// Simulates Sofia's conversational style + lead capture updates.
// ─────────────────────────────────────────────────────────────

import { ChatResponse, Lead, LeadCapture, Property, SystemEvent, EMPTY_LEAD, EMPTY_LEAD_CAPTURE } from '@/types/demo';

// ── Mock Database ────────────────────────────────────────────
const MOCK_PROPERTIES: Property[] = [
  {
    property_id: 'PROP-001',
    title: 'Modern 2BR Apartment in Floreasca',
    deal_type: 'sale',
    city: 'Bucharest',
    area: 'Floreasca',
    price: 135000,
    price_per_month: null,
    currency: 'EUR',
    bedrooms: 2,
    bathrooms: 1,
    size_sqm: 68,
    features: 'parking, balcony, AC, lift, storage',
    description: 'A bright, well-maintained 2-bedroom apartment in Floreasca. Renovated kitchen and bathroom. Large south-facing balcony and underground parking included.',
    image_url: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Floreasca+2BR',
    availability: 'available',
    investment_yield_pct: null,
  },
  {
    property_id: 'PROP-005',
    title: 'Buy-to-Let Investment Apartment Militari',
    deal_type: 'sale',
    city: 'Bucharest',
    area: 'Militari',
    price: 85000,
    price_per_month: null,
    currency: 'EUR',
    bedrooms: 2,
    bathrooms: 1,
    size_sqm: 58,
    features: 'tenant-in-place, parking, lift, storage',
    description: 'Turnkey investment apartment rented at 430 EUR per month. Approximately 6.1% gross yield. Tenant happy to stay long-term.',
    image_url: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Militari+Investment',
    availability: 'available',
    investment_yield_pct: 6.1,
  },
  {
    property_id: 'PROP-007',
    title: '3BR Family House for Rent in Baneasa',
    deal_type: 'rent',
    city: 'Bucharest',
    area: 'Baneasa',
    price: null,
    price_per_month: 1500,
    currency: 'EUR',
    bedrooms: 3,
    bathrooms: 2,
    size_sqm: 165,
    features: 'garden, garage, furnished, alarm, pool-access',
    description: 'Beautifully furnished family home in a gated complex. Private garden, large garage, and pool access. Near Baneasa shopping and forest.',
    image_url: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Baneasa+House',
    availability: 'available',
    investment_yield_pct: null,
  }
];

// ── Keyword detectors ────────────────────────────────────────
function detectIntent(text: string): Lead['intent'] {
  const t = text.toLowerCase();
  if (t.includes('invest') || t.includes('yield') || t.includes('roi') || t.includes('buy-to-let')) return 'invest';
  if (t.includes('sell') || t.includes('valuation') || t.includes('selling')) return 'sell';
  if (t.includes('rent') || t.includes('renting') || t.includes('monthly') || t.includes('/month')) return 'rent';
  if (t.includes('buy') || t.includes('purchase') || t.includes('buying') || t.includes('looking for') || t.includes('apartment') || t.includes('house')) return 'buy';
  return null;
}

function detectCity(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('bucharest') || t.includes('bucurești')) return 'Bucharest';
  if (t.includes('cluj')) return 'Cluj-Napoca';
  if (t.includes('timisoara') || t.includes('timișoara')) return 'Timișoara';
  if (t.includes('brasov') || t.includes('brașov')) return 'Brașov';
  return null;
}

function detectBudget(text: string): number | null {
  const patterns = [
    /€?\s*(\d+(?:[,.]?\d+)?)\s*k/i,
    /€\s*(\d{1,3}(?:[,]\d{3})+)/,
    /(\d{3,})\s*(?:eur|euro|€)/i,
    /budget[^€\d]*€?\s*(\d+(?:[,.]?\d+)?)\s*k?/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let num = parseFloat(match[1].replace(',', ''));
      if (text.toLowerCase().includes('k') && num < 10000) num *= 1000;
      return num;
    }
  }
  return null;
}

function detectBedrooms(text: string): number | null {
  const match = text.match(/(\d+)[\s-]*(bedroom|br|bed)/i);
  if (match) return parseInt(match[1]);
  if (text.toLowerCase().includes('studio')) return 0;
  if (text.toLowerCase().includes('one bedroom')) return 1;
  if (text.toLowerCase().includes('two bedroom')) return 2;
  if (text.toLowerCase().includes('three bedroom')) return 3;
  return null;
}

function detectRequestedAction(text: string): LeadCapture['requested_action'] {
  const t = text.toLowerCase();
  if (t.includes('viewing') || t.includes('visit') || t.includes('book') || t.includes('schedule')) return 'schedule_viewing';
  if (t.includes('speak to') || t.includes('talk to') || t.includes('human') || t.includes('agent') || t.includes('phone call')) return 'speak_to_agent';
  if (t.includes('valuation') || t.includes('how much it is worth') || t.includes('value my')) return 'valuation_request';
  if (t.includes('details') || t.includes('more info')) return 'more_details';
  if (t.includes('weather') || t.includes('sport') || t.includes('news')) return 'general_question';
  return null;
}

// ── Score calculator ─────────────────────────────────────────
function calcScore(lead: Lead, lc: LeadCapture): number {
  let score = 0;
  if (lead.intent) score += 10;
  if (lead.city) score += 10;
  if (lead.budget) score += 10;
  if (lead.bedrooms !== null) score += 5;
  if (lead.timeline) score += 10;
  
  // Lead capture scores
  if (lc.name && (lc.phone || lc.email)) score += 30; // Contact details
  if (lc.requested_action && lc.requested_action !== 'general_question') score += 15; // Serious requested action
  if (lc.preferred_date_time) score += 10; // Time slot provided
  
  return Math.min(score, 100);
}

function calcTier(score: number): Lead['lead_tier'] {
  if (score >= 70) return 'hot';
  if (score >= 40) return 'warm';
  return 'cold';
}

// ── Main export ───────────────────────────────────────────────
export function buildMockResponse(
  sessionId: string,
  userMessage: string,
  currentLead: Lead,
  currentLeadCapture: LeadCapture
): ChatResponse {
  const intent = detectIntent(userMessage) ?? currentLead.intent;
  const city = detectCity(userMessage) ?? currentLead.city;
  const budget = detectBudget(userMessage) ?? currentLead.budget;
  const bedrooms = detectBedrooms(userMessage) ?? currentLead.bedrooms;
  
  // ── Extract lead capture details ────────────────────────────
  let name = currentLeadCapture.name;
  let phone = currentLeadCapture.phone;
  let email = currentLeadCapture.email;
  let preferred_date_time = currentLeadCapture.preferred_date_time;
  
  // Action detection
  const requested_action = detectRequestedAction(userMessage) ?? currentLeadCapture.requested_action;
  
  // Basic Regex parsers
  const phoneMatch = userMessage.match(/\+?\d[\d\s-]{7,14}\d/);
  if (phoneMatch && !userMessage.toLowerCase().includes(' budget')) {
    phone = phoneMatch[0].trim();
  }
  
  const emailMatch = userMessage.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) {
    email = emailMatch[0];
  }
  
  if (userMessage.toLowerCase().includes('sam')) {
    name = 'Sam';
  } else {
    const nameMatch = userMessage.match(/(?:my name is|i am|this is)\s+([A-Za-z]+)/i);
    if (nameMatch) name = nameMatch[1];
  }
  
  // Preferred time match
  if (userMessage.toLowerCase().includes('tomorrow') || userMessage.toLowerCase().includes('afternoon') || userMessage.toLowerCase().includes('monday') || userMessage.toLowerCase().includes('pm')) {
    preferred_date_time = userMessage.replace(/[".!?]/g, '').trim();
  }
  
  // ── Lead Capture State Machine ──────────────────────────────
  let capture_status: LeadCapture['capture_status'] = currentLeadCapture.capture_status;
  let save_status: LeadCapture['save_status'] = currentLeadCapture.save_status;
  
  const system_events: Omit<SystemEvent, 'id'>[] = [];
  const ts = new Date().toISOString();

  if (requested_action === 'schedule_viewing') {
    if (!name || (!phone && !email)) {
      capture_status = 'waiting_for_contact';
    } else if (!preferred_date_time) {
      capture_status = 'waiting_for_time';
    } else {
      capture_status = 'contact_captured';
    }
  } else if (requested_action === 'speak_to_agent' || requested_action === 'valuation_request') {
    if (!name || (!phone && !email)) {
      capture_status = 'waiting_for_contact';
    } else {
      capture_status = 'contact_captured';
    }
  } else {
    if (name && (phone || email)) {
      capture_status = 'contact_captured';
    }
  }

  // Trigger Save / Notification if contact is provided after serious action
  const hasContact = name && (phone || email);
  const isSerious = requested_action === 'schedule_viewing' || requested_action === 'speak_to_agent' || requested_action === 'valuation_request';
  
  let shouldNotify = false;
  
  if (hasContact && isSerious) {
    if (save_status === 'not_saved') {
      save_status = 'saved';
      capture_status = 'saved';
      system_events.push({
        type: 'lead_saved',
        label: `Lead saved to Google Sheets (leads tab)`,
        timestamp: ts,
      });
      
      // Also notify
      shouldNotify = true;
    }
  }
  
  if (shouldNotify || (save_status === 'saved' && capture_status === 'saved')) {
    capture_status = 'notified';
    system_events.push({
      type: 'sales_alert_sent',
      label: `Sales alert sent to Telegram`,
      timestamp: ts,
    });
  }

  // Lead score and tier
  const lead: Lead = {
    intent,
    city,
    budget,
    bedrooms,
    timeline: currentLead.timeline,
    lead_score: 0,
    lead_tier: 'cold',
  };
  
  // ── Property search simulation ──────────────────────────────
  let properties: Property[] = [];
  if (intent && city && (budget || bedrooms !== null)) {
    properties = MOCK_PROPERTIES.filter(p => {
      if (p.deal_type === 'rent' && intent === 'rent') {
        return budget ? (p.price_per_month ?? 0) <= budget : true;
      }
      if (p.deal_type === 'sale' && (intent === 'buy' || intent === 'invest')) {
        return budget ? (p.price ?? 0) <= budget : true;
      }
      return false;
    });
    
    // Cluj/invest specific handling
    if (intent === 'invest') {
      properties = MOCK_PROPERTIES.filter(p => p.property_id === 'PROP-005');
    }
  }
  
  // Override selected property for preview
  let selected_property_id = currentLeadCapture.selected_property_id;
  let selected_property_title = currentLeadCapture.selected_property_title;
  
  if (properties.length > 0) {
    selected_property_id = properties[0].property_id;
    selected_property_title = properties[0].title;
  }

  const lead_capture: LeadCapture = {
    name,
    phone,
    email,
    requested_action,
    selected_property_id,
    selected_property_title,
    preferred_date_time,
    capture_status,
    save_status,
  };
  
  lead.lead_score = calcScore(lead, lead_capture);
  lead.lead_tier = calcTier(lead.lead_score);

  // ── Sofia replies based on dialog state ──────────────────────
  let reply = '';
  const textClean = userMessage.toLowerCase();
  
  if (textClean.includes('weather') || textClean.includes('sport')) {
    reply = "I'm focused on helping with real estate — is there a property question I can help you with? 🏠";
  } else if (requested_action === 'schedule_viewing') {
    if (!hasContact) {
      reply = "Of course — I can help with that. What’s your name and the best phone number or email for the agent to reach you?";
    } else if (!preferred_date_time) {
      reply = `Thanks, ${name}. What date and time would work best for the viewing?`;
    } else {
      reply = `Perfect. I'll pass this to the sales team so they can confirm the viewing time with you.`;
    }
  } else if (requested_action === 'speak_to_agent') {
    if (!hasContact) {
      reply = "I would be happy to connect you with one of our experienced agents. Could you please share your name and contact details?";
    } else {
      reply = `Thanks, ${name}. I've passed your request to our team and they will be in touch shortly.`;
    }
  } else if (intent === 'sell') {
    if (!hasContact) {
      reply = "Selling your property in Floreasca is a great move, it is a highly in-demand area! I can have one of our valuation experts calculate an estimate. What is your name and phone number to set that up?";
    } else {
      reply = `Thank you, ${name}. I've logged your valuation request for Floreasca and our specialist will contact you on ${phone || email} soon.`;
    }
  } else if (properties.length > 0) {
    const p = properties[0];
    const priceStr = p.deal_type === 'rent' ? `€${p.price_per_month}/month` : `€${(p.price ?? 0).toLocaleString()}`;
    reply = `I found a great match: **${p.title}** located in ${p.area}, ${p.city} for ${priceStr}. It has ${p.bedrooms} bedrooms, ${p.bathrooms} bathroom and is ${p.size_sqm} sqm. ${p.description} Would you like to schedule a viewing?`;
  } else if (textClean.includes('brasov') || textClean.includes('5-bedroom house')) {
    reply = "I don't have an exact match for those criteria in our database right now. Would you be open to adjusting your budget or considering a nearby neighborhood?";
  } else {
    reply = "Hi there! I am Sofia, your AI property assistant. Whether you are looking to buy, rent, sell, or invest, I am here to help. What brings you here today?";
  }

  // ── Construct system events list ────────────────────────────
  if (intent && intent !== currentLead.intent) {
    system_events.unshift({
      type: 'intent_detected',
      label: `Intent detected: ${intent.toUpperCase()}`,
      timestamp: ts,
    });
  }
  
  if (city && city !== currentLead.city) {
    system_events.push({
      type: 'lead_updated',
      label: `City captured: ${city}`,
      timestamp: ts,
    });
  }
  
  if (requested_action && requested_action !== currentLeadCapture.requested_action) {
    system_events.push({
      type: 'viewing_requested',
      label: `Action requested: ${requested_action.replace('_', ' ')}`,
      timestamp: ts,
    });
  }
  
  if (hasContact && !currentLeadCapture.phone && !currentLeadCapture.email) {
    system_events.push({
      type: 'contact_captured',
      label: `Contact captured for ${name}`,
      timestamp: ts,
    });
  }
  
  system_events.push({
    type: 'claude_response',
    label: 'Sofia response generated (mock)',
    timestamp: ts,
  });

  return {
    session_id: sessionId,
    timestamp: ts,
    reply,
    lead,
    lead_capture,
    properties,
    system_events,
  };
}
