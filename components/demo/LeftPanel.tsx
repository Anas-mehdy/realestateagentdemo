'use client';

import { useState } from 'react';

interface LeftPanelProps {
  onScenarioSelect: (prompt: string) => void;
  isTyping: boolean;
}

interface DemoCategory {
  title: string;
  icon: string;
  prompts: string[];
}

const CATEGORIZED_PROMPTS: DemoCategory[] = [
  {
    title: 'Buying',
    icon: '🏠',
    prompts: [
      "I want to buy a 2-bedroom apartment in Bucharest, budget €140k.",
      "I’m looking for an apartment in Bucharest. My budget is around €120,000.",
      "Looking to purchase a family home in Pipera, 3 bedrooms, budget up to €300k."
    ]
  },
  {
    title: 'Renting',
    icon: '🔑',
    prompts: [
      "We need to rent a 3-bedroom family house in Bucharest, up to €1,600/month.",
      "I’m looking to rent a studio in central Bucharest, budget around €600/month.",
      "Do you have a 2-bedroom apartment for rent in Dorobanti?"
    ]
  },
  {
    title: 'Investing',
    icon: '📈',
    prompts: [
      "I’m looking for an investment property in Romania around €100k.",
      "Do you have buy-to-let properties in Bucharest with good rental yield?",
      "I want a property that already has a tenant and generates rental income."
    ]
  },
  {
    title: 'Viewing & Leads',
    icon: '📅',
    prompts: [
      "I’d like to schedule a viewing.",
      "My name is Sam and my phone number is +40712345678.",
      "Tomorrow afternoon works for me."
    ]
  },
  {
    title: 'Selling',
    icon: '🏷️',
    prompts: [
      "I want to sell my apartment in Floreasca. Can you help me get a valuation?",
      "I have a 2-bedroom apartment in Bucharest and I want to know how much it is worth."
    ]
  },
  {
    title: 'No Match Cases',
    icon: '❌',
    prompts: [
      "I want to buy a 2-bedroom apartment in Brasov, budget €120k.",
      "I need a 5-bedroom house in Bucharest for €80,000."
    ]
  }
];

export default function LeftPanel({ onScenarioSelect, isTyping }: LeftPanelProps) {
  const [activeCategory, setActiveCategory] = useState<number | null>(0);

  const toggleCategory = (index: number) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  return (
    <aside className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
      {/* Branding */}
      <div>
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-bold">RE</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">PropAssist AI</p>
            <p className="text-xs text-slate-500">Real Estate Demo</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-medium">Sofia is online and ready</span>
        </div>
      </div>

      {/* Try these demo messages accordion */}
      <div className="flex-1 flex flex-col min-h-0">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Try These Demo Messages
        </h2>
        
        <div className="space-y-1.5 pr-1">
          {CATEGORIZED_PROMPTS.map((cat, catIdx) => {
            const isOpen = activeCategory === catIdx;
            return (
              <div key={catIdx} className="border border-slate-100 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => toggleCategory(catIdx)}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                    isOpen ? 'bg-slate-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{cat.icon}</span>
                    {cat.title}
                  </span>
                  <span>{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="p-2 bg-slate-50/50 border-t border-slate-50 space-y-1.5">
                    {cat.prompts.map((prompt, promptIdx) => (
                      <button
                        key={promptIdx}
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

      {/* What this demo shows */}
      <div className="border-t border-slate-100 pt-3">
        <h2 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Demo Features
        </h2>
        <ul className="space-y-1.5">
          {[
            'Identifies intents step-by-step',
            'Qualifies lead scores in real-time',
            'Searches Google Sheets properties',
            'Captures contact details naturally',
            'Saves hot leads immediately',
            'Sends Telegram alerts to sales',
          ].map((point, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
              <svg className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer note */}
      <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3 leading-relaxed">
        <p className="font-semibold text-slate-500 mb-0.5">Presentation Tip</p>
        <p>
          Click through any category list above to simulate real customer responses and watch the live qualification update.
        </p>
      </div>
    </aside>
  );
}
