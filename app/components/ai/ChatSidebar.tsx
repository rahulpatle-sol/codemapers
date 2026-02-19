"use client";
import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, User, Bot } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function ChatSidebar({ projectId, onAction, currentFiles }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// ChatSidebar.tsx mein useEffect ko ensure karo
useEffect(() => {
  const loadChat = async () => {
    // Reset messages first so old project chat doesn't flicker
    setMessages([]); 
    const { data, error } = await supabase
      .from('projects')
      .select('chat_history')
      .eq('id', projectId) // Yeh current project ID se filter karega
      .single();
      
    if (data?.chat_history) {
      setMessages(data.chat_history);
    }
  };
  if (projectId) loadChat();
}, [projectId]); // Jab bhi projectId badlega, chat refresh hogi

  const sendMessage = async () => {
    if (!input || isLoading) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInput("");

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt: input, history: messages, currentFiles })
      });
      const data = await res.json();

      // 📂 Updating Files & Running Commands
      if (data.files) data.files.forEach((f: any) => onAction({ type: 'WRITE_FILE', path: f.path, content: f.content }));
      if (data.commands) data.commands.forEach((c: string) => onAction({ type: 'RUN_COMMAND', command: c }));

      const botMsg = { role: 'bot', text: data.message };
      const newHistory = [...messages, userMsg, botMsg];
      setMessages(newHistory);
      await supabase.from('projects').update({ chat_history: newHistory }).eq('id', projectId);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col h-full bg-[#080808] border-l border-white/5">
      <div className="p-4 border-b border-white/5 text-[10px] font-bold text-indigo-400">AI_CORE_V3</div>
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
      <div className="p-4 border-t border-white/5">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-zinc-900 rounded-lg p-2 text-[11px] h-16 outline-none border border-white/10 focus:border-indigo-500" placeholder="Type message..." />
        <button onClick={sendMessage} className="w-full mt-2 bg-indigo-600 py-2 rounded-lg text-[11px] font-bold">{isLoading ? "Typing..." : "Send Request"}</button>
      </div>
    </div>
  );
}