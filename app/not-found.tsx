"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect to home after 5 seconds
    const redirect = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col items-center justify-center p-6 font-mono text-black overflow-hidden">
      {/* Glitch Effect Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full border-4 border-black p-1 bg-black shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)]"
      >
        <div className="bg-white p-8 md:p-12 border-2 border-black flex flex-col items-center text-center">
          
          <div className="bg-red-600 text-white px-4 py-1 font-black text-xs uppercase mb-6 animate-pulse">
            Critical_Error: 404
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 italic">
            SIGNAL_LOST
          </h1>

          <div className="w-full h-[2px] bg-black my-6 relative">
            <div className="absolute inset-0 bg-red-600 animate-[ping_2s_infinite]" />
          </div>

          <p className="text-sm font-bold uppercase leading-relaxed mb-8">
            The coordinate you requested has been <span className="bg-black text-white px-1">redacted</span> or moved to a higher clearance level. 
            Establishing emergency uplink...
          </p>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <RefreshCcw size={14} className="animate-spin" />
              Redirecting to Core in {countdown}s
            </div>
            
            <button 
              onClick={() => router.push('/')}
              className="mt-4 flex items-center gap-2 border-2 border-black px-8 py-3 font-black uppercase hover:bg-black hover:text-white transition-all group"
            >
              <Home size={18} /> Return_to_Base
            </button>
          </div>
        </div>
      </motion.div>

      {/* Decorative Technical Info */}
      <div className="mt-12 text-[8px] font-bold uppercase opacity-30 flex gap-10">
        <span>ERR_ADDR_NOT_FOUND</span>
        <span>SYS_STATUS: REBOOTING</span>
        <span>NODE_ID: 0x404_VOID</span>
      </div>
    </div>
  );
}