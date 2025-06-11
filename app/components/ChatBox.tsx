"use client";
import { useState, useRef } from "react";
import { MessageCircle, Loader2 } from "lucide-react";

export default function ChatSupport() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ sender: string; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState({ width: 350, height: 500 });

  const resizerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input) return;

    setChat([...chat, { sender: "👤 You", message: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setChat([...chat, { sender: "👤 You", message: input }, { sender: "Bhagi AI", message: data.reply }]);
    } catch (error) {
      setChat([...chat, { sender: "👤 You", message: input }, { sender: "Bhagi AI", message: "Failed to respond" }]);
    }

    setLoading(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (event: MouseEvent) => {
      const newWidth = startWidth + (event.clientX - startX);
      const newHeight = startHeight + (event.clientY - startY);
      setSize({ width: Math.max(300, newWidth), height: Math.max(400, newHeight) });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button onClick={() => setOpen(true)} className="bg-[#00f3ff] p-4 rounded-full text-black shadow-neon hover:scale-110 transition">
          <MessageCircle size={28} />
        </button>
      )}

      {open && (
        <div
          className="bg-[#0a0a0a] text-white shadow-xl rounded-xl flex flex-col overflow-hidden border border-[#00f3ff]"
          style={{ width: `${size.width}px`, height: `${size.height}px` }}
        >
          {/* Header */}
          <div className="bg-[#00f3ff] text-black p-3 flex justify-between items-center shadow-neon">
            <h2 className="font-bold tracking-wide text-lg">⚡ Chat With Bhagi AI 🧘</h2>
            <button onClick={() => setOpen(false)} className="text-black text-xl hover:text-gray-700 transition">
              ×
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto text-sm scrollbar-custom">
            {chat.map((msg, i) => (
              <div key={i} className={`p-2 rounded-lg max-w-[85%] ${msg.sender === "👤 You" ? "bg-[#f72585] text-white self-end ml-auto text-right" : "bg-[#1e293b] text-[#00f3ff] self-start mr-auto"} shadow-md`}>
                <span className="font-semibold">{msg.sender}:</span> {msg.message}
              </div>
            ))}

            {loading && (
              <div className="flex justify-center items-center text-[#00f3ff]">
                <Loader2 className="animate-spin h-6 w-6" />
              </div>
            )}
          </div>

          {/* Resizable Handle */}
          <div ref={resizerRef} onMouseDown={handleMouseDown} className="w-full h-2 bg-[#00f3ff] cursor-ns-resize"></div>

          {/* Input */}
          <div className="flex border-t p-2 bg-[#1a1a1a]">
            <input
              className="flex-1 border-none bg-transparent text-[#00f3ff] px-3 py-2 rounded-l text-sm focus:outline-none placeholder:text-[#00f3ff]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="💬 Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-[#00f3ff] text-black px-4 rounded-r text-sm hover:bg-[#00d2ff] transition shadow-neon">
              🚀 Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
