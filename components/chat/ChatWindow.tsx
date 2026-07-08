'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types/demo';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
}

export default function ChatWindow({ messages, isTyping }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 min-h-0 sm:px-4 sm:py-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isTyping && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={bottomRef} className="h-px" />
    </div>
  );
}
