"use client";
import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Globe, Search, LogOut, Zap, X, Sparkles, ChevronRight, Box, Server, FolderCode } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TEMPLATES = [
  { id: 'next', name: 'Next.js 15', icon: Globe, desc: 'Fullstack App router' },
  { id: 'vite', name: 'Vite React', icon: Zap, desc: 'Ultra-fast Frontend' },
  { id: 'expo', name: 'Expo Go', icon: Box, desc: 'Mobile Development' },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("next");
  const [isInitializing, setIsInitializing] = useState(false);
  
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setProjects(data || []);
      setLoading(false);
    };
    fetchUserAndProjects();
  }, []);

const handleCreate = async () => {
  if (!projectName || !user) return;
  setIsInitializing(true);
  
  const { data, error } = await supabase
    .from('projects')
    .insert([{ 
      name: projectName, 
      framework: selectedTemplate, // Check karo: DB mein 'framework' hi hai na?
      user_id: user.id
    }])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error:", error.message);
    setIsInitializing(false);
  } else {
    router.push(`/project/${data.id}?name=${data.name}&type=${data.framework}`);
  }
};

  if (loading) return <div className="h-screen bg-[#020202] flex items-center justify-center font-mono text-zinc-500 uppercase tracking-widest text-[10px]">Initializing_Core...</div>;

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 relative overflow-x-hidden">
      {/* Modal - New Architecture */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <h2 className="text-3xl font-black text-white italic uppercase mb-6">Architect <span className="text-zinc-700">Agent</span></h2>
              <div className="space-y-6">
                <input value={projectName} onChange={(e) => setProjectName(e.target.value)} type="text" placeholder="Project Name..." className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-4 px-6 focus:border-emerald-500/30 outline-none text-white font-mono" />
                <div className="grid grid-cols-2 gap-3">
                  {TEMPLATES.map((tmpl) => (
                    <button key={tmpl.id} onClick={() => setSelectedTemplate(tmpl.id)} className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all ${selectedTemplate === tmpl.id ? 'bg-emerald-500/5 border-emerald-500/50' : 'bg-zinc-900/20 border-white/5'}`}>
                      <tmpl.icon size={18} className={selectedTemplate === tmpl.id ? 'text-emerald-500' : 'text-zinc-600'} />
                      <div className="text-[10px] font-bold uppercase italic">{tmpl.name}</div>
                    </button>
                  ))}
                </div>
                <button disabled={isInitializing} onClick={handleCreate} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                  {isInitializing ? "Processing..." : "Initialize Architecture"} <ChevronRight size={16}/>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]">
        <span className="font-black italic uppercase text-white tracking-tighter">CodeMapers</span>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="text-xs font-mono text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2"><LogOut size={14}/> Sign_Out</button>
      </nav>

      <main className="max-w-7xl mx-auto p-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Nodes</h1>
            <p className="font-mono text-[10px] text-zinc-600 uppercase mt-2">Active Sessions: {projects.length}</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 hover:scale-105 transition-all"><Plus size={18}/> New Architecture</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} onClick={() => router.push(`/project/${p.id}`)} className="group p-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] hover:border-emerald-500/30 transition-all cursor-pointer">
              <div className="p-3 bg-zinc-950 rounded-2xl w-fit border border-white/10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform"><FolderCode size={24}/></div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-emerald-400 transition-colors">{p.name}</h3>
              <p className="text-[10px] text-zinc-600 font-mono mt-2 uppercase tracking-widest">{p.type} // {new Date(p.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}