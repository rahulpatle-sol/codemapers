"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutStory() {
  const container = useRef(null);

  useEffect(() => {
    const sections = gsap.utils.toArray(".story-panel");
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        pin: true,
        scrub: 1,
        end: () => "+=" + container.current?.offsetWidth
      }
    });
  }, []);

  return (
    <div ref={container} className="flex overflow-hidden w-[400vw] h-screen bg-[#1a1a1a] text-amber-500 font-mono">
      <section className="story-panel w-screen h-screen flex flex-col justify-center px-12 md:px-32 border-r border-amber-500/20">
        <h2 className="text-[10vw] font-black underline decoration-4">PHASE_01</h2>
        <p className="text-2xl md:text-4xl max-w-4xl mt-10 tracking-tighter italic">"Everything was slow. The IDE crashed. The fan screamed. I realized the computer was the bottleneck of human creativity."</p>
      </section>

      <section className="story-panel w-screen h-screen flex flex-col justify-center px-12 md:px-32 border-r border-amber-500/20 bg-amber-950/5">
        <h2 className="text-[10vw] font-black underline decoration-4 text-white">PHASE_02</h2>
        <p className="text-2xl md:text-4xl max-w-4xl mt-10 tracking-tighter">"I built a neural bridge between the browser and the edge. No files, only streams. No lag, only flow."</p>
      </section>

      <section className="story-panel w-screen h-screen flex flex-col justify-center px-12 md:px-32 bg-amber-500 text-black">
        <h2 className="text-[10vw] font-black underline decoration-4">NOW</h2>
        <p className="text-2xl md:text-4xl max-w-4xl mt-10 font-black">SYSTEM_CONNECTED. WELCOME TO CODEMAPERS. YOU ARE THE ARCHITECT NOW.</p>
      </section>
    </div>
  );
}