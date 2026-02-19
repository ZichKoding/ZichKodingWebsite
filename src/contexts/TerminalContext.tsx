'use client';

import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTerminal, TerminalLine } from '@/hooks/useTerminal';
import { StarfieldHandle } from '@/components/home/Starfield';

interface TerminalContextValue {
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

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isOnHomepage = pathname === '/';
  const [isMinimized, setIsMinimized] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
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
    onSectionScroll
  );

  const wrappedInitialize = useCallback(() => {
    if (!isInitialized) {
      terminal.initializeTerminal();
      setIsInitialized(true);
    }
  }, [isInitialized, terminal]);

  const minimize = useCallback(() => setIsMinimized(true), []);
  const expand = useCallback(() => setIsMinimized(false), []);

  return (
    <TerminalContext.Provider
      value={{
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
      {children}
    </TerminalContext.Provider>
  );
}
