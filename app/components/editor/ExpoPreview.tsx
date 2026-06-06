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

function DeviceFrame({ device, url, children }: { device: typeof DEVICES[0]; url?: string; children?: React.ReactNode }) {
  if (/iPad/.test(device.name)) {
    return (
      <div className="relative" style={{ width: device.w + 6, height: device.h + 6 }}>
        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-zinc-600 to-zinc-800 shadow-2xl" />
        <div className="absolute inset-[3px] rounded-[21px] bg-black overflow-hidden shadow-inner">
          <div className="absolute top-[16px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] bg-zinc-900 rounded-full z-10 border border-zinc-700" />
          <div className="absolute inset-[6px] top-[6px] bottom-[6px] rounded-[16px] overflow-hidden bg-[#0d0d0d] flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    );
  }
  if (/iPhone/.test(device.name)) {
    return (
      <div className="relative" style={{ width: device.w + 6, height: device.h + 6 }}>
        <div className="absolute inset-0 rounded-[44px] bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-2xl" />
        <div className="absolute inset-[3px] rounded-[41px] bg-black overflow-hidden shadow-inner">
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full z-10 shadow-lg flex items-center justify-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700" />
            <div className="w-5 h-1.5 rounded-full bg-zinc-800/60" />
          </div>
          <div className="absolute top-[16px] left-1/2 -translate-x-1/2 w-[46px] h-[2px] bg-zinc-800 rounded-full z-20 opacity-60" />
          <div className="absolute inset-[6px] top-[52px] bottom-[6px] rounded-[36px] overflow-hidden bg-[#0d0d0d] flex items-center justify-center">
            {children}
          </div>
          <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white/80 rounded-full z-10" />
        </div>
      </div>
    );
  }
  if (/Pixel|Samsung/.test(device.name)) {
    return (
      <div className="relative" style={{ width: device.w + 6, height: device.h + 6 }}>
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-zinc-600 to-zinc-900 shadow-2xl" />
        <div className="absolute inset-[3px] rounded-[29px] bg-black overflow-hidden shadow-inner">
          <div className="absolute top-[16px] left-[28px] w-[10px] h-[10px] bg-zinc-900 rounded-full z-10 border-2 border-zinc-800" />
          <div className="absolute inset-[6px] top-[6px] bottom-[40px] rounded-[24px] overflow-hidden bg-[#0d0d0d] flex items-center justify-center">
            {children}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[36px] bg-black/80 flex items-center justify-center gap-8 z-10">
            <div className="w-[10px] h-[10px] rounded-full border-2 border-white/40" />
            <div className="w-[16px] h-[10px] border-b-2 border-l-2 border-r-2 border-white/40 rounded-b-sm" />
            <div className="w-[10px] h-[10px] border-2 border-white/40" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative" style={{ width: device.w + 6, height: device.h + 6 }}>
      <div className="absolute inset-0 rounded-t-[12px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-2xl overflow-hidden">
        <div className="absolute inset-[3px] rounded-t-[10px] bg-black overflow-hidden">
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] bg-zinc-900 rounded-full z-10" />
          <div className="absolute inset-[4px] top-[14px] bottom-0 overflow-hidden bg-[#0d0d0d]">
            {children}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 w-[125%] h-[22px] bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-b-[8px] shadow-lg">
        <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-[96%] h-[3px] bg-zinc-600 rounded-full" />
        <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[40%] h-[4px] bg-zinc-600/30 rounded" />
      </div>
    </div>
  );
}

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
            <p className="text-zinc-500 text-[10px] mb-1">Scan with <span className="text-emerald-400 font-medium">Expo Go</span> on your phone</p>
            <p className="text-zinc-700 text-[8px] mb-3">Phone & computer must be on same network</p>

            <div className="flex gap-2 justify-center mb-4">
              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-medium hover:bg-indigo-500 transition-colors flex items-center gap-1.5">
                  ↗ Open Dev Server
                </a>
              )}
              <a href="https://expo.dev/client" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-zinc-700 text-white text-[10px] font-medium hover:bg-zinc-600 transition-colors">
                Get Expo Go
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
            <div className="relative mb-4">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] text-zinc-600 font-mono whitespace-nowrap">
                {selectedDevice.name} &middot; {selectedDevice.w}x{selectedDevice.h}
              </div>
              <DeviceFrame device={selectedDevice}>
                <div className="flex flex-col items-center gap-2 p-4">
                  <div className="w-[140px] h-[140px] bg-white rounded-xl p-2 flex items-center justify-center shadow-lg">
                    <canvas ref={canvasRef} className="max-w-full max-h-full" />
                  </div>
                  <div className="text-white text-xs font-medium">Scan with Expo Go</div>
                </div>
              </DeviceFrame>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPreviewMode('qr')} className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-[10px] font-medium hover:bg-zinc-700 transition-colors">
                Back
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
