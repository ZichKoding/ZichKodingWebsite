'use client';

import React from 'react';
import { Mail, Github, Linkedin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ContactSectionProps {
  isActive: boolean;
}

const contactItems = [
  {
    icon: Mail,
    label: 'Email',
    value: 'chris.zichko@zichkoding.com',
    href: 'mailto:chris.zichko@zichkoding.com',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/ZichKoding',
    href: 'https://github.com/ZichKoding',
    color: 'text-gray-300',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Chris Zichko',
    href: 'https://linkedin.com/in/chris-zichko-264b25217/',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
];

export function ContactSection({ isActive }: ContactSectionProps) {
  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-8 overflow-y-auto">
      <div className="max-w-3xl w-full mx-auto my-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Get In Touch
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {contactItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.label !== 'Email' ? '_blank' : undefined}
                rel={item.label !== 'Email' ? 'noopener noreferrer' : undefined}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl ${item.bg} border ${item.border} backdrop-blur-sm hover:scale-105 transition-transform`}
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.5s ease ${0.1 * idx}s, transform 0.5s ease ${0.1 * idx}s`,
                }}
              >
                <Icon className={`w-8 h-8 ${item.color}`} />
                <span className="text-sm font-medium text-gray-300">{item.label}</span>
                <span className="text-xs text-gray-500 text-center">{item.value}</span>
              </a>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all text-sm font-medium"
          >
            Send a Message <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
