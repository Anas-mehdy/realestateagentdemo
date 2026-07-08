'use client';

import { ReactNode } from 'react';
import { DemoClientConfig } from '@/types/demo';

interface DemoLayoutProps {
  client: DemoClientConfig;
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export default function DemoLayout({ client, left, center, right }: DemoLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Top bar */}
      <header className="flex-shrink-0 h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shadow-sm z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{client.initials}</span>
          </div>
          <span className="text-sm font-semibold text-slate-800">
            {client.companyName}
          </span>
          <span className="hidden sm:block text-xs text-slate-400 border border-slate-200 rounded-full px-2 py-0.5">
            {client.assistantName} Demo
          </span>
        </div>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.512M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.512M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
            </svg>
            n8n Automation
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Live Demo
          </span>
        </div>
      </header>

      {/* 3-column grid */}
      <main className="flex-1 grid gap-4 p-4 overflow-hidden min-h-0"
        style={{
          gridTemplateColumns: '280px 1fr 280px',
          height: 'calc(100vh - 56px)',
        }}
      >
        {/* Left panel */}
        <div className="overflow-hidden flex flex-col min-h-0 h-full">
          {left}
        </div>

        {/* Center panel — fills remaining height */}
        <div className="overflow-hidden flex flex-col min-h-0 h-full">
          {center}
        </div>

        {/* Right panel */}
        <div className="overflow-hidden flex flex-col min-h-0 h-full">
          {right}
        </div>
      </main>
    </div>
  );
}
