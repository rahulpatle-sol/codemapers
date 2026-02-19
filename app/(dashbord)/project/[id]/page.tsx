"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useFileSystem } from "../../../hooks/useFileSystem";
import { useWebContainer } from "../../../hooks/usewebContainer";
import { Monitor, Loader2, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('../../../components/editor/ManacoEditor'), { ssr: false });
const Terminal = dynamic(() => import('../../../components/editor/Terminal'), { ssr: false });
const FileTree = dynamic(() => import('../../../components/editor/FileTree'), { ssr: false });
const ChatSidebar = dynamic(() => import('../../../components/ai/ChatSidebar'), { ssr: false });

export default function FinalIDE({ params }: any) {
  const { id: projectId } = React.use(params);
  const { files, fetchFiles, saveFile, createFile } = useFileSystem(projectId);
  const { webContainer, isReady } = useWebContainer();
  const [previewUrl, setPreviewUrl] = useState("");
  const [shellWriter, setShellWriter] = useState<any>(null);
  const terminalRef = useRef<any>(null);

  useEffect(() => { fetchFiles(); }, [projectId]);

  // 🔥 WebContainer Actions (AI Bridge)
  const handleAction = async (action: any) => {
    if (action.type === 'WRITE_FILE') {
      await createFile(action.path.split('/').pop(), action.content, action.path);
      if (webContainer) {
        const dir = action.path.split('/').slice(0, -1).join('/');
        if (dir) await webContainer.fs.mkdir(dir, { recursive: true });
        await webContainer.fs.writeFile(action.path, action.content);
      }
    }
    if (action.type === 'RUN_COMMAND' && shellWriter) {
      shellWriter.write(`${action.command}\n`);
    }
  };

// FinalIDE.tsx boot sequence
useEffect(() => {
  if (!webContainer || !isReady || files.length === 0) return;

  const boot = async () => {
    // Clear container memory first if needed
    for (const file of files) {
      const dir = file.path.split('/').slice(0, -1).join('/');
      if (dir) await webContainer.fs.mkdir(dir, { recursive: true });
      await webContainer.fs.writeFile(file.path, file.content);
    }

    const shell = await webContainer.spawn('jsh');
    // ... terminal logic
    const isVite = window.location.search.includes('type=vite');
    const runCmd = isVite ? `npm install && npx vite\n` : `npm install && npm run dev\n`;
    writer.write(runCmd);
  };
  boot();
}, [isReady, files.length]);

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <header className="h-12 border-b border-white/5 flex items-center justify-between px-6">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" onClick={() => window.location.href='/dashboard'} />
          <div className="w-3 h-3 rounded-full bg-yellow-500" onClick={() => window.location.reload()} />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <button className="bg-indigo-600 px-4 py-1 rounded text-[10px] font-bold">PREVIEW READY</button>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r border-white/5"><FileTree files={files} /></aside>
        <main className="flex-1 flex flex-col">
          <div className="flex-1"><MonacoEditor code={files[0]?.content} /></div>
          <div className="h-48 border-t border-white/5"><Terminal onMount={(t) => terminalRef.current = t} onData={(d) => shellWriter?.write(d)} /></div>
        </main>
        <aside className="w-[400px]"><ChatSidebar projectId={projectId} onAction={handleAction} currentFiles={files} /></aside>
      </div>
      {previewUrl && <div className="fixed bottom-10 right-10 w-80 h-48 bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-zinc-800"><iframe src={previewUrl} className="w-full h-full" /></div>}
    </div>
  );
}