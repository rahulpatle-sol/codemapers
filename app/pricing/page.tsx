"use client";
import { motion } from 'framer-motion';

export default function Pricing() {
  const plans = [
    { 
      ref: "AD_402-A", 
      title: "The Hobbyist", 
      price: "$0", 
      desc: "WAKING UP THE NEURAL LINK? START HERE. NO DEPOSIT REQUIRED.",
      features: ["1 SHARED NODE", "COMMUNITY SIGNAL", "PUBLIC REPOS"]
    },
    { 
      ref: "AD_909-X", 
      title: "The Architect", 
      price: "$19", 
      desc: "FOR THE SERIOUS BUILDER. TOTAL CONTROL OVER THE CLOUD MESH.",
      features: ["8 DEDICATED CORES", "PRIVATE SIGNAL", "UNLIMITED PROJECTS"],
      featured: true 
    },
    { 
      ref: "AD_000-Z", 
      title: "The Machine", 
      price: "CALL", 
      desc: "BEYOND HUMAN COMPREHENSION. ISOLATED KERNELS. SILENT OPS.",
      features: ["CUSTOM RUNTIMES", "WHITE-GLOVE SETUP", "OFF-GRID NODES"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f1ea] pt-40 pb-20 px-6 font-serif selection:bg-black selection:text-[#f4f1ea]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 border-b-4 border-black pb-8">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">Classified Ads</h1>
          <p className="font-mono text-xs mt-4 tracking-[0.4em] uppercase font-bold">Section C: Infrastructure Leasing & Neural Services</p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
          {plans.map((p, i) => (
            <motion.div 
              key={i}
              whileHover={{ backgroundColor: "#fff9c4" }} // Subtle ink-yellow aging
              className={`p-8 flex flex-col justify-between relative group ${p.featured ? 'bg-[#fcfaf2]' : ''}`}
            >
              {/* Retro Stamp for Featured */}
              {p.featured && (
                <div className="absolute top-4 right-4 border-4 border-red-700 text-red-700 px-2 py-1 font-black text-xs rotate-12 opacity-70 border-double">
                  MOST WANTED
                </div>
              )}

              <div className="relative z-10">
                <span className="font-mono text-[10px] block mb-6 font-black tracking-widest border-b border-black w-fit">
                  REF_NO: {p.ref}
                </span>
                
                <h3 className="text-4xl font-black uppercase mb-2 leading-none">{p.title}</h3>
                <div className="h-1 w-full bg-black mb-6" />
                
                <p className="text-5xl font-black mb-6 tracking-tighter">{p.price}<span className="text-sm font-normal font-mono">/MO</span></p>
                
                <p className="text-sm font-bold leading-tight mb-8 min-h-[60px] uppercase">
                  "{p.desc}"
                </p>

                <div className="space-y-2 mb-12">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase">
                      <div className="w-2 h-2 bg-black rotate-45" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-black text-[#f4f1ea] py-4 font-black uppercase tracking-widest text-sm hover:bg-zinc-800 transition-all active:scale-95 group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
                Secure Lease
              </button>

              {/* Decorative Corner Texture */}
              <div className="absolute bottom-0 right-0 w-8 h-8 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center font-mono text-[10px] uppercase tracking-widest opacity-60">
          <p>* All leases subject to neural compatibility check. Terminate at your own risk.</p>
          <p>CodeMapers Infrastructure Division © 2026</p>
        </div>
      </div>
    </div>
  );
}