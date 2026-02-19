"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutStory() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".story-panel");
    if (!container.current) return;

    const ctx = gsap.context(() => {
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + (container.current?.offsetWidth || "3000")
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="flex overflow-hidden w-[300vw] h-screen bg-[#f4f1ea] font-serif text-[#2b2b2b]">
      
      {/* SECTION 01: THE HEADLINE */}
      <section className="story-panel min-w-screen w-screen h-screen flex flex-col justify-center px-10 md:px-20 border-r-2 border-[#2b2b2b]/20 relative">
        <div className="mb-12 border-b-4 border-[#2b2b2b] pb-4 flex justify-between items-end">
          <span className="text-xl font-black uppercase">The Daily Coder</span>
          <span className="text-sm font-bold uppercase italic">Special Edition — Vol. 01</span>
          <span className="text-sm font-bold">FEBRUARY 19, 2026</span>
        </div>
        
        <h1 className="text-[12vw] font-black leading-[0.8] tracking-tighter uppercase mb-8 border-b-2 border-[#2b2b2b] pb-6">
          SYSTEM <br/> CRASHED.
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
             <p className="text-2xl leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left">
               The hardware was failing. Memory leaks were drowning the logic. We sat in the dark, watching the terminal freeze for the hundredth time.
             </p>
          </div>
          <div className="border-l-2 border-[#2b2b2b]/10 pl-8 hidden md:block italic text-zinc-600">
             "It was the death of local development. We knew we had to move everything—every single bit—to the neural cloud."
          </div>
        </div>
      </section>

      {/* SECTION 02: THE DISCOVERY (The Classifieds Look) */}
      <section className="story-panel min-w-screen w-screen h-screen flex flex-col justify-center px-10 md:px-20 bg-[#ece9e0] border-r-2 border-[#2b2b2b]/20 relative">
        <div className="grid grid-cols-3 h-3/4 gap-4 border-2 border-[#2b2b2b] p-4">
           <div className="col-span-2 border-r-2 border-[#2b2b2b] pr-6 flex flex-col justify-center">
              <h2 className="text-7xl font-black uppercase mb-6 leading-none">A NEW ERA <br/> IN THE CLOUD.</h2>
              <p className="text-xl leading-snug font-medium">
                We discovered the neural bridge. A connection so fast, it felt like the IDE was part of the brain. No more fan noise. No more thermal throttling.
              </p>
              <div className="mt-8 bg-[#2b2b2b] text-[#f4f1ea] p-4 text-center font-bold uppercase tracking-widest">
                Classified: Neural Sync Active
              </div>
           </div>
           <div className="flex flex-col justify-between text-xs font-bold p-2 space-y-4">
              <div className="border-b border-[#2b2b2b] pb-2">WANTED: AGENTS OF CHANGE</div>
              <div className="border-b border-[#2b2b2b] pb-2 italic text-[#2b2b2b]/60">"The browser is now the workstation. The CPU is now infinite."</div>
              <div className="bg-[#2b2b2b]/10 p-2 uppercase text-center">Protocol V-31</div>
              <div className="mt-auto opacity-30 text-[5vw] leading-none font-black uppercase">INFO</div>
           </div>
        </div>
      </section>

      {/* SECTION 03: THE FINAL PAGE (Editorial/Call to Action) */}
      <section className="story-panel min-w-screen w-screen h-screen flex flex-col items-center justify-center px-10 md:px-40 bg-[#f4f1ea] relative">
        <div className="w-full border-t-8 border-double border-[#2b2b2b] pt-12 text-center">
          <h2 className="text-9xl font-black uppercase tracking-tighter leading-none mb-6">
            JOIN THE <br/> REVOLUTION.
          </h2>
          <p className="text-2xl max-w-2xl mx-auto italic font-medium leading-relaxed mb-12">
            "We don't just build code; we orchestrate reality. CodeMapers is the final edition of the cloud IDE. Your desk is wherever you are."
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => window.location.href='/dashboard'}
              className="px-12 py-5 bg-[#2b2b2b] text-[#f4f1ea] font-black uppercase tracking-[0.3em] hover:invert transition-all"
            >
              Start Reading_
            </button>
            <span className="text-xs font-bold border-y border-[#2b2b2b] py-1 px-4">ADVERTISEMENT: POWERED BY NEURAL_AI</span>
          </div>
        </div>
        
        <div className="absolute bottom-10 w-full px-20 flex justify-between text-[10px] font-bold opacity-40 uppercase">
          <span>Printed on Recycled Pixels</span>
          <span>© 2026 CodeMapers Publication</span>
          <span>Price: Free for Visionaries</span>
        </div>
      </section>

    </div>
  );
}