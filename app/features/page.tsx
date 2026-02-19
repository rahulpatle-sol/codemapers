"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Globe, Terminal, Cpu, PenTool, Layers } from 'lucide-react';

const featureList = [
  {
    title: "NEURAL_ENGINE_V2",
    desc: "CONTEXT-AWARE ARCHITECTURE THAT PREDICTS LOGIC FLOWS BEFORE EXECUTION. NOT A COPILOT, BUT A CO-ARCHITECT.",
    icon: <Brain className="w-8 h-8" />,
    size: "md:col-span-2",
    delay: 0.1
  },
  {
    title: "INSTANT_BOOT",
    desc: "1.2S COLD START VIA EDGE RUNTIMES. NO BUFFERING.",
    icon: <Zap className="w-8 h-8" />,
    size: "md:col-span-1",
    delay: 0.2
  },
  {
    title: "MESH_SYNC",
    desc: "GLOBAL REPLICATION OF WORKSPACE STATE. SHARE VIA UNIQUE FREQUENCY URL.",
    icon: <Globe className="w-8 h-8" />,
    size: "md:col-span-1",
    delay: 0.3
  },
  {
    title: "TERMINAL_O1",
    desc: "GPU-ACCELERATED KERNEL ACCESS WITH ZERO INPUT LAG.",
    icon: <Terminal className="w-8 h-8" />,
    size: "md:col-span-2",
    delay: 0.4
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#1a1a1a] pt-40 pb-20 px-6 font-mono selection:bg-black selection:text-[#f4f1ea]">
      {/* Blueprint Grid Background */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title with Technical Specs */}
        <div className="mb-20 border-l-4 border-black pl-8">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-bold tracking-[0.5em] mb-4 text-zinc-500 uppercase"
          >
            // TECHNICAL_SPECIFICATIONS_DOC_404
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-8xl font-black uppercase leading-none tracking-tighter"
          >
            System <br /> Architecture.
          </motion.h1>
        </div>

        {/* Bento Blueprint Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black divide-y-2 md:divide-y-0 md:divide-x-2 divide-black bg-white/50 backdrop-blur-sm">
          {featureList.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay }}
              className={`${feature.size} p-10 relative group hover:bg-black hover:text-white transition-colors cursor-crosshair`}
            >
              {/* Corner Crosshairs */}
              <div className="absolute top-2 left-2 text-[10px] opacity-20 group-hover:opacity-100">+</div>
              <div className="absolute top-2 right-2 text-[10px] opacity-20 group-hover:opacity-100">+</div>
              
              <div className="mb-8">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center group-hover:border-white transition-colors">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-black mb-4 underline decoration-2 underline-offset-4 tracking-tighter uppercase italic">
                {feature.title}
              </h3>
              <p className="text-sm font-bold leading-relaxed uppercase opacity-70 group-hover:opacity-100">
                {feature.desc}
              </p>

              {/* Decorative Schematic Line */}
              <div className="mt-8 h-[1px] w-full bg-black/10 group-hover:bg-white/20" />
            </motion.div>
          ))}
        </div>

        {/* Secondary Detail Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-20 items-start border-t-4 border-black pt-20">
            <div className="space-y-12">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter underline">Security_Protocols</h2>
                
                <div className="flex gap-6 border-b border-black/10 pb-8">
                    <div className="flex-shrink-0 w-16 h-16 border-2 border-black flex items-center justify-center bg-amber-200">
                        <Cpu size={32} />
                    </div>
                    <div>
                        <h4 className="font-black text-xl uppercase tracking-tight">Isolated_Kernel_Access</h4>
                        <p className="text-sm font-bold opacity-60 uppercase mt-2">Each session is sandboxed in a Type-1 Hypervisor. No cross-contamination of neural data.</p>
                    </div>
                </div>

                <div className="flex gap-6 border-b border-black/10 pb-8">
                    <div className="flex-shrink-0 w-16 h-16 border-2 border-black flex items-center justify-center bg-black text-white">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h4 className="font-black text-xl uppercase tracking-tight">Encrypted_Mesh_Network</h4>
                        <p className="text-sm font-bold opacity-60 uppercase mt-2">End-to-end encryption for every packet leaving the cloud terminal.</p>
                    </div>
                </div>
            </div>

            {/* Code Schematic Visual */}
            <div className="relative border-4 border-black p-1 bg-black shadow-[15px_15px_0px_0px_rgba(0,0,0,0.1)]">
                <div className="bg-[#1a1a1a] p-8 overflow-hidden font-mono text-[12px] leading-relaxed text-emerald-500">
                    <div className="flex gap-2 mb-4 border-b border-emerald-500/20 pb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                    <p className="opacity-40">// SYSTEM_INITIALIZATION</p>
                    <p className="text-white">import {'{'} NeuralLink {'}'} from '@codemapers/core';</p>
                    <p className="mt-4 italic text-amber-500 underline uppercase">/* Warning: Hardware Bypass Active */</p>
                    <p className="mt-4">const <span className="text-blue-400">ide</span> = new NeuralLink({'{'}</p>
                    <p className="pl-4">mode: <span className="text-white">'ABSOLUTE_SCALE'</span>,</p>
                    <p className="pl-4">latency: <span className="text-white">0</span>,</p>
                    <p className="pl-4">ai_consciousness: <span className="text-white">true</span></p>
                    <p>{'}'});</p>
                    <p className="mt-6 text-emerald-400 animate-pulse font-bold tracking-widest uppercase underline">_Ready for link_</p>
                </div>
                {/* Visual Blueprint Label */}
                <div className="absolute -bottom-6 -right-6 bg-amber-400 border-2 border-black px-4 py-2 text-[10px] font-black uppercase rotate-3 shadow-lg">
                    Approved_by_The_Architect
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}