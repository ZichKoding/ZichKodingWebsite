'use client';

import React from 'react';
import { TERMINAL_DATA } from '@/data/terminal-data';
import { Monitor, Server, Cloud, Wrench, Trophy } from 'lucide-react';

interface SkillsSectionProps {
  isActive: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
  Frontend: Monitor,
  Backend: Server,
  DevOps: Cloud,
  Tools: Wrench,
  Leadership: Trophy,
};

export function SkillsSection({ isActive }: SkillsSectionProps) {
  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-8 overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto my-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Technical Skills
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(TERMINAL_DATA.skills).map(([category, skills], catIdx) => {
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
                  <Icon className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                    {category}
                  </h3>
                </div>

                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-gray-500">{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                          style={{
                            width: isActive ? `${skill.proficiency}%` : '0%',
                            transition: 'width 1s ease-out',
                            transitionDelay: `${0.08 * catIdx + 0.3}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
