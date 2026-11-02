'use client';

import React from 'react';
import Image from 'next/image';
import { TERMINAL_DATA } from '@/data/terminal-data';
import { GraduationCap, Shield, Server, Briefcase } from 'lucide-react';

interface AboutSectionProps {
  isActive: boolean;
}

const highlights = [
  { icon: Server, label: 'Lead Developer & Technology Manager @ ARA' },
  { icon: Shield, label: 'U.S. Marine Corps Veteran' },
  { icon: Briefcase, label: 'Freelance via ZichKoding since 2021' },
  { icon: GraduationCap, label: 'UCF Certified Full-Stack Developer' },
];

export function AboutSection({ isActive }: AboutSectionProps) {
  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-8 overflow-y-auto">
      <div className="max-w-3xl w-full mx-auto my-auto">
        <div className="bg-black/50 border border-brand-olive/40 rounded-2xl p-6 sm:p-10 backdrop-blur-sm">
          <video
            className="brand-loop mx-auto mb-6"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src="/brand/brand-animation.webm" type="video/webm" />
          </video>
          <Image
            src="/brand/logo.png"
            alt="ZichKoding"
            width={1555}
            height={493}
            className="brand-still mx-auto mb-6 h-auto w-full max-w-md"
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-center">
            <span className="text-brand-olive">Chris Zichko</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-6 text-center">
            {TERMINAL_DATA.aboutTagline}
          </p>

          {/* Bio */}
          <div className="space-y-4 mb-8">
            {TERMINAL_DATA.aboutParagraphs.map((paragraph, i) => (
              <p key={i} className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {paragraph}
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
                  <Icon className="w-5 h-5 text-brand-copper shrink-0" />
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
