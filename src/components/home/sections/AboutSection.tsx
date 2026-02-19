'use client';

import React from 'react';
import { TERMINAL_DATA } from '@/data/terminal-data';
import { Rocket, GraduationCap, Users, Code2 } from 'lucide-react';

interface AboutSectionProps {
  isActive: boolean;
}

const highlights = [
  { icon: GraduationCap, label: 'UCF Certified Full-Stack Developer' },
  { icon: Rocket, label: '6+ Years Professional Experience' },
  { icon: Users, label: 'Technical Leadership & Mentoring' },
  { icon: Code2, label: 'Clean Code & Performance Focused' },
];

export function AboutSection({ isActive }: AboutSectionProps) {
  // Parse bio from the about text
  const lines = TERMINAL_DATA.about.split('\n').filter((l) => l.trim());
  // Skip the box border lines, grab the core text
  const bioLines = lines.filter(
    (l) => !l.startsWith('╔') && !l.startsWith('╚') && !l.startsWith('║') && !l.startsWith('✦')
  );

  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-8 overflow-y-auto">
      <div className="max-w-3xl w-full mx-auto my-auto">
        <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-6 sm:p-10 backdrop-blur-sm">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Chris
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-6">
            Lead Developer & Technology Manager
          </p>

          {/* Bio */}
          <div className="space-y-3 mb-8">
            {bioLines.map((line, i) => (
              <p key={i} className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {line.trim()}
              </p>
            ))}
          </div>

          {/* Highlights grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                    transition: `opacity 0.5s ease ${0.1 * i}s, transform 0.5s ease ${0.1 * i}s`,
                  }}
                >
                  <Icon className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-gray-300 text-sm">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
