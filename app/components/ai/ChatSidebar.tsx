"use client";
import { useState, useEffect, useRef } from 'react';
import { Send, Key, Code, Terminal, FileEdit, Sparkles, Loader2, Paperclip } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  actions?: { type: 'write_file' | 'run_command'; path?: string; command?: string }[];
}

export default function ChatSidebar({ projectId, onAction, currentFiles, projectType }: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [thinking, setThinking] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("groq_api_key");
    if (saved) setApiKey(saved);
  }, []);

  useEffect(() => {
    const loadChat = async () => {
      setMessages([]);
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      if (data.project?.chat_history) setMessages(data.project.chat_history);
    };
    if (projectId) loadChat();
  }, [projectId]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, thinking]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        const msg = `[Uploaded ${file.name}](/${data.url}) — use it as: \`<img src="${data.url}" />\``;
        setInput(prev => prev + (prev ? '\n' : '') + msg);
      }
    } catch (err) { console.error(err); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const saveApiKey = () => {
    localStorage.setItem("groq_api_key", apiKey);
    setShowApiKey(false);
  };

  const sendMessage = async () => {
    if (!input || isLoading) return;
    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInput("");
    setThinking("Analyzing your request...");

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, history: messages, currentFiles, projectType, apiKey: apiKey || undefined }),
      });
      const data = await res.json();

      setThinking("Writing files...");
      if (data.files) {
        for (const f of data.files) {
          await onAction({ type: 'WRITE_FILE', path: f.path, content: f.content });
        }
      }

      if (data.commands) {
        setThinking("Running commands...");
        for (const c of data.commands) {
          await onAction({ type: 'RUN_COMMAND', command: c });
        }
      }

      const botActions = [
        ...(data.files || []).map((f: any) => ({ type: 'write_file' as const, path: f.path })),
        ...(data.commands || []).map((c: string) => ({ type: 'run_command' as const, command: c })),
      ];

      const botMsg: Message = { role: 'assistant', text: data.message, actions: botActions };
      const newHistory = [...messages, userMsg, botMsg];
      setMessages(newHistory);

      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_history: newHistory }),
      });
    } catch (e) { console.error(e); } finally { setIsLoading(false); setThinking(null); }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-zinc-300">
      {/* ─── Header ─── */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-[#222] shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-indigo-400" />
          <span className="text-[10px] font-semibold text-indigo-400 tracking-wide">Agent</span>
        </div>
        <button onClick={() => setShowApiKey(!showApiKey)} className="text-zinc-600 hover:text-zinc-300 transition-colors">
          <Key size={12} />
        </button>
      </div>

      {/* ─── API Key ─── */}
      {showApiKey && (
        <div className="px-3 py-2 border-b border-[#222] bg-black/30">
          <div className="flex gap-1.5">
            <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} type="password" placeholder="gsk_..." className="flex-1 bg-black border border-[#333] rounded px-2 py-1 text-[10px] font-mono text-white outline-none focus:border-indigo-500" />
            <button onClick={saveApiKey} className="px-2 rounded bg-indigo-600 text-white text-[9px] font-semibold">Save</button>
          </div>
        </div>
      )}

      {/* ─── Messages ─── */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-700 px-6 text-center">
            <Sparkles size={24} className="mb-3 text-zinc-600" />
            <p className="text-xs text-zinc-600">Ask the agent to build components, write code, or run commands.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className="px-3 py-3 border-b border-[#1a1a1a] last:border-0">
            {m.role === 'user' ? (
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded bg-indigo-600/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[8px] text-indigo-400 font-bold">U</span>
                </div>
                <p className="text-[12px] text-white leading-relaxed">{m.text}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={10} className="text-indigo-400" />
                  </div>
                  <p className="text-[12px] text-zinc-300 leading-relaxed">{m.text}</p>
                </div>
                {m.actions && m.actions.length > 0 && (
                  <div className="ml-7 space-y-1">
                    {m.actions.map((a, ai) => (
                      <div key={ai} className="flex items-center gap-2 text-[10px] font-mono">
                        {a.type === 'write_file' ? (
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <FileEdit size={10} /> wrote {a.path?.split('/').pop()}
                          </span>
                        ) : a.type === 'run_command' ? (
                          <span className="flex items-center gap-1.5 text-amber-400">
                            <Terminal size={10} /> ran {a.command?.slice(0, 40)}...
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* ─── Thinking Indicator ─── */}
        {isLoading && thinking && (
          <div className="px-3 py-3">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                <Loader2 size={10} className="text-indigo-400 animate-spin" />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                <span className="animate-pulse">{thinking}</span>
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* ─── Input ─── */}
      <div className="p-3 border-t border-[#222] shrink-0">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-[12px] outline-none focus:border-indigo-500/50 resize-none pr-8"
              rows={2}
              placeholder="Ask the agent..."
            />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute bottom-2 left-2 p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-30">
              <Paperclip size={12} />
            </button>
            <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" accept="image/*,.svg,.glb,.mp3,.mp4,.pdf" />
          </div>
          <button onClick={sendMessage} disabled={isLoading || !input.trim()} className="self-end p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white transition-all">
            <Send size={14} />
          </button>
        </div>
        {uploading && <p className="text-[9px] text-zinc-500 mt-1">Uploading...</p>}
      </div>
    </div>
  );
}
