"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Rocket, Code2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 font-bold text-xl tracking-tighter"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Code2 size={20} />
          </div>
          CloudIDE.ai
        </motion.div>
        
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="#" className="hover:text-white transition-colors">Features</Link>
          <Link href="#" className="hover:text-white transition-colors">Templates</Link>
          <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Get Started
        </motion.button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-purple-400 mb-8"
        >
          <Sparkles size={14} />
          <span>New: AI-Powered Framework Scaffolding</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500"
        >
          Build your next big <br /> idea in the cloud.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
        >
          A professional-grade IDE that runs in your browser. Deploy full-stack apps, 
          manage assets, and code with AI context. No setup required.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/login" className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group">
            <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Start Coding Now
          </Link>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
            <Github size={20} />
            Continue with GitHub
          </button>
        </motion.div>

        {/* Dashboard Preview Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 relative w-full aspect-video rounded-2xl border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden group"
        >
           <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
           {/* Placeholder for IDE UI */}
           <div className="flex h-full">
              <div className="w-64 border-r border-white/10 p-4 flex flex-col gap-2">
                 {[1,2,3].map(i => <div key={i} className="h-4 w-full bg-white/5 rounded" />)}
              </div>
              <div className="flex-1 p-8 text-left font-mono text-sm text-gray-500">
                 <p className="text-purple-400">const</p> CloudIDE = () ={'>'} {'{'} <br />
                 &nbsp;&nbsp;console.log(<span className="text-blue-400">"Welcome to the future"</span>); <br />
                 {'}'}
              </div>
           </div>
        </motion.div>
      </main>
    </div>
  );
}