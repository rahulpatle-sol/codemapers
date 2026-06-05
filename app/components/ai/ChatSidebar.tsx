"use client";
import { useState, useEffect, useRef } from 'react';
import { Send, Key, X } from 'lucide-react';

export default function ChatSidebar({ projectId, onAction, currentFiles }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [lastUsage, setLastUsage] = useState<any>(null);
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
      if (data.project?.chat_history) {
        setMessages(data.project.chat_history);
      }
    };
    if (projectId) loadChat();
  }, [projectId]);

  const saveApiKey = () => {
    localStorage.setItem("groq_api_key", apiKey);
    setShowApiKey(false);
  };

  const sendMessage = async () => {
    if (!input || isLoading) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInput("");

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          history: messages,
          currentFiles,
          apiKey: apiKey || undefined,
        }),
      });
      const data = await res.json();

      if (data.usage) setLastUsage(data.usage);

      if (data.files) data.files.forEach((f: any) => onAction({ type: 'WRITE_FILE', path: f.path, content: f.content }));
      if (data.commands) data.commands.forEach((c: string) => onAction({ type: 'RUN_COMMAND', command: c }));

      const botMsg = { role: 'bot', text: data.message };
      const newHistory = [...messages, userMsg, botMsg];
      setMessages(newHistory);

      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_history: newHistory }),
      });
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col h-full bg-[#080808] border-l border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-indigo-400">AI_CORE_V3</span>
        <button onClick={() => setShowApiKey(!showApiKey)} className="text-zinc-500 hover:text-white transition-colors">
          <Key size={14} />
        </button>
      </div>

      {showApiKey && (
        <div className="p-3 border-b border-white/5 bg-zinc-900/50">
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">Your Groq API Key</p>
          <div className="flex gap-2">
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              type="password"
              placeholder="gsk_..."
              className="flex-1 bg-black border border-white/10 rounded px-2 py-1.5 text-[11px] font-mono text-white outline-none focus:border-indigo-500"
            />
            <button onClick={saveApiKey} className="bg-indigo-600 text-white px-3 rounded text-[10px] font-bold">Save</button>
          </div>
          {apiKey && <p className="text-[8px] text-emerald-500 mt-1">Key saved locally</p>}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`p-2 rounded-xl text-[11px] ${m.role === 'user' ? 'bg-indigo-600' : 'bg-white/5 border border-white/5 text-zinc-300'}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {lastUsage && (
        <div className="px-4 py-1.5 border-t border-white/5 text-[8px] text-zinc-600 font-mono">
          Tokens: {lastUsage.totalTokens} (↑{lastUsage.promptTokens} ↓{lastUsage.completionTokens})
        </div>
      )}

      <div className="p-4 border-t border-white/5">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-zinc-900 rounded-lg p-2 text-[11px] h-16 outline-none border border-white/10 focus:border-indigo-500" placeholder="Type message..." />
        <button onClick={sendMessage} className="w-full mt-2 bg-indigo-600 py-2 rounded-lg text-[11px] font-bold">{isLoading ? "Typing..." : "Send Request"}</button>
      </div>
    </div>
  );
}
