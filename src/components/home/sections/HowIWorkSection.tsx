'use client';

import React from 'react';
import { TERMINAL_DATA } from '@/data/terminal-data';
import { Compass, TrendingUp, Sprout } from 'lucide-react';

interface HowIWorkSectionProps {
  isActive: boolean;
}

export function HowIWorkSection({ isActive }: HowIWorkSectionProps) {
  const { principles, strengths, growthAreas } = TERMINAL_DATA.howIWork;

  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-8 overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto my-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-brand-olive to-brand-copper bg-clip-text text-transparent">
            How I Work
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Principles */}
          <div
            className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5 backdrop-blur-sm lg:row-span-2"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-brand-olive" />
              <h3 className="text-sm font-semibold text-brand-olive uppercase tracking-wider">
                Operating Principles
              </h3>
            </div>
            <ul className="space-y-4">
              {principles.map((p) => (
                <li key={p.title}>
                  <p className="text-sm font-semibold text-gray-100 mb-0.5">{p.title}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{p.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Strengths */}
          <div
            className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5 backdrop-blur-sm"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">
                Where I&apos;m Strong
              </h3>
            </div>
            <ul className="space-y-2">
              {strengths.map((s) => (
                <li key={s} className="flex items-baseline gap-2 text-sm">
                  <span className="text-emerald-500/70 shrink-0" aria-hidden="true">▹</span>
                  <span className="text-gray-300 leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Growth areas */}
          <div
            className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5 backdrop-blur-sm"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sprout className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">
                What I&apos;m Working On
              </h3>
            </div>
            <ul className="space-y-2">
              {growthAreas.map((g) => (
                <li key={g} className="flex items-baseline gap-2 text-sm">
                  <span className="text-amber-500/70 shrink-0" aria-hidden="true">▹</span>
                  <span className="text-gray-300 leading-relaxed">{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
