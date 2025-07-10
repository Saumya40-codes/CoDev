'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './terminal.module.css'
import { TypeAnimation } from 'react-type-animation';
import { useAppSelector, useAppDispatch } from '@/app/lib/redux/hooks';
import { ChevronRight, Copy, Trash2, Download, Maximize, Minimize, Minus } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'warning' | 'info';
  content: string;
  timestamp: Date;
  command?: string;
}

const Terminal = () => {
  const currentFile = useAppSelector((state) => state?.file.currentFile);
  const output = useAppSelector((state) => state?.file?.output);
  const projectName = useAppSelector((state) => state?.project?.projectName);
  const dispatch = useAppDispatch();
  
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('~/project');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, []);

  // Initialize terminal with welcome message
  useEffect(() => {
    const welcomeLines: TerminalLine[] = [
      {
        id: 'welcome-1',
        type: 'success',
        content: '🚀 Welcome to COdev Terminal v2.0',
        timestamp: new Date(),
      },
      {
        id: 'welcome-2',
        type: 'info',
        content: `Connected to project: ${projectName || 'Untitled Project'}`,
        timestamp: new Date(),
      },
      {
        id: 'welcome-3',
        type: 'info',
        content: 'Type "help" for available commands',
        timestamp: new Date(),
      },
    ];
    
    setLines(welcomeLines);
  }, [projectName]);

  // Handle output from Redux
  useEffect(() => {
    if (currentFile && output[currentFile]) {
      const newLine: TerminalLine = {
        id: `output-${Date.now()}`,
        type: 'output',
        content: output[currentFile],
        timestamp: new Date(),
      };
      
      setLines(prev => [...prev, newLine]);
    }
  }, [currentFile, output]);

  // Scroll to bottom when lines change
  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    if (inputRef.current && !isMinimized) {
      inputRef.current.focus();
    }
  };

  // Handle command execution
  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Add input line
    const inputLine: TerminalLine = {
      id: `input-${Date.now()}`,
      type: 'input',
      content: command,
      timestamp: new Date(),
      command: command,
    };

    setLines(prev => [...prev, inputLine]);
    setCurrentInput('');
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Process command
    const result = await processCommand(command);
    
    if (result) {
      const outputLine: TerminalLine = {
        id: `output-${Date.now()}`,
        type: result.type,
        content: result.content,
        timestamp: new Date(),
      };
      
      setLines(prev => [...prev, outputLine]);
    }

    setIsProcessing(false);
  };

  // Command processor
  const processCommand = async (command: string): Promise<{ type: TerminalLine['type'], content: string } | null> => {
    const cmd = command.trim().toLowerCase();
    const args = command.split(' ').slice(1);

    switch (cmd.split(' ')[0]) {
      case 'help':
        return {
          type: 'info',
          content: `Available commands:
• help - Show this help message
• clear - Clear terminal
• ls - List files in current directory
• pwd - Print working directory
• cd [dir] - Change directory
• cat [file] - Display file contents
• echo [text] - Display text
• date - Show current date and time
• whoami - Show current user
• version - Show terminal version
• run [file] - Execute current file
• npm [args] - Run npm commands
• git [args] - Run git commands`
        };
      
      case 'clear':
        setLines([]);
        return null;
      
      case 'ls':
        return {
          type: 'output',
          content: `📁 src/
📁 public/
📁 node_modules/
📄 package.json
📄 README.md
📄 ${currentFile || 'index.js'}`
        };
      
      case 'pwd':
        return {
          type: 'output',
          content: currentDirectory
        };
      
      case 'cd':
        const newDir = args[0] || '~';
        setCurrentDirectory(newDir === '~' ? '~/project' : `~/project/${newDir}`);
        return {
          type: 'success',
          content: `Changed directory to ${newDir}`
        };
      
      case 'cat':
        if (!args[0]) {
          return {
            type: 'error',
            content: 'cat: missing file operand'
          };
        }
        return {
          type: 'output',
          content: `Content of ${args[0]}:\n${currentFile && output[currentFile] ? output[currentFile] : 'File not found or empty'}`
        };
      
      case 'echo':
        return {
          type: 'output',
          content: args.join(' ')
        };
      
      case 'date':
        return {
          type: 'output',
          content: new Date().toLocaleString()
        };
      
      case 'whoami':
        return {
          type: 'output',
          content: 'developer'
        };
      
      case 'version':
        return {
          type: 'info',
          content: 'COdev Terminal v2.0.0 - Enhanced Developer Experience'
        };
      
      case 'run':
        if (!currentFile) {
          return {
            type: 'error',
            content: 'No file selected to run'
          };
        }
        return {
          type: 'warning',
          content: `Executing ${currentFile}... (This would run your code)`
        };
      
      case 'npm':
        return {
          type: 'info',
          content: `npm ${args.join(' ')} - Command would be executed in production environment`
        };
      
      case 'git':
        return {
          type: 'info',
          content: `git ${args.join(' ')} - Git command would be executed`
        };
      
      default:
        return {
          type: 'error',
          content: `Command not found: ${cmd.split(' ')[0]}. Type 'help' for available commands.`
        };
    }
  };

  // Handle input key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic tab completion
      const commands = ['help', 'clear', 'ls', 'pwd', 'cd', 'cat', 'echo', 'date', 'whoami', 'version', 'run', 'npm', 'git'];
      const matches = commands.filter(cmd => cmd.startsWith(currentInput.toLowerCase()));
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      }
    }
  };

  // Copy line content
  const copyLine = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // Export terminal history
  const exportHistory = () => {
    const history = lines.map(line => 
      `[${line.timestamp.toLocaleTimeString()}] ${line.type.toUpperCase()}: ${line.content}`
    ).join('\n');
    
    const blob = new Blob([history], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-history-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear terminal
  const clearTerminal = () => {
    setLines([]);
  };

  // Toggle minimize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get line icon
  const getLineIcon = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return '❯';
      case 'output': return '📄';
      case 'error': return '❌';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '•';
    }
  };

  return (
    <div className={`${styles.terminal} ${isMinimized ? styles.minimized : ''} ${isFullscreen ? styles.fullscreen : ''}`}>
      {/* Terminal Header */}
      <div className={styles.terminalHeader}>
        <div className={styles.terminalTitle}>
          <div className={styles.terminalDots}>
            <div className={`${styles.dot} ${styles.red}`}></div>
            <div className={`${styles.dot} ${styles.yellow}`}></div>
            <div className={`${styles.dot} ${styles.green}`}></div>
          </div>
          <span className={styles.titleText}>COdev Terminal</span>
        </div>
        
        <div className={styles.terminalControls}>
          <button 
            className={styles.controlBtn}
            onClick={clearTerminal}
            title="Clear terminal"
          >
            <Trash2 size={16} />
          </button>
          <button 
            className={styles.controlBtn}
            onClick={exportHistory}
            title="Export history"
          >
            <Download size={16} />
          </button>
          <button 
            className={styles.controlBtn}
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          <button 
            className={styles.controlBtn}
            onClick={toggleMinimize}
            title={isMinimized ? "Restore" : "Minimize"}
          >
            {isMinimized ? '◻' : <Minus size={16} />}
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      {!isMinimized && (
        <div 
          className={styles.terminalContent}
          ref={contentRef}
          onClick={handleTerminalClick}
        >
          {/* Terminal Lines */}
          <div className={styles.terminalLines}>
            {lines.map((line) => (
              <div key={line.id} className={`${styles.terminalLine} ${styles[line.type]}`}>
                <div className={styles.lineHeader}>
                  <span className={styles.lineIcon}>{getLineIcon(line.type)}</span>
                  <span className={styles.lineTime}>{formatTime(line.timestamp)}</span>
                  <button 
                    className={styles.copyBtn}
                    onClick={() => copyLine(line.content)}
                    title="Copy line"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <div className={styles.lineContent}>
                  {line.type === 'input' ? (
                    <div className={styles.inputLine}>
                      <span className={styles.prompt}>
                        {currentDirectory} <ChevronRight size={14} />
                      </span>
                      <span className={styles.command}>{line.content}</span>
                    </div>
                  ) : (
                    <TypeAnimation
                      key={line.id}
                      sequence={[line.content]}
                      speed={80}
                      style={{ 
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}
                      cursor={false}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Current Input */}
          <div className={styles.inputContainer}>
            <div className={styles.inputLine}>
              <span className={styles.prompt}>
                {currentDirectory} <ChevronRight size={14} />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.terminalInput}
                placeholder={isProcessing ? "Processing..." : "Type a command..."}
                disabled={isProcessing}
                autoFocus
              />
              {isProcessing && (
                <div className={styles.loadingSpinner}>
                  <div className={styles.spinner}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusText}>
            Lines: {lines.length} | History: {commandHistory.length}
          </span>
        </div>
        <div className={styles.statusRight}>
          <span className={styles.statusText}>
            {currentDirectory}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
