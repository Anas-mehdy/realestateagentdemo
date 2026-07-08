'use client';

import { DemoClientConfig, Message } from '@/types/demo';
import ChatWindow from '@/components/chat/ChatWindow';
import ChatInput from '@/components/chat/ChatInput';
import RestartButton from '@/components/ui/RestartButton';

interface CenterPanelProps {
  client: DemoClientConfig;
  messages: Message[];
  isTyping: boolean;
  error: string | null;
  onSend: (message: string) => void;
  onRestart: () => void;
}

export default function CenterPanel({
  client,
  messages,
  isTyping,
  error,
  onSend,
  onRestart,
}: CenterPanelProps) {
  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">{client.assistantName.charAt(0)}</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{client.assistantName}</p>
            <p className="text-xs text-slate-500">AI Property Assistant - {client.companyName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RestartButton onRestart={onRestart} disabled={isTyping} />
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100 flex items-center gap-2 text-xs text-red-700 flex-shrink-0">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      <ChatWindow messages={messages} isTyping={isTyping} />
      <ChatInput onSend={onSend} disabled={isTyping} />
    </div>
  );
}
