'use client';

interface RestartButtonProps {
  onRestart: () => void;
  disabled?: boolean;
}

export default function RestartButton({ onRestart, disabled = false }: RestartButtonProps) {
  return (
    <button
      onClick={onRestart}
      disabled={disabled}
      title="Start a new conversation"
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
        border border-slate-200 bg-white text-slate-500
        transition-all duration-150
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50 cursor-pointer'}
      `}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Restart Demo
    </button>
  );
}
