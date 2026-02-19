"use client";
import React from 'react';
import { Terminal, Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-[#f4f1ea] border-t-4 border-black pt-16 pb-8 px-8 font-serif">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b-2 border-black pb-12">
          
          {/* Brand Column - Editorial Style */}
          <div className="col-span-1 md:col-span-1 border-r-0 md:border-r-2 border-black/10 pr-4">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                <Terminal size={18} className="text-[#f4f1ea]" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-black uppercase italic">CodeMapers</span>
            </Link>
            <p className="text-[#1a1a1a] text-sm leading-relaxed mb-6 font-bold uppercase tracking-tight">
              ESTABLISHED 2026. <br /> 
              The world's first neural-orchestrated cloud terminal. Built for the architects of tomorrow.
            </p>
            <div className="flex gap-4">
              {/* 🔥 TERE SOCIAL LINKS YAHAN HAIN */}
              <Link href="https://x.com/PatleRahul239" target="_blank" className="p-2 border border-black hover:bg-black hover:text-[#f4f1ea] transition-all">
                <Twitter size={18} />
              </Link>
              <Link href="https://github.com/rahulpatle-sol" target="_blank" className="p-2 border border-black hover:bg-black hover:text-[#f4f1ea] transition-all">
                <Github size={18} />
              </Link>
              <Link href="https://www.linkedin.com/in/rahul-patle-sol/" target="_blank" className="p-2 border border-black hover:bg-black hover:text-[#f4f1ea] transition-all">
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Directory Sections */}
          <div className="md:pl-4">
            <h4 className="text-black font-black uppercase text-xs border-b border-black mb-6 pb-2 tracking-widest">Navigation</h4>
            <ul className="space-y-3 text-sm font-bold uppercase">
              <li><Link href="/features" className="hover:underline flex items-center gap-1 group">Features <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100" /></Link></li>
              <li><Link href="/docs" className="hover:underline flex items-center gap-1 group">Documentation <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100" /></Link></li>
              <li><Link href="/pricing" className="hover:underline flex items-center gap-1 group">Lease Plans <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100" /></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-black font-black uppercase text-xs border-b border-black mb-6 pb-2 tracking-widest">The Archive</h4>
            <ul className="space-y-3 text-sm font-bold uppercase">
              <li><Link href="/about" className="hover:underline flex items-center gap-1 group">Our Story <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100" /></Link></li>
              <li><Link href="/terms" className="hover:underline flex items-center gap-1 group">Terms <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100" /></Link></li>
              <li><Link href="/privacy" className="hover:underline flex items-center gap-1 group">Privacy <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100" /></Link></li>
            </ul>
          </div>

          {/* Newsletter - The Telegram Style */}
          <div className="bg-black/5 p-6 border-2 border-dashed border-black">
            <h4 className="text-black font-black uppercase text-xs mb-4 flex items-center gap-2">
              <Mail size={16} className="text-black" />
              Join the Wire
            </h4>
            <p className="text-[10px] text-black font-bold mb-4 leading-tight uppercase">Get telegrams regarding updates.</p>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="YOUR_EMAIL@ADDRESS" 
                className="bg-transparent border-b-2 border-black px-2 py-2 text-xs w-full focus:outline-none placeholder:text-black/30 font-mono text-black"
              />
              <button className="bg-black text-[#f4f1ea] py-2 text-xs font-black uppercase hover:invert transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">
          <p>© {currentYear} CODEMAPERS GAZETTE - ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4">
            <span>SYS_STATUS: OPTIMIZED</span>
            {/* 🔥 TERA WEBSITE LINK YAHAN HAI */}
            <div className="flex items-center gap-1 border-l border-black/20 pl-4 italic">
              Built by <Link href="https://rahulpatle.xyz" target="_blank" className="text-black underline hover:text-amber-800 transition-colors">Rahul Patle</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}