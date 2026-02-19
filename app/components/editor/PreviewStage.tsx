"use client";
import React, { useState } from 'react';
import { Monitor, Smartphone, Maximize2, X, RotateCw } from 'lucide-react';

export default function PreviewStage({ url, isReady, projectType }: any) {
  const [viewMode, setViewMode] = useState<'web' | 'mobile'>('web');
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`flex flex-col h-full bg-[#050505] ${isFullscreen ? 'fixed inset-0 z-[100] p-10' : ''}`}>
      {/* MacBook Frame Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-white/5 rounded-t-xl">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex gap-4">
          <button onClick={() => setViewMode('web')} className={`${viewMode === 'web' ? 'text-indigo-400' : 'text-zinc-500'}`}><Monitor size={14}/></button>
          <button onClick={() => setViewMode('mobile')} className={`${viewMode === 'mobile' ? 'text-indigo-400' : 'text-zinc-500'}`}><Smartphone size={14}/></button>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-zinc-500 hover:text-white">
          {isFullscreen ? <X size={14}/> : <Maximize2 size={12}/>}
        </button>
      </div>

      {/* Browser/Device Content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-[#0d0d0d] overflow-auto">
        {!isReady ? (
          <div className="flex flex-col items-center gap-2 opacity-20">
            <RotateCw className="animate-spin" size={20} />
            <span className="text-[10px] font-mono">AWAITING_STAGE</span>
          </div>
        ) : (
          <div className={`bg-white transition-all duration-500 shadow-2xl overflow-hidden ${
            viewMode === 'mobile' ? 'w-[320px] h-[580px] rounded-[2.5rem] border-[10px] border-zinc-800' : 'w-full h-full rounded-b-lg'
          }`}>
            {projectType === 'expo' && viewMode === 'mobile' ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`} alt="QR" className="mb-4" />
                 <p className="text-[10px] font-bold text-zinc-800">SCAN IN EXPO GO</p>
              </div>
            ) : (
              <iframe src={url} className="w-full h-full border-none" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}