'use client';

import { useState } from 'react';

import { DemoClientConfig } from '@/types/demo';

interface LeftPanelProps {
  client: DemoClientConfig;
  onScenarioSelect: (prompt: string) => void;
  isTyping: boolean;
}

export default function LeftPanel({ client, onScenarioSelect, isTyping }: LeftPanelProps) {
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({});

  const toggleCategory = (index: number) => {
    setOpenCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <aside className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
      <div className="hidden xl:block">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-md overflow-hidden">
            {client.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={client.logoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-sm font-bold">{client.initials}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">{client.companyName}</p>
            <p className="text-xs text-slate-500">{client.market} Real Estate Demo</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-medium">{client.assistantName} is online and ready</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Try These Demo Messages
        </h2>

        <div className="space-y-1.5 pr-1">
          {client.demoPromptGroups.map((cat, catIdx) => {
            const isOpen = !!openCategories[catIdx];
            return (
              <div key={`${cat.title}-${catIdx}`} className="border border-slate-100 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => toggleCategory(catIdx)}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                    isOpen ? 'bg-slate-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase text-slate-400">{cat.icon}</span>
                    {cat.title}
                  </span>
                  <span>{isOpen ? 'Up' : 'Down'}</span>
                </button>
                {isOpen && (
                  <div className="p-2 bg-slate-50/50 border-t border-slate-50 space-y-1.5">
                    {cat.note && (
                      <p className="text-[10px] text-slate-400 italic mb-1.5 px-1 leading-normal">
                        {cat.note}
                      </p>
                    )}
                    {cat.prompts.map((prompt, promptIdx) => (
                      <button
                        key={`${cat.title}-${promptIdx}`}
                        onClick={() => onScenarioSelect(prompt)}
                        disabled={isTyping}
                        className="w-full text-left p-2 rounded bg-white border border-slate-100 hover:border-blue-200 text-[11px] text-slate-600 leading-normal transition shadow-sm hover:shadow hover:text-slate-800 disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
