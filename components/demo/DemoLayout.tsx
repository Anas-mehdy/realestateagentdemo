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
    <div className="flex min-h-dvh flex-col bg-slate-50 xl:h-screen xl:overflow-hidden">
      <header className="sticky top-0 z-10 flex min-h-14 flex-shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3 py-2 shadow-sm sm:px-6 xl:h-14 xl:py-0">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-700 to-blue-900">
            <span className="text-xs font-bold text-white">{client.initials}</span>
          </div>
          <span className="truncate text-sm font-semibold text-slate-800">
            {client.companyName}
          </span>
          <span className="hidden rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-400 sm:block">
            {client.assistantName} Demo
          </span>
        </div>

        <div className="flex-1" />

        <div className="hidden items-center gap-3 md:flex">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="h-3.5 w-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.512M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.512M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
            </svg>
            n8n Automation
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Live Demo
          </span>
        </div>
      </header>

      <main className="grid flex-1 grid-cols-1 gap-3 overflow-y-auto p-3 sm:gap-4 sm:p-4 xl:min-h-0 xl:grid-cols-[280px_minmax(0,1fr)_280px] xl:overflow-hidden">
        <div className="order-2 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm xl:order-1 xl:h-full xl:overflow-hidden xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none">
          {left}
        </div>

        <div className="order-1 flex h-[calc(100dvh-5.5rem)] min-h-[560px] min-w-0 flex-col overflow-hidden xl:order-2 xl:h-full xl:min-h-0">
          {center}
        </div>

        <div className="order-3 flex min-h-0 flex-col xl:h-full xl:overflow-hidden">
          {right}
        </div>
      </main>
    </div>
  );
}
