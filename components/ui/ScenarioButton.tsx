'use client';

import { DemoScenario } from '@/types/demo';

interface ScenarioButtonProps {
  scenario: DemoScenario;
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export default function ScenarioButton({
  scenario,
  onSelect,
  disabled = false,
}: ScenarioButtonProps) {
  return (
    <button
      onClick={() => !disabled && onSelect(scenario.prompt)}
      disabled={disabled}
      className={`
        w-full text-left px-4 py-3 rounded-xl border text-sm leading-snug
        transition-all duration-150 group
        ${
          disabled
            ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
            : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 hover:shadow-sm cursor-pointer'
        }
      `}
    >
      <span className="flex gap-2.5 items-start">
        <span className="text-base mt-px flex-shrink-0">{scenario.icon}</span>
        <span className="group-hover:text-blue-800 transition-colors leading-relaxed">
          {scenario.prompt}
        </span>
      </span>
    </button>
  );
}
