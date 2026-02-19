"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useFileSystem } from "../../../hooks/useFileSystem";
import { useWebContainer } from "../../../hooks/usewebContainer";
import { Monitor, Loader2, X, Terminal as TermIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('../../../components/editor/ManacoEditor'), { ssr: false });
const Terminal = dynamic(() => import('../../../components/editor/Terminal'), { ssr: false });
const FileTree = dynamic(() => import('../../../components/editor/FileTree'), { ssr: false });
const ChatSidebar = dynamic(() => import('../../../components/ai/ChatSidebar'), { ssr: false });

// --- 1. FIXED INTERFACES FOR PRODUCTION ---
interface ProjectParams {
  id: string;
}

interface FinalIDEProps {
  params: Promise<ProjectParams>;
}

// WebContainer ki typing ko accurate banaya hai
interface WebContainerInstance {
  fs: {
    mkdir: (path: string, options?: { recursive: boolean }) => Promise<void>;
    writeFile: (path: string, content: string) => Promise<void>;
  };
  spawn: (command: string) => Promise<any>;
  // 'on' method ko flexible banaya taaki 'server-ready' accept ho jaye
  on: (event: 'server-ready' | 'port' | string, callback: (...args: any[]) => void) => void;
}

export default function FinalIDE({ params }: FinalIDEProps) {
  // 2. Handle Params (Next.js 15 requires React.use)
  const resolvedParams = React.use(params);
  const projectId = resolvedParams.id;

  const { files, fetchFiles, saveFile, createFile } = useFileSystem(projectId);
  const { webContainer, isReady } = useWebContainer() as { webContainer: WebContainerInstance | null, isReady: boolean };
  
  const [previewUrl, setPreviewUrl] = useState("");
  const [shellWriter, setShellWriter] = useState<any>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeFile, setActiveFile] = useState<any>(null);
  const terminalRef = useRef<any>(null);

  useEffect(() => { 
    fetchFiles(); 
  }, [projectId]);

  // Pehli file ko default select karna
  useEffect(() => {
    if (files.length > 0 && !activeFile) {
      setActiveFile(files[0]);
    }
  }, [files]);

  // 📂 AI Actions handler
  const handleAction = async (action: any) => {
    if (action.type === 'WRITE_FILE') {
      await createFile(action.path.split('/').pop() || 'file', action.content, action.path);
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

  // 🚀 Boot Sequence Fix
  useEffect(() => {
    if (!webContainer || !isReady || files.length === 0) return;

    const boot = async () => {
      setIsBuilding(true);
      
      try {
        for (const file of files) {
          const dir = file.path.split('/').slice(0, -1).join('/');
          if (dir) await webContainer.fs.mkdir(dir, { recursive: true });
          await webContainer.fs.writeFile(file.path, file.content);
        }

        const shell = await webContainer.spawn('jsh');
        shell.output.pipeTo(new WritableStream({
          write(data) { terminalRef.current?.write(data); }
        }));
        
        const writer = shell.input.getWriter();
        setShellWriter(writer);

        const isVite = files.some(f => f.content.includes('vite'));
        const runCmd = isVite ? `npm install && npx vite\n` : `npm install && npm run dev\n`;
        
        await writer.write(runCmd);

        // ✅ FIXED: Parameter types define kar di
        webContainer.on('server-ready', (port: number, url: string) => {
          setPreviewUrl(url);
          setIsBuilding(false);
        });

      } catch (err) {
        console.error("WebContainer Error:", err);
        setIsBuilding(false);
      }
    };
    
    boot();
  }, [isReady, files.length, webContainer]);

  return (
    <div className="h-screen flex flex-col bg-black text-white font-sans overflow-hidden">
      {/* --- HEADER --- */}
      <header className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-950">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={() => window.location.href='/dashboard'} />
          <div className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer" onClick={() => window.location.reload()} />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-4">
          {isBuilding && <div className="text-[10px] text-yellow-500 animate-pulse font-mono uppercase tracking-widest">Compiling_System...</div>}
          <div className="bg-indigo-600/20 border border-indigo-500/50 px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-400">
            {previewUrl ? 'OS_CONNECTED' : 'STANDBY'}
          </div>
        </div>
      </header>

      {/* --- MAIN EDITOR --- */}
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r border-white/5 bg-zinc-950">
          <FileTree 
            files={files} 
            onFileSelect={(file: any) => setActiveFile(file)} 
          />
        </aside>
        
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-black overflow-hidden relative">
            <MonacoEditor 
              code={activeFile?.content || "// Ready to build..."} 
              onChange={() => {}} 
            />
          </div>
          
          <div className="h-48 border-t border-white/5 bg-black p-4 relative">
             <div className="text-[9px] text-zinc-600 mb-2 flex items-center gap-2 font-mono uppercase tracking-widest">
               <TermIcon size={12}/> Root_Terminal
             </div>
             <Terminal 
                onMount={(t) => { terminalRef.current = t; }} 
                onData={(d) => shellWriter?.write(d)} 
             />
          </div>
        </main>

        <aside className="w-[400px] border-l border-white/5 bg-zinc-950">
          <ChatSidebar 
            projectId={projectId} 
            onAction={handleAction} 
            currentFiles={files} 
          />
        </aside>
      </div>

      {/* --- PREVIEW WINDOW --- */}
      {previewUrl && (
        <div className="fixed bottom-6 right-6 w-[500px] h-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-zinc-800 z-50 animate-in slide-in-from-right-10">
           <div className="bg-zinc-800 p-2 flex items-center justify-between">
             <div className="flex items-center gap-2 px-2">
                <Monitor size={12} className="text-zinc-400" />
                <span className="text-[10px] font-mono text-white uppercase tracking-widest">Preview_Server</span>
             </div>
             <X size={14} className="text-white cursor-pointer hover:text-red-500" onClick={() => setPreviewUrl("")} />
           </div>
           <iframe src={previewUrl} className="w-full h-full" title="Preview" />
        </div>
      )}
    </div>
  );
}