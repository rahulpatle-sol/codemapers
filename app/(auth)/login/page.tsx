"use client";
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'framer-motion';
import { Github, Chrome, Hash } from 'lucide-react';

export default function LoginPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = (provider: 'github' | 'google') => {
    supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });
  };

  return (
    <div className="w-full text-[#2b2b2b] font-serif">
      <div className="text-center space-y-4">
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-60">Authentication Required</span>
        
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
          Verify <br /> <span className="not-italic">Access</span>
        </h1>
        
        <div className="py-6 border-y border-[#2b2b2b]/10 flex justify-center gap-8">
           <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold uppercase">Archive_ID</span>
              <span className="font-mono text-xs">#CM-9942</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold uppercase">Security</span>
              <span className="font-mono text-xs">LEVEL_03</span>
           </div>
        </div>

        <div className="space-y-3 pt-8">
          <button 
            onClick={() => handleLogin('github')}
            className="w-full py-4 bg-[#2b2b2b] text-[#f4f1ea] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 group"
          >
            <Github size={18} className="group-hover:rotate-12 transition-transform" />
            Sign with Github
          </button>

          <button 
            onClick={() => handleLogin('google')}
            className="w-full py-4 border-2 border-[#2b2b2b] font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f4f1ea] transition-all flex items-center justify-center gap-3 group"
          >
            <Chrome size={18} className="group-hover:-rotate-12 transition-transform" />
            Enter with Google
          </button>
        </div>

        <p className="pt-8 text-[10px] leading-relaxed opacity-50 italic">
          "By accessing this terminal, you agree to the archival of your neural data logs within the CodeMapers cloud network."
        </p>
      </div>
    </div>
  );
}