"use client";
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface Props {
  projectName: string;
  url?: string;
}

const DEVICES = [
  { name: 'iPhone 16', w: 390, h: 844 },
  { name: 'iPhone 14', w: 390, h: 844 },
  { name: 'iPhone SE', w: 375, h: 667 },
  { name: 'Pixel 9', w: 412, h: 915 },
  { name: 'Samsung S24', w: 412, h: 915 },
  { name: 'iPad Air', w: 820, h: 1180 },
  { name: 'iPad Pro', w: 1024, h: 1366 },
  { name: 'Laptop', w: 1280, h: 800 },
];

export default function ExpoPreview({ projectName, url }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewMode, setPreviewMode] = useState<'qr' | 'web'>('qr');
  const [selectedDevice, setSelectedDevice] = useState(DEVICES[0]);

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        color: { dark: '#000', light: '#fff' },
      });
    }
  }, [url]);

  return (
    <div className="flex items-center justify-center h-full bg-[#0d0d0d] overflow-auto">
      <div className="text-center p-4 max-w-full">
        {previewMode === 'qr' ? (
          <>
            <div className="mb-3">
              <div className="w-[180px] h-[180px] mx-auto bg-white rounded-xl p-2 flex items-center justify-center">
                <canvas ref={canvasRef} className="max-w-full max-h-full" />
              </div>
            </div>
            <h3 className="text-white text-sm font-medium mb-1">{projectName}</h3>
            <p className="text-zinc-500 text-[10px] mb-3">Scan with Expo Go on your phone</p>

            <div className="flex gap-2 justify-center mb-4">
              <a href="https://expo.dev/client" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-medium hover:bg-indigo-500 transition-colors">
                Download Expo Go
              </a>
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center">
              {DEVICES.slice(0, 6).map(d => (
                <button key={d.name} onClick={() => { setSelectedDevice(d); setPreviewMode('web'); }}
                  className={`px-2.5 py-1 rounded text-[9px] font-mono transition-all ${selectedDevice.name === d.name ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50' : 'bg-zinc-800 text-zinc-400 border border-transparent hover:bg-zinc-700'}`}>
                  {d.name}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] text-zinc-600 font-mono whitespace-nowrap">
                {selectedDevice.name} &middot; {selectedDevice.w}x{selectedDevice.h}
              </div>
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-zinc-700" style={{ width: Math.min(selectedDevice.w, 780), height: Math.min(selectedDevice.h, 600) }}>
                {url && <iframe src={url} className="w-full h-full" title="Device Preview" />}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPreviewMode('qr')} className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-[10px] font-medium hover:bg-zinc-700 transition-colors">
                Back to QR
              </button>
              <select onChange={e => { const d = DEVICES.find(x => x.name === e.target.value); if (d) setSelectedDevice(d); }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-[10px] font-mono border border-zinc-700 outline-none">
                {DEVICES.map(d => <option key={d.name} value={d.name}>{d.name} ({d.w}x{d.h})</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
