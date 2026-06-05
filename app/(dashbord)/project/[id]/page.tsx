"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFileSystem } from "../../../hooks/useFileSystem";
import { useWebContainer } from "../../../hooks/usewebContainer";
import {
  Monitor, X, Terminal as TermIcon, Maximize2, Minimize2,
  RotateCw, ExternalLink, PanelRightOpen, PanelRightClose, Globe,
  Github, Download, Check, Loader2, GitBranch, Key
} from 'lucide-react';
import { Rnd } from 'react-rnd';
import JSZip from 'jszip';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('../../../components/editor/ManacoEditor'), { ssr: false });
const Terminal = dynamic(() => import('../../../components/editor/Terminal'), { ssr: false });
const FileTree = dynamic(() => import('../../../components/editor/FileTree'), { ssr: false });
const ChatSidebar = dynamic(() => import('../../../components/ai/ChatSidebar'), { ssr: false });

interface ProjectParams { id: string }
interface FinalIDEProps { params: Promise<ProjectParams> }
interface WebContainerInstance {
  fs: { mkdir: (path: string, options?: { recursive: boolean }) => Promise<void>; writeFile: (path: string, content: string) => Promise<void> };
  spawn: (command: string) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  teardown?: () => Promise<void>;
}

export default function FinalIDE({ params }: FinalIDEProps) {
  const resolvedParams = React.use(params);
  const projectId = resolvedParams.id;

  const { files, fetchFiles, saveFile, createFile } = useFileSystem(projectId);
  const { webContainer, isReady } = useWebContainer() as { webContainer: WebContainerInstance | null, isReady: boolean };

  const [previewUrl, setPreviewUrl] = useState("");
  const [shellWriter, setShellWriter] = useState<any>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeFile, setActiveFile] = useState<any>(null);
  const [previewMinimized, setPreviewMinimized] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [restarting, setRestarting] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null);
  const [showGitModal, setShowGitModal] = useState(false);
  const [gitToken, setGitToken] = useState("");
  const terminalRef = useRef<any>(null);

  useEffect(() => { fetchFiles(); }, [projectId]);
  useEffect(() => {
    const saved = localStorage.getItem("github_token");
    if (saved) setGitToken(saved);
  }, []);

  useEffect(() => {
    if (files.length > 0 && !activeFile) setActiveFile(files[0]);
  }, [files]);

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

  const handleEditorChange = useCallback(async (value: string | undefined) => {
    if (value !== undefined && activeFile?.id) {
      await saveFile(activeFile.id, value);
    }
  }, [activeFile, saveFile]);

  const bootSequence = useCallback(async () => {
    if (!webContainer || !isReady || files.length === 0) return;
    setIsBuilding(true);
    try {
      for (const file of files) {
        const dir = file.path.split('/').slice(0, -1).join('/');
        if (dir) await webContainer.fs.mkdir(dir, { recursive: true });
        await webContainer.fs.writeFile(file.path, file.content);
      }
      const shell = await webContainer.spawn('jsh');
      shell.output.pipeTo(new WritableStream({ write(data) { terminalRef.current?.write(data); } }));
      const writer = shell.input.getWriter();
      setShellWriter(writer);
      const isVite = files.some(f => f.content.includes('vite'));
      await writer.write(isVite ? `bun install && bun vite\n` : `bun install && bun run dev\n`);
      webContainer.on('server-ready', (port: number, url: string) => { setPreviewUrl(url); setIsBuilding(false); });
    } catch (err) { console.error("Boot Error:", err); setIsBuilding(false); }
  }, [webContainer, isReady, files]);

  useEffect(() => { bootSequence(); }, [bootSequence]);

  const restartWebContainer = async () => {
    setRestarting(true);
    setPreviewUrl(""); setShellWriter(null);
    if (webContainer?.teardown) await webContainer.teardown();
    window.location.reload();
  };

  const openInNewTab = () => { if (previewUrl) window.open(previewUrl, '_blank'); };

  // ─── GitHub Push ───
  const saveGitToken = () => {
    localStorage.setItem("github_token", gitToken);
    setShowGitModal(false);
  };

  const pushToGithub = async () => {
    if (!gitToken) { setShowGitModal(true); return; }
    setPushing(true); setPushResult(null);
    try {
      const projectName = new URLSearchParams(window.location.search).get('name') || 'codemapers-project';
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, repoName: projectName, files, token: gitToken }),
      });
      const data = await res.json();
      if (data.success) setPushResult({ success: true, url: data.url });
      else setPushResult({ success: false, error: data.error });
    } catch (err: any) {
      setPushResult({ success: false, error: err.message });
    } finally { setPushing(false); }
  };

  // ─── ZIP Download ───
  const downloadZip = async () => {
    const zip = new JSZip();
    files.forEach(f => zip.file(f.path, f.content || ''));
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${new URLSearchParams(window.location.search).get('name') || 'project'}.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d0d0d] text-[#c0c0c0] overflow-hidden select-none">

      {/* ─── Minimal Title Bar ─── */}
      <header className="h-10 flex items-center justify-between px-4 bg-[#1a1a1a] border-b border-[#2a2a2a] shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-red-500'} ${isBuilding ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-mono tracking-wider text-zinc-500">
              {isBuilding ? 'BOOTING' : isReady ? 'READY' : 'OFFLINE'}
            </span>
          </div>
          <span className="text-xs font-medium text-zinc-400 border-l border-[#2a2a2a] pl-4">
            {new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('name') || 'Project'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* GitHub Push */}
          <button onClick={pushToGithub} disabled={pushing} className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition-all disabled:opacity-50">
            {pushing ? <Loader2 size={12} className="animate-spin" /> : <Github size={12} />}
            {pushing ? 'Pushing...' : gitToken ? 'Push to GH' : 'Connect Git'}
          </button>

          {/* GitHub token modal trigger */}
          <button onClick={() => setShowGitModal(true)} className="p-1.5 rounded hover:bg-[#2a2a2a] text-zinc-400 hover:text-white transition-colors" title="GitHub Settings">
            <Key size={12} />
          </button>

          {/* Download ZIP */}
          <button onClick={downloadZip} className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition-all">
            <Download size={12} /> ZIP
          </button>

          {/* Preview controls */}
          {previewUrl && (
            <>
              <button onClick={openInNewTab} className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/30 text-[10px] font-medium transition-all">
                <ExternalLink size={12} /> Open
              </button>
              <button onClick={() => setPreviewMinimized(!previewMinimized)} className="p-1.5 rounded hover:bg-[#2a2a2a] text-zinc-400 hover:text-white transition-colors">
                {previewMinimized ? <Monitor size={14} /> : <Globe size={14} />}
              </button>
            </>
          )}
          <button onClick={restartWebContainer} disabled={restarting} className="p-1.5 rounded hover:bg-[#2a2a2a] text-zinc-400 hover:text-white transition-colors disabled:opacity-30" title="Restart WebContainer">
            <RotateCw size={14} className={restarting ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setShowChat(!showChat)} className="p-1.5 rounded hover:bg-[#2a2a2a] text-zinc-400 hover:text-white transition-colors">
            {showChat ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
          </button>
        </div>
      </header>

      {/* Push result toast */}
      {pushResult && (
        <div className={`absolute top-12 right-4 z-[60] px-4 py-2 rounded text-[11px] font-mono shadow-lg transition-all ${pushResult.success ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700' : 'bg-red-900/80 text-red-300 border border-red-700'}`}>
          {pushResult.success ? (
            <div className="flex items-center gap-2">
              <Check size={12} /> Pushed!{' '}
              <a href={pushResult.url} target="_blank" className="underline hover:text-emerald-200">Open Repo</a>
            </div>
          ) : `Push failed: ${pushResult.error}`}
          <button onClick={() => setPushResult(null)} className="ml-2 opacity-50 hover:opacity-100"><X size={10} /></button>
        </div>
      )}

      {/* GitHub Token Modal */}
      {showGitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60" onClick={() => setShowGitModal(false)}>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 w-96 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium text-white mb-4">GitHub Personal Access Token</h3>
            <p className="text-[10px] text-zinc-500 mb-3">Create a token at GitHub Settings → Developer settings → Personal access tokens (classic) with <code className="text-emerald-400">repo</code> scope.</p>
            <input value={gitToken} onChange={e => setGitToken(e.target.value)} type="password" placeholder="ghp_..." className="w-full bg-black border border-[#333] rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-emerald-600 mb-3" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowGitModal(false)} className="px-4 py-1.5 rounded text-[11px] text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={saveGitToken} className="px-4 py-1.5 rounded bg-emerald-600 text-white text-[11px] font-medium hover:bg-emerald-500 transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Area ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ─── File Tree ─── */}
        <aside className="w-56 border-r border-[#2a2a2a] bg-[#111111] shrink-0 flex flex-col">
          <div className="h-8 flex items-center justify-between px-3 border-b border-[#2a2a2a]">
            <span className="text-[9px] font-mono tracking-widest text-zinc-600 uppercase">Files</span>
            <button onClick={() => fetchFiles()} className="text-zinc-600 hover:text-zinc-300 transition-colors">
              <RotateCw size={11} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FileTree files={files} onFileSelect={(f: any) => setActiveFile(f)} />
          </div>
        </aside>

        {/* ─── Editor + Terminal ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-9 flex items-center bg-[#181818] border-b border-[#2a2a2a] px-2 gap-1 shrink-0 overflow-x-auto">
            {files.map((f: any) => (
              <button key={f.id} onClick={() => setActiveFile(f)}
                className={`px-3 py-1.5 text-[11px] font-mono rounded-t whitespace-nowrap transition-colors ${activeFile?.id === f.id ? 'bg-[#0d0d0d] text-white border-t border-x border-[#2a2a2a]' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {f.name}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-[#0d0d0d] overflow-hidden relative">
            <MonacoEditor code={activeFile?.content || "// select a file..."} onChange={handleEditorChange} />
          </div>

          {showTerminal ? (
            <div className="h-48 border-t border-[#2a2a2a] bg-[#0d0d0d] flex flex-col shrink-0">
              <div className="h-7 flex items-center justify-between px-3 bg-[#181818] border-b border-[#2a2a2a]">
                <div className="flex items-center gap-2">
                  <TermIcon size={12} className="text-zinc-500" />
                  <span className="text-[9px] font-mono tracking-widest text-zinc-600 uppercase">Terminal</span>
                </div>
                <button onClick={() => setShowTerminal(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors"><X size={11} /></button>
              </div>
              <div className="flex-1 p-2">
                <Terminal onMount={(t: any) => { terminalRef.current = t; }} onData={(d: any) => shellWriter?.write(d)} />
              </div>
            </div>
          ) : (
            <button onClick={() => setShowTerminal(true)} className="h-6 bg-[#181818] border-t border-[#2a2a2a] flex items-center justify-center text-zinc-600 hover:text-zinc-300 text-[9px] font-mono tracking-widest uppercase shrink-0">
              <TermIcon size={10} className="mr-1.5" /> Terminal
            </button>
          )}
        </div>

        {showChat && (
          <aside className="w-80 border-l border-[#2a2a2a] bg-[#111111] shrink-0">
            <ChatSidebar projectId={projectId} onAction={handleAction} currentFiles={files} />
          </aside>
        )}
      </div>

      {/* ─── Draggable Preview Window ─── */}
      {previewUrl && !previewMinimized && (
        <Rnd default={{ x: 80, y: 80, width: 560, height: 380 }} minWidth={320} minHeight={200} bounds="window" className="z-50" dragHandleClassName="preview-handle"
          enableResizing={{ top: true, right: true, bottom: true, left: true, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}>
          <div className="w-full h-full bg-[#1a1a1a] rounded-lg shadow-2xl overflow-hidden border border-[#333] flex flex-col">
            <div className="preview-handle bg-[#222] px-3 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing select-none">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[10px] font-mono text-zinc-400 ml-3">Preview</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={openInNewTab} className="p-1 rounded hover:bg-[#333] text-zinc-400 hover:text-white transition-colors" title="Open in new tab"><ExternalLink size={12} /></button>
                <button onClick={() => setPreviewMinimized(true)} className="p-1 rounded hover:bg-[#333] text-zinc-400 hover:text-white transition-colors"><Minimize2 size={12} /></button>
                <button onClick={() => setPreviewUrl("")} className="p-1 rounded hover:bg-[#333] text-zinc-400 hover:text-red-400 transition-colors"><X size={12} /></button>
              </div>
            </div>
            <iframe src={previewUrl} className="w-full flex-1 bg-white" title="Preview" />
          </div>
        </Rnd>
      )}
    </div>
  );
}
