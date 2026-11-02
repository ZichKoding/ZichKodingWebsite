'use client';

import React, { useRef, useEffect } from 'react';
import { Terminal, Minus } from 'lucide-react';
import { useTerminalContext } from '@/contexts/TerminalContext';
import { TerminalOutput } from '@/components/home/TerminalOutput';

const QUICK_COMMANDS = ['help', 'about', 'how-i-work', 'projects', 'contact'];

export function TerminalBubble() {
  const ctx = useTerminalContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleQuickCommand = (cmd: string) => {
    ctx.processCommand(cmd);
    inputRef.current?.focus({ preventScroll: true });
  };

  // Hooks must always run — never place them after an early return
  useEffect(() => {
    if (!ctx.isMinimized && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [ctx.isMinimized]);

  if (ctx.isMinimized) {
    return (
      <button
        onClick={ctx.expand}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gray-900 border border-brand-copper/40 flex items-center justify-center shadow-lg shadow-brand-copper/20 hover:shadow-brand-copper/30 hover:border-brand-copper transition-all duration-300 group cursor-pointer"
        aria-label="Open terminal"
      >
        <Terminal className="w-6 h-6 text-brand-copper group-hover:text-brand-copper-bright transition-colors" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </button>
    );
  }

  // Expanded floating panel (only shown on non-homepage pages)
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-[600px] h-[500px] flex flex-col rounded-lg border border-brand-copper/30 bg-gray-950/95 backdrop-blur-md shadow-2xl shadow-brand-copper/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-brand-olive/40 shrink-0">
        <div className="flex gap-2">
          <button
            onClick={ctx.minimize}
            className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50 hover:brightness-125 transition cursor-pointer"
            aria-label="Minimize terminal"
          />
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
        </div>
        <span className="text-xs text-brand-copper font-mono font-semibold tracking-wider">
          chris@zichkoding ~ $
        </span>
        <button
          onClick={ctx.minimize}
          className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          aria-label="Minimize terminal"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Output */}
      <TerminalOutput
        lines={ctx.output}
        outputEndRef={ctx.outputEndRef}
      />

      {/* Quick command suggestions */}
      <div className="px-4 py-2 bg-gray-950 border-t border-brand-olive/40 shrink-0 flex flex-wrap gap-1.5">
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleQuickCommand(cmd)}
            className="px-2 py-1 text-[11px] font-mono bg-brand-copper/10 border border-brand-copper/40 text-brand-copper-bright rounded hover:bg-brand-copper/20 hover:border-brand-copper hover:text-brand-copper-bright transition-all duration-200 cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-2.5 bg-gray-950 border-t border-brand-olive/40 shrink-0">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-brand-copper text-xs">visitor@zichkoding:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={ctx.currentInput}
            onChange={(e) => ctx.setCurrentInput(e.target.value)}
            onKeyDown={ctx.handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-gray-100 outline-none placeholder-gray-600 caret-brand-copper text-sm"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
