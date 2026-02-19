'use client';

import React, { useEffect, useState } from 'react';
import { TerminalLine, TerminalLineType } from '@/hooks/useTerminal';

interface TerminalOutputProps {
  lines: TerminalLine[];
  outputEndRef: React.RefObject<HTMLDivElement | null>;
}

const getTypeStyles = (type: TerminalLineType): string => {
  const baseStyle = 'font-mono text-sm leading-relaxed';
  const typeStyles: { [key in TerminalLineType]: string } = {
    input: `${baseStyle} text-cyan-400 font-semibold`,
    output: `${baseStyle} text-gray-300`,
    error: `${baseStyle} text-red-400`,
    success: `${baseStyle} text-green-400 font-semibold`,
    skill: `${baseStyle} text-emerald-300`,
    project: `${baseStyle} text-blue-300 font-semibold`,
    career: `${baseStyle} text-purple-300`,
    progress: `${baseStyle} text-yellow-300`,
  };
  return typeStyles[type];
};

const TypingAnimation: React.FC<{ text: string; type: TerminalLineType }> = ({ text, type }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const chars = text.split('');
    let index = 0;

    const interval = setInterval(() => {
      if (index < chars.length) {
        setDisplayedText((prev) => prev + chars[index]);
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 5);

    return () => clearInterval(interval);
  }, [text, isComplete]);

  return <span>{displayedText}</span>;
};

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ lines, outputEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-blue-600">
      {lines.length === 0 && (
        <div className="text-gray-500 text-center py-8">
          <p>Terminal initialized. Type a command to begin...</p>
        </div>
      )}

      {lines.map((line) => (
        <div key={line.id} className={getTypeStyles(line.type)}>
          {line.type === 'input' && <span>{'visitor@zichkoding:~$ '}</span>}

          {line.type === 'skill' && line.data?.skill && (
            <div className="flex items-center justify-between gap-4">
              <span className="min-w-fit">{line.data.skill.name}</span>
              <code>{line.content}</code>
            </div>
          )}

          {line.type === 'progress' && (
            <div>
              <TypingAnimation text={line.content} type={line.type} />
            </div>
          )}

          {line.type === 'project' && (
            <div className="bg-blue-900 bg-opacity-20 p-2 rounded border border-blue-500 border-opacity-30 my-1">
              <div>{line.content}</div>
            </div>
          )}

          {line.type === 'career' && (
            <div className="pl-2 border-l border-purple-400 border-opacity-40">
              {line.content}
            </div>
          )}

          {!['skill', 'project', 'career', 'progress'].includes(line.type) && (
            <span>{line.content}</span>
          )}
        </div>
      ))}

      <div ref={outputEndRef} />
    </div>
  );
};
