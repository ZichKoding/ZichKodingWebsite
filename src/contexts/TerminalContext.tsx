'use client';

import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTerminal, TerminalLine } from '@/hooks/useTerminal';
import { Starfield, StarfieldHandle } from '@/components/home/Starfield';

export interface RecentPost {
  slug: string;
  title: string;
  date: string;
}

interface TerminalContextValue {
  recentPosts: RecentPost[];
  output: TerminalLine[];
  currentInput: string;
  setCurrentInput: (val: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  processCommand: (cmd: string) => void;
  initializeTerminal: () => void;
  outputEndRef: React.RefObject<HTMLDivElement | null>;
  isMinimized: boolean;
  minimize: () => void;
  expand: () => void;
  isOnHomepage: boolean;
  starfieldRef: React.RefObject<StarfieldHandle | null>;
  isInitialized: boolean;
  pendingSectionScroll: string | null;
  clearPendingSectionScroll: () => void;
}

const TerminalContext = createContext<TerminalContextValue | null>(null);

export function useTerminalContext() {
  const ctx = useContext(TerminalContext);
  if (!ctx) {
    throw new Error('useTerminalContext must be used within TerminalProvider');
  }
  return ctx;
}

export function TerminalProvider({
  children,
  recentPosts = [],
}: {
  children: React.ReactNode;
  recentPosts?: RecentPost[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isOnHomepage = pathname === '/';
  // Expanded on the home page (it IS the home experience); minimized elsewhere
  // so it never covers page content on a direct load of /blog, /projects, etc.
  const [isMinimized, setIsMinimized] = useState(pathname !== '/');

  // Minimize on route change away from home (render-phase adjustment — the
  // React docs' "storing information from previous renders" pattern).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (pathname !== '/' && !isMinimized) {
      setIsMinimized(true);
    }
  }
  const [isInitialized, setIsInitialized] = useState(false);
  // Ref guard: state updates don't flush fast enough to stop React 19
  // StrictMode's double-effect from initializing twice.
  const hasInitializedRef = useRef(false);
  const [pendingSectionScroll, setPendingSectionScroll] = useState<string | null>(null);
  const starfieldRef = useRef<StarfieldHandle>(null);

  const clearPendingSectionScroll = useCallback(() => setPendingSectionScroll(null), []);

  const onSectionScroll = useCallback(
    (section: string) => {
      if (isOnHomepage) {
        setPendingSectionScroll(section);
      }
    },
    [isOnHomepage]
  );

  const onWarpNavigate = useCallback(
    (path: string) => {
      starfieldRef.current?.triggerWarp(1500);
      setTimeout(() => {
        router.push(path);
        setIsMinimized(true);
      }, 1200);
    },
    [router]
  );

  const terminal = useTerminal(
    (path: string) => router.push(path),
    onWarpNavigate,
    onSectionScroll,
    recentPosts
  );

  const wrappedInitialize = useCallback(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      terminal.initializeTerminal();
      setIsInitialized(true);
    }
  }, [terminal]);

  const minimize = useCallback(() => setIsMinimized(true), []);
  const expand = useCallback(() => setIsMinimized(false), []);

  return (
    <TerminalContext.Provider
      value={{
        recentPosts,
        output: terminal.output,
        currentInput: terminal.currentInput,
        setCurrentInput: terminal.setCurrentInput,
        handleKeyDown: terminal.handleKeyDown,
        processCommand: terminal.processCommand,
        initializeTerminal: wrappedInitialize,
        outputEndRef: terminal.outputEndRef,
        isMinimized,
        minimize,
        expand,
        isOnHomepage,
        starfieldRef,
        isInitialized,
        pendingSectionScroll,
        clearPendingSectionScroll,
      }}
    >
      {/* Site-wide animated starfield (fixed, z-0, honors prefers-reduced-motion).
          Rendered here, where the warp ref lives, so terminal warp navigation
          animates it on every public page. */}
      <Starfield ref={starfieldRef} />
      {children}
    </TerminalContext.Provider>
  );
}
