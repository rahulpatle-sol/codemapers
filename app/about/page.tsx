"use client";
import React from 'react';

export default function AboutStory() {
  return (
    <div className="min-h-screen w-full bg-[#f4f1ea] font-serif text-[#2b2b2b] selection:bg-[#2b2b2b] selection:text-[#f4f1ea]">
      
      {/* --- PAGE 1: THE HEADLINE --- */}
      <section className="min-h-screen w-full flex flex-col justify-center px-6 md:px-20 border-b-2 border-[#2b2b2b]/20">
        <div className="mb-12 border-b-4 border-[#2b2b2b] pb-4 flex justify-between items-end">
          <span className="text-lg md:text-xl font-black uppercase tracking-tighter">The Daily Coder</span>
          <span className="text-[10px] md:text-sm font-bold uppercase italic hidden sm:block">Special Edition — Vol. 01</span>
          <span className="text-xs md:text-sm font-bold uppercase">FEBRUARY 19, 2026</span>
        </div>
        
        <h1 className="text-[15vw] md:text-[12vw] font-black leading-[0.85] tracking-tighter uppercase mb-10 border-b-2 border-[#2b2b2b] pb-8">
          SYSTEM <br/> CRASHED.
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-4">
             <p className="text-xl md:text-2xl leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:leading-none">
               The hardware was failing. Memory leaks were drowning the logic. We sat in the dark, watching the terminal freeze for the hundredth time. Everything we knew about local development was about to change.
             </p>
          </div>
          <div className="border-l-4 border-[#2b2b2b] pl-8 italic text-zinc-700 text-lg md:text-xl flex items-center">
             "It was the death of local development. We knew we had to move everything—every single bit—to the neural cloud."
          </div>
        </div>
      </section>

      {/* --- PAGE 2: THE DISCOVERY --- */}
      <section className="min-h-screen w-full flex flex-col justify-center px-6 md:px-20 bg-[#ece9e0] border-b-2 border-[#2b2b2b]/20 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-4 border-[#2b2b2b] p-6 md:p-10">
           <div className="lg:col-span-2 border-b-2 lg:border-b-0 lg:border-r-2 border-[#2b2b2b] pb-8 lg:pb-0 lg:pr-10 flex flex-col justify-center">
              <h2 className="text-5xl md:text-8xl font-black uppercase mb-8 leading-none tracking-tight">A NEW ERA <br/> IN THE CLOUD.</h2>
              <p className="text-lg md:text-2xl leading-snug font-medium mb-8">
                We discovered the neural bridge. A connection so fast, it felt like the IDE was part of the brain. No more fan noise. No more thermal throttling. Just pure, unadulterated logic.
              </p>
              <div className="bg-[#2b2b2b] text-[#f4f1ea] p-4 text-center font-bold uppercase tracking-[0.3em] text-sm">
                Classified: Neural Sync Active
              </div>
           </div>
           
           <div className="flex flex-col justify-between text-xs md:text-sm font-bold space-y-6 pt-4 lg:pt-0">
              <div className="border-b-2 border-[#2b2b2b] pb-4">
                <span className="block text-red-700 mb-1 tracking-widest">WANTED:</span>
                AGENTS OF CHANGE TO JOIN THE ARCHIVE.
              </div>
              <div className="italic text-[#2b2b2b]/70 border-b-2 border-[#2b2b2b] pb-4">
                "The browser is now the workstation. The CPU is now infinite. The physical machine is just a ghost."
              </div>
              <div className="bg-[#2b2b2b]/5 p-4 uppercase text-center border border-[#2b2b2b]/20">
                Protocol V-31 Deployment
              </div>
              <div className="opacity-20 text-7xl font-black uppercase leading-none self-end">INFO</div>
           </div>
        </div>
      </section>

      {/* --- PAGE 3: THE FINAL CALL --- */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 md:px-40 py-20">
        <div className="w-full border-t-8 border-double border-[#2b2b2b] pt-16 text-center">
          <h2 className="text-7xl md:text-[10vw] font-black uppercase tracking-tighter leading-none mb-8">
            JOIN THE <br/> REVOLUTION.
          </h2>
          <p className="text-xl md:text-3xl max-w-3xl mx-auto italic font-medium leading-relaxed mb-16">
            "We don't just build code; we orchestrate reality. CodeMapers is the final edition of the cloud IDE. Your desk is wherever you are."
          </p>
          
          <div className="flex flex-col items-center gap-8">
            <button 
              onClick={() => window.location.href='/auth/login'}
              className="px-16 py-6 bg-[#2b2b2b] text-[#f4f1ea] font-black uppercase tracking-[0.4em] text-xl hover:scale-105 active:scale-95 transition-all shadow-[8px_8px_0px_#888]"
            >
              Start Reading_
            </button>
            <div className="w-full max-w-sm border-y-2 border-[#2b2b2b] py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest">
              Advertisement: Powered by Neural_AI Systems
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="mt-20 w-full flex flex-col md:flex-row justify-between items-center text-[10px] font-bold opacity-50 uppercase tracking-widest gap-4">
          <span>Printed on Recycled Pixels</span>
          <span>© 2026 CodeMapers Publication</span>
          <span>Price: Free for Visionaries</span>
        </div>
      </section>

    </div>
  );
}