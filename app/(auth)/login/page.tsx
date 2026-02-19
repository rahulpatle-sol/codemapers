"use client";
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'framer-motion';
import { Github, Chrome, Code2, Zap, Globe, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (provider: 'github' | 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 🚀 Brand Identity Section */}
      <div className="flex flex-col items-center mb-10">
        <motion.div 
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          className="w-20 h-20 bg-gradient-to-br from-white to-zinc-500 p-[1px] rounded-3xl mb-6 shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]"
        >
          <div className="w-full h-full bg-[#0a0a0a] rounded-[23px] flex items-center justify-center">
            <Code2 className="text-white" size={38} />
          </div>
        </motion.div>

        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
          CODE<span className="text-zinc-500 not-italic">MAPERS</span>
        </h1>
        <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Autonomous Dev Environment
        </div>
      </div>

      {/* 🔐 Login Actions */}
      <div className="w-full space-y-4">
        <button 
          onClick={() => handleLogin('github')}
          className="group relative w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden"
        >
          <Github size={20} />
          <span className="relative z-10">Sync via GitHub</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        <button 
          onClick={() => handleLogin('google')}
          className="group w-full py-4 bg-[#0f0f0f] text-white border border-white/5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-900 hover:border-white/10 transition-all active:scale-[0.98]"
        >
          <Chrome size={20} className="group-hover:rotate-12 transition-transform" />
          Access with Google
        </button>
      </div>

      {/* 🛠 Technical Specs Footer */}
      <div className="mt-12 w-full grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
        <div className="flex flex-col items-center gap-1">
          <Globe size={14} className="text-zinc-600" />
          <span className="text-[8px] uppercase tracking-widest text-zinc-500">Global</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-x border-white/5">
          <Zap size={14} className="text-zinc-600" />
          <span className="text-[8px] uppercase tracking-widest text-zinc-500">Fast</span>
        </div>
        <div className="flex flex-col items-center gap-1">
        
          <span className="text-[8px] uppercase tracking-widest text-zinc-500">Secure</span>
        </div>
      </div>
    </div>
  );
}