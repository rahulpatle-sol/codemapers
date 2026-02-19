"use client";
import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface TerminalProps {
  onData: (data: string) => void;
  onMount: (term: XTerm) => void; // ✅ Add this
}

export default function Terminal({ onData, onMount }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      theme: { background: '#080808', foreground: '#ffffff' },
      fontSize: 12,
      fontFamily: 'Fira Code, monospace',
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    term.onData(onData);
    onMount(term); // ✅ Parent ko terminal ka control de do

    termRef.current = term;
    return () => term.dispose();
  }, []);

  return <div ref={terminalRef} className="h-full w-full" />;
}