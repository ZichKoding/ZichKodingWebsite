'use client';

import React from 'react';
import { TERMINAL_DATA } from '@/data/terminal-data';
import { Code2, Bot, Cloud, ClipboardCheck, Wrench } from 'lucide-react';

interface SkillsSectionProps {
  isActive: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
  'Languages & Frameworks': Code2,
  'AI Engineering': Bot,
  'Cloud & Integrations': Cloud,
  'Practices & Ops': ClipboardCheck,
};

export function SkillsSection({ isActive }: SkillsSectionProps) {
  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-8 overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto my-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-brand-olive to-brand-copper bg-clip-text text-transparent">
            Technical Skills
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TERMINAL_DATA.skills.map(({ category, items }, catIdx) => {
            const Icon = categoryIcons[category] || Wrench;
            return (
              <div
                key={category}
                className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5 backdrop-blur-sm"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.5s ease ${0.08 * catIdx}s, transform 0.5s ease ${0.08 * catIdx}s`,
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-5 h-5 text-brand-copper" />
                  <h3 className="text-sm font-semibold text-brand-copper-bright uppercase tracking-wider">
                    {category}
                  </h3>
                </div>

                <ul className="space-y-2">
                  {items.map((skill) => (
                    <li key={skill.name} className="flex items-baseline gap-2 text-sm">
                      <span className="text-brand-olive shrink-0" aria-hidden="true">
                        ▹
                      </span>
                      <span className="text-gray-300">{skill.name}</span>
                      {skill.note && (
                        <span className="text-xs text-gray-500 truncate">{skill.note}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
