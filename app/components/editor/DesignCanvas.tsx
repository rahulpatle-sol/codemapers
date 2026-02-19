"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Square, Circle, Eraser, Trash2, Download } from 'lucide-react';

export default function DesignCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#2b2b2b"); // Newspaper Ink Color
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'rect'>('pencil');
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth * 2; // High resolution
      canvas.height = window.innerHeight * 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2);
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = 2;
        setCtx(context);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !ctx) return;
    
    if (tool === 'eraser') {
      ctx.strokeStyle = "#f4f1ea"; // Background paper color
      ctx.lineWidth = 20;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
    }

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctx?.closePath();
  };

  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="h-full w-full bg-[#f4f1ea] relative overflow-hidden font-serif cursor-crosshair">
      
      {/* 🛠️ Floating Toolbar (Excalidraw Style) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md border-2 border-[#2b2b2b] p-2 shadow-[4px_4px_0px_#2b2b2b]">
        <button onClick={() => setTool('pencil')} className={`p-2 transition-colors ${tool === 'pencil' ? 'bg-[#2b2b2b] text-white' : 'hover:bg-zinc-200'}`}>
          <Pencil size={18} />
        </button>
        <button onClick={() => setTool('eraser')} className={`p-2 transition-colors ${tool === 'eraser' ? 'bg-[#2b2b2b] text-white' : 'hover:bg-zinc-200'}`}>
          <Eraser size={18} />
        </button>
        <div className="w-[1px] h-6 bg-[#2b2b2b]/20 mx-1" />
        <button onClick={clearCanvas} className="p-2 hover:bg-red-100 text-red-600">
          <Trash2 size={18} />
        </button>
        <button className="p-2 hover:bg-zinc-200" onClick={() => {
          const link = document.createElement('a');
          link.download = 'codemap-design.png';
          link.href = canvasRef.current?.toDataURL() || '';
          link.click();
        }}>
          <Download size={18} />
        </button>
      </div>

      {/* 📄 Canvas Area */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="touch-none block"
      />

      {/* 🧭 Hand-drawn UI Elements */}
      <div className="absolute bottom-6 left-6 pointer-events-none">
        <div className="border-2 border-[#2b2b2b] p-4 bg-white/50 shadow-[4px_4px_0px_#2b2b2b]">
          <h3 className="font-black uppercase text-xs mb-1">Canvas_Protocol_V1</h3>
          <p className="text-[10px] opacity-60">Architect: Rahul Patle</p>
        </div>
      </div>

      {/* Background Texture (Newspaper vibe) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
    </div>
  );
}