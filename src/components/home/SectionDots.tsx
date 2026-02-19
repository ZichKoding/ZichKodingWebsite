'use client';

import React, { useState } from 'react';

interface SectionDotsProps {
  sections: string[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export function SectionDots({ sections, activeIndex, onNavigate }: SectionDotsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-3"
      role="navigation"
      aria-label="Section navigation"
    >
      {sections.map((name, idx) => (
        <button
          key={name}
          onClick={() => onNavigate(idx)}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="flex items-center gap-2 group cursor-pointer"
          aria-label={`Navigate to ${name} section`}
          aria-current={idx === activeIndex ? 'true' : undefined}
        >
          {/* Label (visible on hover) */}
          <span
            className="text-xs font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none"
            style={{ opacity: hoveredIndex === idx ? 1 : 0 }}
          >
            {name}
          </span>

          {/* Dot */}
          <span
            className={`block rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? 'w-3 h-3 bg-cyan-400 shadow-lg shadow-cyan-500/40'
                : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
