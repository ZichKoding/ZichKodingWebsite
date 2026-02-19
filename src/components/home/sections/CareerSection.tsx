'use client';

import React from 'react';
import { TERMINAL_DATA } from '@/data/terminal-data';

interface CareerSectionProps {
  isActive: boolean;
}

export function CareerSection({ isActive }: CareerSectionProps) {
  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-8 overflow-y-auto">
      <div className="max-w-3xl w-full mx-auto my-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Career Timeline
          </span>
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/60 via-cyan-500/40 to-transparent" />

          <div className="space-y-8">
            {TERMINAL_DATA.career.map((entry, idx) => (
              <div
                key={idx}
                className="relative pl-12 sm:pl-16"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `opacity 0.5s ease ${0.12 * idx}s, transform 0.5s ease ${0.12 * idx}s`,
                }}
              >
                {/* Dot */}
                <div className="absolute left-2.5 sm:left-4.5 top-1.5 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900 shadow-lg shadow-cyan-500/30" />

                {/* Card */}
                <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5 backdrop-blur-sm">
                  <span className="text-xs font-mono text-purple-400 mb-1 block">
                    {entry.period}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-1">
                    {entry.role}
                  </h3>
                  <p className="text-sm text-cyan-400 mb-2">{entry.company}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
