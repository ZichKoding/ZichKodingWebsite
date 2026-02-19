'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Starfield } from './Starfield';
import { TerminalOutput } from './TerminalOutput';
import { useTerminalContext } from '@/contexts/TerminalContext';

const QUICK_COMMANDS = ['about', 'skills', 'projects', 'career', 'contact'];

const DEFAULT_REM = 22;
const MD_REM = 26;
const MIN_REM = 12.5;

export const SpaceTerminal: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState<number | null>(null);
  const isDragging = useRef(false);

  const ctx = useTerminalContext();

  // Compute initial height from rem values
  useEffect(() => {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    const isMd = window.matchMedia('(min-width: 768px)').matches;
    setTerminalHeight((isMd ? MD_REM : DEFAULT_REM) * rootFontSize);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || !terminalRef.current) return;
      const terminalTop = terminalRef.current.getBoundingClientRect().top;
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      const minPx = MIN_REM * rootFontSize;
      const maxPx = window.innerHeight * 0.8;
      const newHeight = Math.min(maxPx, Math.max(minPx, e.clientY - terminalTop));
      setTerminalHeight(newHeight);
    },
    []
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  useEffect(() => {
    ctx.initializeTerminal();

    // Show tooltip after init completes
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 2200);

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 5500);

    return () => {
      clearTimeout(tooltipTimer);
      clearTimeout(hideTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const handleQuickCommand = (cmd: string) => {
    setShowTooltip(false);
    ctx.setCurrentInput(cmd);
    setTimeout(() => {
      ctx.processCommand(cmd);
      ctx.setCurrentInput('');
      inputRef.current?.focus();
    }, 50);
  };

  // When minimized, only show the starfield background
  if (ctx.isMinimized) {
    return (
      <div className="relative w-full flex-1 flex flex-col bg-black overflow-hidden">
        <Starfield ref={ctx.starfieldRef} />
      </div>
    );
  }

  return (
    <div className="relative w-full flex-1 flex flex-col bg-black overflow-hidden">
      {/* Starfield Background */}
      <Starfield ref={ctx.starfieldRef} />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-8 flex-1">
        <div
          ref={terminalRef}
          className="w-full max-w-3xl flex flex-col rounded-lg border border-cyan-500 border-opacity-30 bg-gray-950 bg-opacity-80 backdrop-blur-md shadow-2xl shadow-cyan-500/20 overflow-hidden"
          style={{ height: terminalHeight ?? undefined }}
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-cyan-500 border-opacity-20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
              <button
                onClick={ctx.minimize}
                className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50 hover:brightness-125 transition cursor-pointer"
                aria-label="Minimize terminal"
              />
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
            </div>
            <span className="text-sm text-cyan-400 font-mono font-semibold tracking-wider">
              chris@zichkoding ~ $
            </span>
            <div className="w-8" />
          </div>

          {/* Terminal Output */}
          <TerminalOutput
            lines={ctx.output}
            outputEndRef={ctx.outputEndRef}
          />

          {/* Terminal Input */}
          <div className="relative px-4 py-3 bg-gray-950 border-t border-cyan-500 border-opacity-20">
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs text-cyan-300 bg-gray-900 border border-cyan-500/30 rounded-md whitespace-nowrap animate-pulse z-20">
                Type a command or click a suggestion below
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-cyan-500/30 rotate-45 -mt-1" />
              </div>
            )}
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-cyan-400">visitor@zichkoding:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={ctx.currentInput}
                onChange={(e) => ctx.setCurrentInput(e.target.value)}
                onKeyDown={(e) => {
                  setShowTooltip(false);
                  ctx.handleKeyDown(e);
                }}
                onFocus={() => setShowTooltip(false)}
                placeholder="Type 'help' to get started..."
                className="flex-1 bg-transparent text-gray-100 outline-none placeholder-gray-600 caret-cyan-400"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />
              <span
                className="w-1 h-5 bg-cyan-400 animate-pulse"
                style={{
                  boxShadow: '0 0 10px rgba(34, 211, 238, 0.7)',
                }}
              />
            </div>
          </div>

          {/* Resize Handle */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="h-1.5 cursor-row-resize flex items-center justify-center bg-gray-900 border-t border-cyan-500/20 hover:bg-gray-800 transition-colors touch-none select-none"
            aria-label="Drag to resize terminal"
          >
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-cyan-500/40" />
              <div className="w-1 h-1 rounded-full bg-cyan-500/40" />
              <div className="w-1 h-1 rounded-full bg-cyan-500/40" />
            </div>
          </div>
        </div>

        {/* Quick Command Suggestions */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center max-w-3xl px-4">
          <span className="text-gray-400 text-sm w-full text-center mb-2">
            Quick commands:
          </span>
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleQuickCommand(cmd)}
              className="px-3 py-1.5 text-xs font-mono bg-cyan-900 bg-opacity-30 border border-cyan-500 border-opacity-40 text-cyan-300 rounded hover:bg-cyan-900 hover:bg-opacity-50 hover:border-cyan-400 hover:text-cyan-200 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
            >
              {cmd}
            </button>
          ))}
          <button
            onClick={() => handleQuickCommand('help')}
            className="px-3 py-1.5 text-xs font-mono bg-green-900 bg-opacity-30 border border-green-500 border-opacity-40 text-green-300 rounded hover:bg-green-900 hover:bg-opacity-50 hover:border-green-400 hover:text-green-200 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20 cursor-pointer"
          >
            help
          </button>
        </div>

        {/* Hint Text */}
        <div className="mt-12 text-center text-gray-500 text-xs max-w-2xl px-4">
          <p className="mb-3">Navigating the ZichKoding Terminal</p>
          <p className="text-gray-600">
            Use keyboard arrows to navigate command history · Press Tab for auto-complete · Type <code className="bg-gray-900 px-1 rounded">sudo hire chris</code> for a surprise
          </p>
        </div>
      </div>

      {/* Accessibility: Screen reader content */}
      <div className="sr-only">
        <h1>Chris&apos;s Portfolio Terminal</h1>
        <p>Interactive terminal interface showcasing Chris&apos;s portfolio</p>
        <p>
          Commands available: about, skills, projects, career, contact, resume, blog, clear, ls, cd, help
        </p>
        {ctx.output.map((line) => (
          <p key={line.id}>{line.content}</p>
        ))}
      </div>
    </div>
  );
};
