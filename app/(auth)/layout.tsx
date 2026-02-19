"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020202] relative overflow-hidden font-sans">
      
      {/* 🌌 High-End Animated Background (Nebula Vibe) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deep Purple Orb */}
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[140px]" 
        />
        
        {/* Electric Blue Orb */}
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 60, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[140px]" 
        />

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* 💠 Main Auth Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] px-6"
      >
        {/* Outer Glow Wrapper */}
        <div className="relative group">
          {/* Animated Gradient Border (Bento Feel) */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-zinc-800 via-zinc-400/20 to-zinc-800 rounded-[24px] opacity-100 transition-opacity" />
          
          {/* Inner Card Content */}
          <div className="relative bg-[#080808]/90 border border-white/5 backdrop-blur-[40px] rounded-[23px] p-10 shadow-[0_0_80px_-15px_rgba(0,0,0,0.5)]">
            {children}
          </div>
        </div>

        {/* System Status Footer */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-[1px] w-8 bg-zinc-800" />
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-medium">
            Authorized Personnel Only
          </span>
          <div className="h-[1px] w-8 bg-zinc-800" />
        </div>
      </motion.div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 text-zinc-800 rotate-90 text-[10px] tracking-tighter hidden md:block">
        ANTIGRAVITY_CORE_V2
      </div>
    </div>
  );
}