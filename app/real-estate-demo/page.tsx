'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  ChatRequest,
  ChatResponse,
  DemoState,
  EMPTY_LEAD,
  EMPTY_LEAD_CAPTURE,
  Lead,
  Property,
} from '@/types/demo';
import {
  SOFIA_GREETING,
  buildMessageHistory,
  createMessage,
  createNewSessionId,
  createSystemEvent,
  getOrCreateSessionId,
  mergeLead,
  mergeSystemEvents,
} from '@/lib/helpers';
import { getDemoClient } from '@/lib/demoClients';

import DemoLayout from '@/components/demo/DemoLayout';
import LeftPanel from '@/components/demo/LeftPanel';
import CenterPanel from '@/components/demo/CenterPanel';
import RightPanel from '@/components/demo/RightPanel';

function makeInitialState(
  sessionId: string,
  welcomeMessage: string,
  companyName: string
): DemoState {
  return {
    sessionId,
    messages: [createMessage('assistant', welcomeMessage || SOFIA_GREETING)],
    lead: { ...EMPTY_LEAD },
    leadCapture: { ...EMPTY_LEAD_CAPTURE },
    systemEvents: [
      createSystemEvent('session_started', `New demo session started for ${companyName}`),
    ],
    isTyping: false,
    error: null,
  };
}

function RealEstateDemoPageContent() {
  const searchParams = useSearchParams();
  const clientConfig = getDemoClient(searchParams.get('client'));
  const [state, setState] = useState<DemoState | null>(null);

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    setState(makeInitialState(sessionId, clientConfig.welcomeMessage, clientConfig.companyName));
  }, [clientConfig.clientId, clientConfig.companyName, clientConfig.welcomeMessage]);

  const handleSend = useCallback(
    async (userText: string) => {
      if (!state || state.isTyping) return;

      const userMessage = createMessage('user', userText);

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
        const updatedMessages = [...state.messages, userMessage];
        const history = buildMessageHistory(updatedMessages);

        let lastProperties: Property[] = [];
        for (let i = state.messages.length - 1; i >= 0; i--) {
          const msg = state.messages[i];
          if (msg.role === 'assistant' && msg.properties && msg.properties.length > 0) {
            lastProperties = msg.properties;
            break;
          }
        }

        const requestBody: ChatRequest = {
          client_id: clientConfig.n8nClientId,
          session_id: state.sessionId,
          user_message: userText,
          message_history: history,
          current_lead: state.lead,
          current_lead_capture: state.leadCapture,
          last_properties: lastProperties,
        };

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data: ChatResponse = await res.json();
        const assistantMessage = createMessage(
          'assistant',
          data.reply,
          data.properties?.length ? data.properties : undefined
        );

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
          "I'm having a brief technical issue. Please try sending your message again."
        );
        setState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, errorMessage],
            isTyping: false,
            error: 'Connection issue - using fallback mode.',
          };
        });
      }
    },
    [state, clientConfig.n8nClientId]
  );

  const handleScenarioSelect = useCallback(
    (prompt: string) => {
      if (!state || state.isTyping) return;
      handleSend(prompt);
    },
    [state, handleSend]
  );

  const handleRestart = useCallback(() => {
    const newSessionId = createNewSessionId();
    setState(makeInitialState(newSessionId, clientConfig.welcomeMessage, clientConfig.companyName));
  }, [clientConfig.companyName, clientConfig.welcomeMessage]);

  if (!state) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-bold">{clientConfig.initials}</span>
          </div>
          <p className="text-sm text-slate-500">Starting {clientConfig.assistantName}...</p>
        </div>
      </div>
    );
  }

  return (
    <DemoLayout
      client={clientConfig}
      left={
        <LeftPanel
          client={clientConfig}
          onScenarioSelect={handleScenarioSelect}
          isTyping={state.isTyping}
        />
      }
      center={
        <CenterPanel
          client={clientConfig}
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

export default function RealEstateDemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <p className="text-sm text-slate-500">Starting real estate demo...</p>
        </div>
      }
    >
      <RealEstateDemoPageContent />
    </Suspense>
  );
}
