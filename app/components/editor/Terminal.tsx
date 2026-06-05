"use client";
import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface TerminalProps {
  onData: (data: string) => void;
  onMount: (term: XTerm) => void;
}

const WELCOME = [
  '',
  '\x1b[1;32m CodeMapers Terminal \x1b[0m',
  '\x1b[2;90m ──────────────────────────────────────────────── \x1b[0m',
  '\x1b[1;33m ls \x1b[0m\x1b[90m - list files\x1b[0m         \x1b[1;33m cd \x1b[0m\x1b[90m - change directory\x1b[0m',
  '\x1b[1;33m mkdir \x1b[0m\x1b[90m - create folder\x1b[0m     \x1b[1;33m cat \x1b[0m\x1b[90m - view file\x1b[0m',
  '\x1b[1;33m npm \x1b[0m\x1b[90m - install packages\x1b[0m    \x1b[1;33m node \x1b[0m\x1b[90m - run scripts\x1b[0m',
  '\x1b[2;90m ──────────────────────────────────────────────── \x1b[0m',
  '',
];

export default function Terminal({ onData, onMount }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const welcomed = useRef(false);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      theme: { background: '#080808', foreground: '#e0e0e0', cursor: '#6366f1', selectionBackground: '#6366f133' },
      fontSize: 13,
      fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
      allowTransparency: true,
      scrollback: 5000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    if (!welcomed.current) {
      welcomed.current = true;
      WELCOME.forEach(l => term.writeln(l));
    }

    term.onData(onData);
    onMount(term);

    // Auto-fit on resize
    const ro = new ResizeObserver(() => {
      try { fitAddon.fit(); } catch {}
    });
    ro.observe(terminalRef.current);

    termRef.current = term;
    return () => { ro.disconnect(); term.dispose(); };
  }, []);

  return <div ref={terminalRef} className="h-full w-full" />;
}