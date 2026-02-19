'use client';

import React from 'react';
import { TERMINAL_DATA } from '@/data/terminal-data';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ProjectsSectionProps {
  isActive: boolean;
}

const gradients = [
  'from-cyan-500/20 to-blue-500/20',
  'from-purple-500/20 to-pink-500/20',
  'from-emerald-500/20 to-teal-500/20',
];

export function ProjectsSection({ isActive }: ProjectsSectionProps) {
  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-8 overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto my-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Featured Projects
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TERMINAL_DATA.projects.map((project, idx) => (
            <div
              key={project.name}
              className="bg-slate-800/30 border border-slate-700/40 rounded-xl overflow-hidden backdrop-blur-sm group"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${0.1 * idx}s, transform 0.5s ease ${0.1 * idx}s`,
              }}
            >
              {/* Gradient header */}
              <div className={`h-24 bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center`}>
                <span className="text-3xl font-bold text-white/20">{`0${idx + 1}`}</span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-cyan-300 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-xs bg-slate-700/50 text-cyan-300 rounded-full border border-slate-600/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  href={project.link}
                  className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  View Project <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
