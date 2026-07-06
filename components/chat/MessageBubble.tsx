'use client';

import { Message } from '@/types/demo';
import { formatTimestamp } from '@/lib/helpers';
import PropertyCard from './PropertyCard';

interface MessageBubbleProps {
  message: Message;
}

// Simple markdown-like renderer: bold, line breaks
function renderContent(text: string) {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .split('\n')
    .map((line) => `<p>${line}</p>`)
    .join('');
  return { __html: html };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end gap-2.5 message-enter">
        <div className="max-w-[78%]">
          <div className="bg-blue-800 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed shadow-sm">
            {message.content}
          </div>
          <p className="text-xs text-slate-400 text-right mt-1 pr-1">
            {formatTimestamp(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 message-enter">
      {/* Sofia avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
        <span className="text-white text-xs font-bold">S</span>
      </div>

      <div className="max-w-[82%]">
        {/* Name label on first assistant message or when useful */}
        <p className="text-xs font-medium text-blue-700 mb-1 ml-0.5">Sofia</p>

        {/* Text bubble */}
        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
          <div
            className="text-sm text-slate-800 leading-relaxed message-content"
            dangerouslySetInnerHTML={renderContent(message.content)}
          />
        </div>

        {/* Property cards */}
        {message.properties && message.properties.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.properties.map((p) => (
              <PropertyCard key={p.property_id} property={p} />
            ))}
          </div>
        )}

        <p className="text-xs text-slate-400 mt-1 ml-0.5">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
