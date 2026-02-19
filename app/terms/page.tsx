"use client";
import { motion } from 'framer-motion';

export default function TermsOfService() {
  const sections = [
    {
      id: "01",
      title: "User Eligibility",
      content: "By accessing CodeMapers, you confirm you are not a sentient AI attempting to bypass human safety protocols. Use is restricted to organic or authorized entities only."
    },
    {
      id: "02",
      title: "Data Sovereignty",
      content: "Your code lives in our neural mesh. While you own the logic, we own the right to optimize its existence within the cloud fabric."
    },
    {
      id: "03",
      title: "The Panic Protocol",
      content: "In case of a local hardware failure, CodeMapers is not responsible for your emotional distress, although we provide the most stable environment for recovery."
    },
    {
      id: "04",
      title: "Subscription & Leasing",
      content: "Leases are billed in binary cycles. Failure to maintain the lease results in immediate de-materialization of the workspace nodes."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f1ea] pt-40 pb-20 px-6 font-serif text-[#1a1a1a]">
      <div className="max-w-4xl mx-auto border-4 border-black p-1">
        <div className="border-2 border-black p-8 md:p-16 bg-white relative overflow-hidden">
          
          {/* Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <h1 className="text-[20vw] font-black -rotate-12 uppercase">TOP_SECRET</h1>
          </div>

          {/* Document Header */}
          <div className="text-center mb-16 border-b-2 border-black pb-8 relative z-10">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 italic underline">Affidavit of Service</h1>
            <p className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase opacity-60 text-center">
              Document No: CM-LEGAL-2026-X9 // CodeMapers Infrastructure
            </p>
          </div>

          {/* Terms Content */}
          <div className="space-y-12 relative z-10">
            {sections.map((section) => (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div className="font-mono text-xs font-black border-r-2 border-black/10 pr-4">
                  SECTION_{section.id}
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-xl font-black uppercase mb-3 italic">{section.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-700 font-medium uppercase tracking-tight">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Signature Area */}
          <div className="mt-20 pt-12 border-t-2 border-dashed border-black flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="w-full md:w-1/2">
              <div className="h-12 border-b-2 border-black font-mono text-xs flex items-end pb-1 italic">
                The Architect
              </div>
              <p className="text-[10px] font-bold uppercase mt-2">Authorized Signature (Digital Seal)</p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="h-12 border-b-2 border-black font-mono text-xs flex items-end pb-1">
                {/* User's imaginary signature space */}
              </div>
              <p className="text-[10px] font-bold uppercase mt-2">Subscriber Acceptance Line</p>
            </div>
          </div>

          {/* Red Stamp */}
          <div className="absolute bottom-10 right-10 border-4 border-red-600 text-red-600 font-black px-4 py-2 rotate-[-15deg] opacity-60 uppercase text-lg border-double">
            EXECUTED_2026
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-10 text-center font-mono text-[10px] uppercase font-bold opacity-40">
        By continuing to use this system, you implicitly sign this affidavit.
      </div>
    </div>
  );
}