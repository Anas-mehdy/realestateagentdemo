'use client';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 message-enter">
      {/* Sofia avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="text-white text-xs font-bold">S</span>
      </div>

      {/* Bubble */}
      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5 h-4">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
