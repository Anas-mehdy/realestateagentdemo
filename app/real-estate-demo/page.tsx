'use client';

import { useState, useEffect, useCallback } from 'react';

import {
  DemoState,
  DemoScenario,
  ChatRequest,
  ChatResponse,
  Lead,
  EMPTY_LEAD,
  EMPTY_LEAD_CAPTURE,
} from '@/types/demo';
import {
  createMessage,
  createNewSessionId,
  getOrCreateSessionId,
  mergeSystemEvents,
  mergeLead,
  SOFIA_GREETING,
  buildMessageHistory,
  createSystemEvent,
} from '@/lib/helpers';

import DemoLayout from '@/components/demo/DemoLayout';
import LeftPanel from '@/components/demo/LeftPanel';
import CenterPanel from '@/components/demo/CenterPanel';
import RightPanel from '@/components/demo/RightPanel';

// ── Demo scenarios ────────────────────────────────────────────
const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'buy-apartment',
    icon: '🏠',
    label: 'Buy apartment',
    prompt: "I'm looking to buy a 2-bedroom apartment in Bucharest. My budget is around €140k.",
  },
  {
    id: 'rent-house',
    icon: '🔑',
    label: 'Rent family home',
    prompt: "We need to rent a 3-bedroom family house in Bucharest, up to €1,600/month.",
  },
  {
    id: 'invest',
    icon: '📈',
    label: 'Investment property',
    prompt: "I'm interested in an investment property in Romania around €100k.",
  },
  {
    id: 'sell',
    icon: '🏷️',
    label: 'Sell & valuation',
    prompt: "I want to sell my apartment in Floreasca. Can you help me get a valuation?",
  },
  {
    id: 'viewing',
    icon: '📅',
    label: 'Book a viewing',
    prompt: "I'd like to book a viewing for a property in Aviatorilor.",
  },
];

// ── Initial state factory ─────────────────────────────────────
function makeInitialState(sessionId: string): DemoState {
  return {
    sessionId,
    messages: [
      createMessage('assistant', SOFIA_GREETING),
    ],
    lead: { ...EMPTY_LEAD },
    leadCapture: { ...EMPTY_LEAD_CAPTURE },
    systemEvents: [
      createSystemEvent('session_started', 'New demo session started'),
    ],
    isTyping: false,
    error: null,
  };
}

// ── Page component ────────────────────────────────────────────
export default function RealEstateDemoPage() {
  const [state, setState] = useState<DemoState | null>(null);

  // Hydrate state after mount (avoids SSR mismatch with localStorage)
  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    setState(makeInitialState(sessionId));
  }, []);

  // ── Send message ────────────────────────────────────────────
  const handleSend = useCallback(
    async (userText: string) => {
      if (!state || state.isTyping) return;

      const userMessage = createMessage('user', userText);

      // 1. Optimistically add user message + show typing
      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, userMessage],
          isTyping: true,
          error: null,
        };
      });

      try {
        // 2. Build history including the new user message
        const updatedMessages = [...state.messages, userMessage];
        const history = buildMessageHistory(updatedMessages);

        const requestBody: ChatRequest & { current_lead: Lead; current_lead_capture: any } = {
          session_id: state.sessionId,
          user_message: userText,
          message_history: history,
          current_lead: state.lead, // Pass current lead for mock context
          current_lead_capture: state.leadCapture,
        };

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data: ChatResponse = await res.json();

        // 3. Build assistant message (with optional properties)
        const assistantMessage = createMessage(
          'assistant',
          data.reply,
          data.properties?.length ? data.properties : undefined
        );

        // 4. Update all state from response
        setState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, assistantMessage],
            lead: mergeLead(prev.lead, data.lead ?? {}),
            leadCapture: data.lead_capture ?? prev.leadCapture,
            systemEvents: mergeSystemEvents(prev.systemEvents, data.system_events ?? []),
            isTyping: false,
            error: null,
          };
        });
      } catch (err) {
        console.error('[handleSend] Error:', err);
        const errorMessage = createMessage(
          'assistant',
          "I'm having a brief technical issue. Please try sending your message again — apologies! 🙏"
        );
        setState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, errorMessage],
            isTyping: false,
            error: 'Connection issue — using fallback mode.',
          };
        });
      }
    },
    [state]
  );

  // ── Scenario select ─────────────────────────────────────────
  const handleScenarioSelect = useCallback(
    (prompt: string) => {
      if (!state || state.isTyping) return;
      handleSend(prompt);
    },
    [state, handleSend]
  );

  // ── Restart ─────────────────────────────────────────────────
  const handleRestart = useCallback(() => {
    const newSessionId = createNewSessionId();
    setState(makeInitialState(newSessionId));
  }, []);

  // ── Loading state ────────────────────────────────────────────
  if (!state) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <p className="text-sm text-slate-500">Starting Sofia…</p>
        </div>
      </div>
    );
  }

  return (
    <DemoLayout
      left={
        <LeftPanel
          onScenarioSelect={handleScenarioSelect}
          isTyping={state.isTyping}
        />
      }
      center={
        <CenterPanel
          messages={state.messages}
          isTyping={state.isTyping}
          error={state.error}
          onSend={handleSend}
          onRestart={handleRestart}
        />
      }
      right={
        <RightPanel
          lead={state.lead}
          leadCapture={state.leadCapture}
          systemEvents={state.systemEvents}
        />
      }
    />
  );
}
