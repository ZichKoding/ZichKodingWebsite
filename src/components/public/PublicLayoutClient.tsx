'use client';

import React from 'react';
import { TerminalProvider } from '@/contexts/TerminalContext';
import { TerminalBubble } from '@/components/public/TerminalBubble';

export function PublicLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <TerminalProvider>
      {children}
      <TerminalBubble />
    </TerminalProvider>
  );
}
