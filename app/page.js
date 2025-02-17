// app/page.js
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import Playground from "./components/Playground";
import Community from "./community/page";

export default function Home() {
  useEffect(() => {
    // Scroll-based animation for sections
    gsap.from(".section", {
      opacity: 0,
      y: 100,
      duration: 1.5,
      ease: "power4.out",
      stagger: 0.3, // Adds delay between sections
      scrollTrigger: {
        trigger: ".home",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <div className="home">
      <Playground/>
      <Community/>
      {/* Section 1 */}
      <section className="section h-screen flex items-center justify-center bg-blue-500 text-white">
        <h1 className="text-5xl font-bold">Welcome to CodeMaper</h1>
      </section>

      {/* Section 2 */}
      <section className="section h-screen flex items-center justify-center bg-green-500 text-white">
        <h2 className="text-4xl font-bold">Explore Coding Playground</h2>
      </section>

      {/* Section 3 */}
      <section className="section h-screen flex items-center justify-center bg-purple-500 text-white">
        <h2 className="text-4xl font-bold">Learn from Seniors</h2>
      </section>

      {/* Section 4 */}
      <section className="section h-screen flex items-center justify-center bg-red-500 text-white">
        <h2 className="text-4xl font-bold">AI Code Review</h2>
      </section>

      {/* Section 5 */}
      <section className="section h-screen flex items-center justify-center bg-yellow-500 text-white">
        <h2 className="text-4xl font-bold">Start Your Coding Journey</h2>
      </section>
    </div>
  );
}
