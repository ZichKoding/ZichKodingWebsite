import { useState, useCallback, useRef, useEffect } from 'react';
import { TERMINAL_DATA, COMMANDS } from '@/data/terminal-data';

export type TerminalLineType = 'input' | 'output' | 'error' | 'success' | 'skill' | 'project' | 'career' | 'progress';

export interface TerminalLine {
  id: string;
  content: string;
  type: TerminalLineType;
  timestamp: number;
  data?: {
    skill?: { name: string; proficiency: number };
    project?: typeof TERMINAL_DATA.projects[0];
    career?: typeof TERMINAL_DATA.career[0];
    progress?: number;
  };
}

const generateSkillBar = (proficiency: number): string => {
  const filledLength = Math.round((proficiency / 100) * 20);
  const emptyLength = 20 - filledLength;
  return `[${Array(filledLength).fill('█').join('')}${Array(emptyLength).fill('░').join('')}] ${proficiency}%`;
};

export const useTerminal = (onNavigate?: (path: string) => void, onWarpNavigate?: (path: string) => void, onSectionScroll?: (section: string) => void) => {
  const [output, setOutput] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);
  const isUserInteracted = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = outputEndRef.current;
    if (el?.parentElement) {
      el.parentElement.scrollTop = el.parentElement.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (isUserInteracted.current) {
      scrollToBottom();
    }
  }, [output, scrollToBottom]);

  const addLine = useCallback(
    (content: string, type: TerminalLineType = 'output', data?: TerminalLine['data']) => {
      const id = `line-${idCounterRef.current++}`;
      setOutput((prev) => [...prev, { id, content, type, timestamp: Date.now(), data }]);
    },
    []
  );

  const addInputLine = useCallback((input: string) => {
    addLine(input, 'input');
  }, [addLine]);

  const processCommand = useCallback(
    (cmd: string) => {
      const trimmedCmd = cmd.trim().toLowerCase();

      if (!trimmedCmd) {
        return;
      }

      isUserInteracted.current = true;
      addInputLine(cmd);
      setCommandHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);

      // Split command for arguments
      const [command, ...args] = trimmedCmd.split(' ');

      switch (command) {
        case 'help': {
          addLine('Available commands:', 'success');
          COMMANDS.forEach((cmd) => {
            addLine(`  ${cmd.name.padEnd(15)} - ${cmd.description}`, 'output');
          });
          addLine('', 'output');
          addLine('Easter eggs available: sudo hire chris, matrix, quantum', 'output');
          break;
        }

        case 'about': {
          addLine(TERMINAL_DATA.about, 'output');
          onSectionScroll?.('about');
          break;
        }

        case 'skills': {
          addLine('Loading skills...', 'success');
          addLine('', 'output');

          Object.entries(TERMINAL_DATA.skills).forEach(([category, skills]) => {
            addLine(`\n${category.toUpperCase()}`, 'success');
            addLine('─'.repeat(50), 'output');
            skills.forEach((skill) => {
              const bar = generateSkillBar(skill.proficiency);
              addLine(`${skill.name.padEnd(20)} ${bar}`, 'skill', { skill });
            });
          });
          onSectionScroll?.('skills');
          break;
        }

        case 'projects': {
          addLine('Featured Projects', 'success');
          addLine('═'.repeat(50), 'output');

          TERMINAL_DATA.projects.forEach((project, idx) => {
            addLine(`\n[${idx + 1}] ${project.name}`, 'project');
            addLine(`    ${project.description}`, 'output');
            addLine(`    Tech: ${project.tech.join(', ')}`, 'output');
            addLine(`    Link: ${project.link}`, 'output');
          });
          onSectionScroll?.('projects');
          break;
        }

        case 'career': {
          addLine('Career Timeline', 'success');
          addLine('═'.repeat(50), 'output');

          TERMINAL_DATA.career.forEach((entry) => {
            addLine(`\n╠═ ${entry.period}`, 'career');
            addLine(`║  ${entry.role} @ ${entry.company}`, 'career');
            addLine(`╚═ ${entry.description}`, 'career');
          });
          onSectionScroll?.('career');
          break;
        }

        case 'contact': {
          addLine(TERMINAL_DATA.contactInfo, 'output');
          addLine('\n→ Use command: cd /contact', 'success');
          onSectionScroll?.('contact');
          break;
        }

        case 'resume': {
          addLine('Initializing resume download...', 'output');
          addLine('', 'output');

          // Simulate progress
          let progress = 0;
          const progressInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) progress = 100;

            addLine(
              `Downloading... [${generateSkillBar(Math.round(progress))}]`,
              'progress',
              { progress: Math.round(progress) }
            );

            if (progress >= 100) {
              clearInterval(progressInterval);
              addLine('', 'output');
              addLine('✓ Resume ready for download', 'success');
              addLine('📄 chris-portfolio-resume.pdf', 'output');
              addLine('→ Download link: /resume.pdf', 'output');
            }
          }, 300);
          break;
        }

        case 'blog': {
          addLine('Recent Blog Posts', 'success');
          addLine('═'.repeat(50), 'output');
          TERMINAL_DATA.blogPosts.forEach((post, idx) => {
            addLine(`\n[${idx + 1}] ${post.title}`, 'output');
            addLine(`    Published: ${post.date}`, 'output');
            addLine(`    Link: /blog/${post.slug}`, 'output');
          });
          addLine('\n→ View all posts at /blog', 'success');
          onSectionScroll?.('blog');
          break;
        }

        case 'ls': {
          addLine('total 9', 'output');
          addLine('drwxr-xr-x  1 chris  staff   32 Jan 10 10:42 about/', 'output');
          addLine('drwxr-xr-x  1 chris  staff   32 Jan 10 10:42 skills/', 'output');
          addLine('drwxr-xr-x  1 chris  staff   32 Jan 10 10:42 projects/', 'output');
          addLine('drwxr-xr-x  1 chris  staff   32 Jan 10 10:42 career/', 'output');
          addLine('drwxr-xr-x  1 chris  staff   32 Jan 10 10:42 contact/', 'output');
          addLine('drwxr-xr-x  1 chris  staff   32 Jan 10 10:42 blog/', 'output');
          addLine('drwxr-xr-x  1 chris  staff   32 Jan 10 10:42 home/', 'output');
          break;
        }

        case 'cd': {
          const dir = args[0];
          if (!dir) {
            addLine("usage: cd <directory>", 'error');
            break;
          }

          const directoryMap: { [key: string]: string } = {
            'blog': '/blog',
            'projects': '/projects',
            'contact': '/contact',
            'home': '/',
            '/': '/',
            '~': '/',
          };

          const path = directoryMap[dir];
          if (path) {
            if (onWarpNavigate) {
              addLine(`Initiating warp drive to ${dir}...`, 'success');
              onWarpNavigate(path);
            } else {
              addLine(`Navigating to ${dir}...`, 'success');
              setTimeout(() => {
                onNavigate?.(path);
              }, 300);
            }
          } else {
            addLine(`cd: no such directory: ${dir}`, 'error');
          }
          break;
        }

        case 'clear': {
          setOutput([]);
          break;
        }

        // Easter eggs
        case 'sudo': {
          if (args[0] === 'hire' && args[1] === 'chris') {
            addLine('Checking credentials...', 'output');
            addLine('✓ Access granted! 🚀', 'success');
            addLine('You have excellent taste! Redirecting to contact page...', 'success');
            if (onWarpNavigate) {
              onWarpNavigate('/contact');
            } else {
              setTimeout(() => {
                onNavigate?.('/contact');
              }, 500);
            }
          } else {
            addLine('sudo: permission denied', 'error');
          }
          break;
        }

        case 'matrix': {
          addLine('Initializing matrix sequence...', 'success');
          const matrixChars = '01ｦｬ';
          for (let i = 0; i < 10; i++) {
            let line = '';
            for (let j = 0; j < 40; j++) {
              line += matrixChars[Math.floor(Math.random() * matrixChars.length)];
            }
            addLine(line, 'output');
          }
          addLine('\n"There is no spoon..." 🥢', 'output');
          break;
        }

        case 'quantum': {
          addLine(
            'Observing quantum state... 🌌',
            'success'
          );
          addLine('Your skills are in superposition!', 'output');
          addLine('Collapsing wave function...\n', 'output');

          const allSkills: Array<{ name: string; proficiency: number }> = [];
          Object.values(TERMINAL_DATA.skills).forEach((categorySkills) => {
            allSkills.push(...categorySkills);
          });

          allSkills.sort(() => Math.random() - 0.5).slice(0, 8).forEach((skill, idx) => {
            setTimeout(() => {
              addLine(`✦ ${skill.name} (${skill.proficiency}%)`, 'success');
            }, idx * 150);
          });
          break;
        }

        default: {
          addLine(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
        }
      }
    },
    [addInputLine, addLine, onNavigate, onWarpNavigate, onSectionScroll]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (currentInput.trim()) {
          processCommand(currentInput);
          setCurrentInput('');
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCurrentInput('');
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const commands = COMMANDS.map((c) => c.name);
        const matchingCommands = commands.filter((c) =>
          c.startsWith(currentInput.toLowerCase())
        );

        if (matchingCommands.length === 1) {
          setCurrentInput(matchingCommands[0]);
        } else if (matchingCommands.length > 1) {
          addLine(`\nMatching commands:`, 'output');
          matchingCommands.forEach((c) => {
            addLine(`  ${c}`, 'output');
          });
        }
      }
    },
    [currentInput, historyIndex, commandHistory, processCommand, addLine]
  );

  const initializeTerminal = useCallback(() => {
    addLine('$ Initializing ZichKoding Portfolio...', 'output');
    addLine('', 'output');

    // Simulate loading
    const stages = [
      { text: '> Loading quantum state...', progress: 100 },
      { text: '> Synchronizing stellar database...', progress: 100 },
      { text: '> Calibrating neural interface...', progress: 100 },
    ];

    stages.forEach((stage, idx) => {
      setTimeout(() => {
        addLine(stage.text + ` ${'█'.repeat(12)} ${stage.progress}%`, 'output');
      }, idx * 400);
    });

    setTimeout(() => {
      addLine('', 'output');
      addLine('✓ Welcome to Chris\'s Portfolio Terminal', 'success');
      addLine('Type \'help\' to see available commands, or click a suggestion below.', 'output');
      addLine('', 'output');
    }, 1600);
  }, [addLine]);

  return {
    output,
    currentInput,
    setCurrentInput,
    commandHistory,
    historyIndex,
    isTyping,
    setIsTyping,
    processCommand,
    handleKeyDown,
    initializeTerminal,
    outputEndRef,
    addLine,
  };
};
