"use client";
import { motion } from 'framer-motion';
import { Terminal, Cpu, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#1a1a1a] font-serif pt-32 px-6">
      <div className="max-w-7xl mx-auto border-x-2 border-black/10 px-4 md:px-12">
        {/* Newspaper Header */}
        <div className="border-b-4 border-black pb-6 text-center">
          <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest border-b border-black mb-4">
            <span>Vol. 001 // FEB 2026</span>
            <span className="font-bold">The CodeMapers Daily</span>
            <span>Est. Binary Era</span>
          </div>
          <h1 className="text-[12vw] font-black uppercase tracking-tighter leading-none mb-4">SYSTEMS ONLINE</h1>
          <div className="flex justify-between font-bold italic text-sm md:text-xl border-t-2 border-black pt-2">
            <span>NEURAL ORCHESTRATION</span>
            <span>ZERO LATENCY</span>
            <span>CLOUD NATIVE</span>
          </div>
        </div>

        {/* Main Story */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b-2 border-black">
          <div className="md:col-span-8 border-r-2 border-black/10 pr-8">
            <div className="h-96 bg-zinc-300 grayscale border-2 border-black relative overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069" className="object-cover w-full h-full opacity-70 group-hover:scale-105 transition-transform duration-700" alt="Core" />
               <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black mt-6 leading-tight uppercase italic">
              "The local machine is a cage," says anonymous architect.
            </h2>
            <p className="mt-6 text-xl leading-relaxed columns-1 md:columns-2 gap-8 first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left">
              In a world obsessed with 16GB RAM upgrades, one system has decided to move the entire consciousness of development into the cloud. CodeMapers is not just an IDE; it is a rebellion against hardware limitations. The system promises a future where the browser is the only operating system you will ever need.
            </p>
          </div>
          
          <div className="md:col-span-4 space-y-8">
            <div className="bg-black text-[#f4f1ea] p-6 rounded-sm">
              <h3 className="font-mono text-amber-500 mb-4 border-b border-white/20 pb-2 tracking-tighter underline uppercase font-bold">System_Status.log</h3>
              <ul className="space-y-3 font-mono text-xs uppercase">
                <li className="flex justify-between"><span>Edge Nodes</span><span className="text-green-500">[ONLINE]</span></li>
                <li className="flex justify-between"><span>Neural Link</span><span className="text-green-500">[SYNCED]</span></li>
                <li className="flex justify-between"><span>Hardware</span><span className="text-red-500">[OBSOLETE]</span></li>
              </ul>
              <Link href="/dashboard" className="block w-full mt-6 bg-amber-500 text-black text-center py-3 font-black hover:bg-white transition-colors uppercase">Enter Terminal</Link>
            </div>
            <div className="border-2 border-black p-4 italic">
              <h4 className="font-bold border-b border-black mb-2 uppercase">Classifieds</h4>
              <p className="text-sm">"Looking for developers who hate slow builds. Must love monochrome UI and lightning speed." - Apply at /pricing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}