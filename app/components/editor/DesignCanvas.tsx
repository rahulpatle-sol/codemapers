"use client";
import { Rnd } from "react-rnd";
import { useState } from "react";

export default function DesignCanvas() {
  const [components, setComponents] = useState([
    { id: 1, x: 100, y: 100, text: "Drag me like Figma!" }
  ]);

  return (
    <div className="h-full w-full bg-[#050505] relative overflow-hidden bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px]">
      {components.map((comp) => (
        <Rnd
          key={comp.id}
          default={{ x: comp.x, y: comp.y, width: 200, height: 100 }}
          className="bg-white/5 border border-purple-500/50 backdrop-blur-md rounded-lg flex items-center justify-center text-xs text-white"
          bounds="parent"
        >
          <div className="p-4">{comp.text}</div>
          {/* Mac-style handle dots */}
          <div className="absolute top-2 left-2 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        </Rnd>
      ))}
    </div>
  );
}