'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-slate-100 bg-white px-4 py-3">
      <div
        className={`flex items-end gap-2 rounded-xl border bg-slate-50 transition-colors duration-150 ${
          disabled
            ? 'border-slate-200'
            : 'border-slate-200 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100'
        }`}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          placeholder={disabled ? 'Sofia is typing…' : 'Type your message… (Enter to send)'}
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: '42px', maxHeight: '120px' }}
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`m-1.5 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
            canSend
              ? 'bg-blue-800 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>

    </div>
  );
}
