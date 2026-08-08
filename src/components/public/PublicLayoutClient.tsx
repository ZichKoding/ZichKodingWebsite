'use client';

import React from 'react';
import { TerminalProvider, type RecentPost } from '@/contexts/TerminalContext';
import { TerminalBubble } from '@/components/public/TerminalBubble';

export function PublicLayoutClient({
  children,
  recentPosts,
}: {
  children: React.ReactNode;
  recentPosts: RecentPost[];
}) {
  return (
    <TerminalProvider recentPosts={recentPosts}>
      {children}
      <TerminalBubble />
    </TerminalProvider>
  );
}
