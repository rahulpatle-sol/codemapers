"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, ChevronRight, ChevronLeft, Terminal } from 'lucide-react';

const pages = [
  {
    title: "The Manual: Vol 01",
    content: "Welcome, Architect. This book contains the secrets of the Neural IDE. Open with caution.",
    type: "cover"
  },
  {
    title: "01. Initialization",
    content: "To begin, link your consciousness to the edge nodes. Use the command: 'codemapers login'. This will authorize your session across the mesh.",
    type: "content"
  },
  {
    title: "02. Neural Sync",
    content: "The system learns as you type. Our LLM-driven orchestrator indexes your intent, not just your syntax. Expect 0ms latency.",
    type: "content"
  },
  {
    title: "03. Deployment",
    content: "Deploying is a matter of thought. 'codemapers deploy' pushes your build to 24 global regions simultaneously.",
    type: "content"
  }
];

export default function DocsBook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    if (currentPage + newDirection >= 0 && currentPage + newDirection < pages.length) {
      setDirection(newDirection);
      setCurrentPage(currentPage + newDirection);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col items-center justify-center pt-20 overflow-hidden">
      <div className="text-center mb-10 font-mono">
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500">// SYSTEM_MANUAL_READ_ONLY</h2>
      </div>

      <div className="relative w-[90vw] max-w-[500px] h-[600px] perspective-[1500px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            initial={{ rotateY: direction > 0 ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: direction > 0 ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ transformOrigin: "left center" }}
            className="absolute inset-0 bg-[#fffdfa] border-2 border-black shadow-[20px_0_50px_rgba(0,0,0,0.1)] p-12 flex flex-col justify-between backface-hidden"
          >
            {/* Paper Texture Effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
            
            <div className="relative">
              <span className="font-mono text-[10px] text-gray-400">PAGE_0{currentPage + 1}</span>
              <h1 className={`font-serif font-black mt-4 leading-tight ${pages[currentPage].type === 'cover' ? 'text-5xl text-center mt-20' : 'text-3xl'}`}>
                {pages[currentPage].title}
              </h1>
              <div className="w-12 h-1 border-b-2 border-black my-6" />
              <p className="font-serif text-lg leading-relaxed text-gray-800 italic">
                {pages[currentPage].content}
              </p>
            </div>

            {pages[currentPage].type === 'content' && (
              <div className="bg-black/5 p-4 rounded font-mono text-xs border border-black/10">
                <Terminal size={14} className="mb-2" />
                <code className="text-gray-600">$ codemapers init --force</code>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Book Spine Shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent z-20" />
      </div>

      {/* Navigation Controls */}
      <div className="flex gap-10 mt-12">
        <button 
          onClick={() => paginate(-1)} 
          disabled={currentPage === 0}
          className={`p-4 border-2 border-black rounded-full transition-all ${currentPage === 0 ? 'opacity-20' : 'hover:bg-black hover:text-white'}`}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => paginate(1)} 
          disabled={currentPage === pages.length - 1}
          className={`p-4 border-2 border-black rounded-full transition-all ${currentPage === pages.length - 1 ? 'opacity-20' : 'hover:bg-black hover:text-white'}`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}