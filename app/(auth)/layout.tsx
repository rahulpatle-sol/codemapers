"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#e8e4d9] relative overflow-hidden">
      
      {/* 📜 Texture & Paper Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Real Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
        
        {/* Subtle Vignette for Depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.1)]"></div>

        {/* Vertical Rule (Like a Newspaper Column) */}
        <div className="absolute left-[10%] top-0 bottom-0 w-[1px] bg-[#2b2b2b]/5"></div>
        <div className="absolute right-[10%] top-0 bottom-0 w-[1px] bg-[#2b2b2b]/5"></div>
      </div>

      {/* 💠 Content Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[480px] px-4"
      >
        {/* The "Pressed Paper" Card */}
        <div className="bg-[#f4f1ea] border border-[#2b2b2b]/10 rounded-sm p-1 shadow-[20px_20px_60px_#d1cfc5,-20px_-20px_60px_#ffffff]">
          <div className="border-2 border-[#2b2b2b] p-8 md:p-12 relative">
            {/* Corner Accents */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-[#2b2b2b]"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#2b2b2b]"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#2b2b2b]"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#2b2b2b]"></div>
            
            {children}
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 flex flex-col items-center gap-2 opacity-40">
           <div className="h-[1px] w-full bg-[#2b2b2b]"></div>
           <div className="flex justify-between w-full text-[9px] font-bold uppercase tracking-widest text-[#2b2b2b]">
              <span>Identity_Protocol_Secure</span>
              <span>© 2026 CodeMapers</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}