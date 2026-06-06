"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFileSystem } from "../../../hooks/useFileSystem";
import { useWebContainer } from "../../../hooks/usewebContainer";
import {
  Monitor, X, Terminal as TermIcon, Maximize2, Minimize2,
  RotateCw, ExternalLink, PanelRightOpen, PanelRightClose, Globe,
  Github, Download, Check, Loader2, ArrowLeft,
  Save, Menu, FilePlus2, FolderPlus, Plus,
  Smartphone
} from 'lucide-react';
import { Rnd } from 'react-rnd';
import JSZip from 'jszip';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('../../../components/editor/ManacoEditor'), { ssr: false });
const Terminal = dynamic(() => import('../../../components/editor/Terminal'), { ssr: false });
const FileTree = dynamic(() => import('../../../components/editor/FileTree'), { ssr: false });
const ChatSidebar = dynamic(() => import('../../../components/ai/ChatSidebar'), { ssr: false });
const ExpoPreview = dynamic(() => import('../../../components/editor/ExpoPreview'), { ssr: false });

interface ProjectParams { id: string }
interface FinalIDEProps { params: Promise<ProjectParams> }
interface WebContainerInstance {
  fs: { mkdir: (path: string, options?: { recursive: boolean }) => Promise<void>; writeFile: (path: string, content: string) => Promise<void> };
  spawn: (command: string, args?: string[], options?: any) => any;
  on: (event: string, callback: (...args: any[]) => void) => void;
  teardown?: () => Promise<void>;
}

export default function FinalIDE({ params }: FinalIDEProps) {
  const resolvedParams = React.use(params);
  const projectId = resolvedParams.id;

  const [projectType, setProjectType] = useState<string>('next');
  const { files, fetchFiles, saveFile, createFile } = useFileSystem(projectId, projectType);
  const { webContainer, isReady } = useWebContainer() as { webContainer: WebContainerInstance | null, isReady: boolean };

  const [previewUrl, setPreviewUrl] = useState("");
  const [expoServerUrl, setExpoServerUrl] = useState("");
  const [shellWriter, setShellWriter] = useState<any>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeFile, setActiveFile] = useState<any>(null);
  const [previewMinimized, setPreviewMinimized] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showFileTree, setShowFileTree] = useState(true);
  const [restarting, setRestarting] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null);
  const [gitConnected, setGitConnected] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [createName, setCreateName] = useState("");
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);
  const [pushRepoName, setPushRepoName] = useState("");
  const [pushIsPrivate, setPushIsPrivate] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'none' | 'iphone' | 'android' | 'tablet' | 'laptop'>('none');
  const [terminalHeight, setTerminalHeight] = useState(160);
  const terminalRef = useRef<any>(null);
  const autoSaveTimer = useRef<any>(null);
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);
  const bootedRef = useRef(false);

  useEffect(() => {
    const typeFromUrl = new URLSearchParams(window.location.search).get('type');
    if (typeFromUrl) {
      setProjectType(typeFromUrl);
    } else {
      fetch(`/api/projects/${projectId}`).then(r => r.json()).then(d => {
        if (d.project?.type) setProjectType(d.project.type);
      }).catch(() => {});
    }
    fetchFiles();
  }, [projectId]);

  useEffect(() => {
    fetch('/api/auth/github/token').then(r => r.json()).then(d => setGitConnected(!!d.token)).catch(() => {});
  }, []);

  useEffect(() => {
    if (files.length > 0 && !activeFile) setActiveFile(files[0]);
  }, [files]);

  // ─── Auto-save with debounce ───
  const doSave = useCallback(async (content: string) => {
    if (!activeFile?.id) return;
    setSaving(true);
    await saveFile(activeFile.id, content);
    // Sync to WebContainer for live preview HMR
    if (webContainer && activeFile.path) {
      try {
        await webContainer.fs.writeFile(activeFile.path, content);
      } catch (err) {
        console.error("WebContainer write error:", err);
      }
    }
    setDirty(false);
    setSaving(false);
  }, [activeFile, saveFile, webContainer]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined && activeFile?.id) {
      setDirty(true);
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => doSave(value), 1500);
    }
  }, [activeFile, doSave]);

  const handleManualSave = () => {
    if (activeFile?.content !== undefined) {
      clearTimeout(autoSaveTimer.current);
      doSave(activeFile.content);
    }
  };

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

  const bootSequence = useCallback(async () => {
    if (!webContainer || !isReady || files.length === 0 || bootedRef.current) return;
    bootedRef.current = true;
    setIsBuilding(true);
    try {
      // Write package.json first so npm install can start early
      const pkgFile = files.find(f => f.path === 'package.json');
      if (pkgFile) {
        const dir = pkgFile.path.split('/').slice(0, -1).join('/');
        if (dir) await webContainer.fs.mkdir(dir, { recursive: true });
        await webContainer.fs.writeFile(pkgFile.path, pkgFile.content);
      }

      // Start shell + npm install while writing remaining files in parallel
      const shell = await webContainer.spawn('jsh');
      shell.output.pipeTo(new WritableStream({ write(data) { terminalRef.current?.write(data); } }));
      const writer = shell.input.getWriter();
      setShellWriter(writer);

      // Write remaining files in background (don't await)
      const writeRemaining = (async () => {
        for (const file of files) {
          if (file.path === 'package.json') continue;
          const dir = file.path.split('/').slice(0, -1).join('/');
          if (dir) await webContainer.fs.mkdir(dir, { recursive: true });
          await webContainer.fs.writeFile(file.path, file.content);
        }
      })();

      // Start install without waiting for remaining files
      if (projectType === 'expo') {
        const projectName = new URLSearchParams(window.location.search).get('name') || 'Expo App';
        setPreviewUrl(`expo`);
        writer.write('npm install --loglevel=error && npx expo start --web\n');
        webContainer.on('server-ready', (port: number, url: string) => {
          setExpoServerUrl(url);
          setIsBuilding(false);
        });
      } else {
        const isVite = projectType === 'vite' || files.some(f => f.content.includes('vite'));
        writer.write(isVite ? 'npm install --loglevel=error && npx vite\n' : 'npm install --loglevel=error && npm run dev\n');
        webContainer.on('server-ready', (port: number, url: string) => { setPreviewUrl(url); setIsBuilding(false); });
      }

      await writeRemaining;
    } catch (err) { console.error("Boot Error:", err); setIsBuilding(false); }
  }, [webContainer, isReady, files.length]);

  useEffect(() => { bootSequence(); }, [bootSequence]);

  // ─── Keyboard shortcuts ───
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      switch (e.key) {
        case '`': e.preventDefault(); setShowTerminal(p => !p); break;
        case 'b': e.preventDefault(); setShowFileTree(p => !p); break;
        case '\\': e.preventDefault(); setShowChat(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ─── Terminal drag resize ───
  const onTerminalDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startY: e.clientY, startH: terminalHeight };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = dragRef.current.startY - ev.clientY;
      const newH = Math.max(80, Math.min(600, dragRef.current.startH + delta));
      setTerminalHeight(newH);
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp, { once: true });
  }, [terminalHeight]);

  const restartWebContainer = async () => {
    setRestarting(true);
    setPreviewUrl(""); setShellWriter(null);
    if (webContainer?.teardown) await webContainer.teardown();
    window.location.reload();
  };

  const openInNewTab = () => {
    if (projectType === 'expo' && expoServerUrl) window.open(expoServerUrl, '_blank');
    else if (previewUrl && previewUrl !== 'expo') window.open(previewUrl, '_blank');
  };

  const tryExpoWebPreview = () => {
    if (!expoServerUrl) return;
    // Try multiple possible Expo web paths
    const candidates = [
      expoServerUrl,
      `${expoServerUrl}/index.html`,
      `${expoServerUrl}?_platform=web`,
    ];
    window.open(candidates[0], '_blank');
  };

  const connectGitHub = () => { window.location.href = `/api/auth/github/repo?project_id=${projectId}`; };

  const pushToGithub = async () => {
    setPushing(true); setPushResult(null);
    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, repoName: pushRepoName, files, private: pushIsPrivate }),
      });
      const data = await res.json();
      if (data.success) setPushResult({ success: true, url: data.url });
      else setPushResult({ success: false, error: data.error });
    } catch (err: any) { setPushResult({ success: false, error: err.message }); }
    finally { setPushing(false); }
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    files.forEach(f => zip.file(f.path, f.content || ''));
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${new URLSearchParams(window.location.search).get('name') || 'project'}.zip`;
    a.click(); URL.revokeObjectURL(a.href);
  };

  // ─── Create file/folder ───
  const openCreateFile = () => { setCreateType('file'); setCreateName(""); setShowCreateModal(true); };
  const openCreateFolder = () => { setCreateType('folder'); setCreateName(""); setShowCreateModal(true); };

  const handleCreate = async () => {
    if (!createName) return;
    if (createType === 'file') {
      const file = await createFile(createName, '', createName);
      // Sync new file to WebContainer
      if (webContainer && file?.path) {
        try {
          const dir = file.path.split('/').slice(0, -1).join('/');
          if (dir) await webContainer.fs.mkdir(dir, { recursive: true });
          await webContainer.fs.writeFile(file.path, file.content || '');
        } catch (err) {
          console.error("WebContainer write error:", err);
        }
      }
    }
    setShowCreateModal(false);
    setCreateName("");
    fetchFiles();
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d0d0d] text-[#c0c0c0] overflow-hidden select-none">

      {/* ─── Title Bar ─── */}
      <header className="h-10 flex items-center justify-between px-2 sm:px-4 bg-[#1a1a1a] border-b border-[#2a2a2a] shrink-0 gap-2">
        <div className="flex items-center gap-1 sm:gap-3 min-w-0">
          <button onClick={() => window.location.href = '/dashboard'} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#2a2a2a] text-zinc-500 hover:text-zinc-300 text-[10px] font-mono transition-all shrink-0">
            <ArrowLeft size={12} /> <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button onClick={() => setShowFileTree(!showFileTree)} className="p-1.5 rounded hover:bg-[#2a2a2a] text-zinc-500 hover:text-zinc-300 transition-colors lg:hidden">
            <Menu size={14} />
          </button>
          <div className="flex items-center gap-2 border-l border-[#2a2a2a] pl-2 sm:pl-3">
            <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-red-500'} ${isBuilding ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-mono tracking-wider text-zinc-500 hidden sm:inline">{isBuilding ? 'BOOTING' : isReady ? 'READY' : 'OFFLINE'}</span>
          </div>
          <span className="text-xs font-medium text-zinc-400 truncate max-w-[100px] sm:max-w-[200px]">
            {new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('name') || 'Project'}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Save */}
          <button onClick={handleManualSave} disabled={!dirty || saving} className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition-all disabled:opacity-30">
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            <span className="hidden sm:inline">{dirty ? 'Save' : 'Saved'}</span>
          </button>

          {/* GitHub */}
          <button onClick={gitConnected ? () => { const n = new URLSearchParams(window.location.search).get('name') || 'codemapers-project'; setPushRepoName(n); setShowPushModal(true); } : connectGitHub} disabled={pushing} className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition-all disabled:opacity-50">
            {pushing ? <Loader2 size={12} className="animate-spin" /> : <Github size={12} />}
            {pushing ? 'Pushing...' : gitConnected ? 'Push' : 'Git'}
          </button>

          {/* ZIP */}
          <button onClick={downloadZip} className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition-all">
            <Download size={12} /> ZIP
          </button>

          {/* Build (Expo only) */}
          {projectType === 'expo' && (
            <button onClick={() => setShowBuildModal(true)} className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-600/20 border border-indigo-600/30 text-indigo-400 hover:bg-indigo-600/30 text-[10px] font-medium transition-all">
              <Smartphone size={12} /> Build
            </button>
          )}

          {previewUrl && (
            <>
              <button onClick={openInNewTab} className="items-center gap-1.5 px-3 py-1 rounded bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/30 text-[10px] font-medium transition-all hidden sm:flex">
                <ExternalLink size={12} /> Open
              </button>
              <button onClick={() => setPreviewMinimized(!previewMinimized)} className="p-1.5 rounded hover:bg-[#2a2a2a] text-zinc-400 hover:text-white transition-colors">
                {previewMinimized ? <Monitor size={14} /> : <Globe size={14} />}
              </button>
            </>
          )}
          <button onClick={restartWebContainer} disabled={restarting} className="p-1.5 rounded hover:bg-[#2a2a2a] text-zinc-400 hover:text-white transition-colors disabled:opacity-30" title="Restart">
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
            <div className="flex items-center gap-2"><Check size={12} /> Pushed!{' '}<a href={pushResult.url} target="_blank" className="underline hover:text-emerald-200">Open Repo</a></div>
          ) : `Push failed: ${pushResult.error}`}
          <button onClick={() => setPushResult(null)} className="ml-2 opacity-50 hover:opacity-100"><X size={10} /></button>
        </div>
      )}

      {/* Push to GitHub modal */}
      {showPushModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60" onClick={() => setShowPushModal(false)}>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 w-96 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium text-white mb-1">Push to GitHub</h3>
            <p className="text-[10px] text-zinc-500 mb-4">Configure repo and push your code</p>

            <label className="text-[10px] text-zinc-400 font-mono mb-1 block">Repository Name</label>
            <input value={pushRepoName} onChange={e => setPushRepoName(e.target.value)}
              type="text" placeholder="my-project"
              className="w-full bg-black border border-[#333] rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-emerald-600 mb-4" />

            <div className="flex gap-3 mb-4">
              <button onClick={() => setPushIsPrivate(false)}
                className={`flex-1 px-3 py-2 rounded-lg border text-[10px] font-medium transition-all ${!pushIsPrivate ? 'bg-emerald-600/20 border-emerald-600/50 text-emerald-400' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}>
                <div className="text-xs mb-0.5">🌐 Public</div>
                <div className="text-[8px] opacity-60">Anyone can view</div>
              </button>
              <button onClick={() => setPushIsPrivate(true)}
                className={`flex-1 px-3 py-2 rounded-lg border text-[10px] font-medium transition-all ${pushIsPrivate ? 'bg-emerald-600/20 border-emerald-600/50 text-emerald-400' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}>
                <div className="text-xs mb-0.5">🔒 Private</div>
                <div className="text-[8px] opacity-60">Only you can see</div>
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPushModal(false)} className="px-4 py-1.5 rounded text-[11px] text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { setShowPushModal(false); pushToGithub(); }} disabled={!pushRepoName || pushing}
                className="px-4 py-1.5 rounded bg-emerald-600 text-white text-[11px] font-medium hover:bg-emerald-500 transition-colors disabled:opacity-30 flex items-center gap-1.5">
                {pushing ? <Loader2 size={12} className="animate-spin" /> : <Github size={12} />}
                {pushing ? 'Pushing...' : 'Push to GitHub'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Build modal (Expo) */}
      {showBuildModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60" onClick={() => setShowBuildModal(false)}>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium text-white mb-1">Build App</h3>
            <p className="text-[10px] text-zinc-500 mb-4">Select platform to build for production</p>
            <div className="space-y-3">
              <button onClick={() => { setShowBuildModal(false); window.open(`/expo-preview.html?name=${encodeURIComponent(new URLSearchParams(window.location.search).get('name') || 'Expo App')}&build=ios`, '_blank'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#333] bg-black hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center"><Smartphone size={16} className="text-indigo-400" /></div>
                <div className="text-left"><p className="text-[12px] font-medium text-white group-hover:text-indigo-300">iOS</p><p className="text-[9px] text-zinc-500">IPA for iPhone/iPad</p></div>
              </button>
              <button onClick={() => { setShowBuildModal(false); window.open(`/expo-preview.html?name=${encodeURIComponent(new URLSearchParams(window.location.search).get('name') || 'Expo App')}&build=android`, '_blank'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#333] bg-black hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center"><Smartphone size={16} className="text-emerald-400" /></div>
                <div className="text-left"><p className="text-[12px] font-medium text-white group-hover:text-emerald-300">Android</p><p className="text-[9px] text-zinc-500">APK/AAB for Play Store</p></div>
              </button>
            </div>
            <p className="text-[9px] text-zinc-700 mt-4 text-center">Uses EAS Build — push to GitHub first</p>
          </div>
        </div>
      )}

      {/* Create file/folder modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60" onClick={() => setShowCreateModal(false)}>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-5 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium text-white mb-1">New {createType === 'file' ? 'File' : 'Folder'}</h3>
            <p className="text-[10px] text-zinc-500 mb-3">Enter the {createType} name (e.g. src/components/Hero.tsx)</p>
            <input value={createName} onChange={e => setCreateName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} type="text" placeholder={createType === 'file' ? 'index.tsx' : 'components'} className="w-full bg-black border border-[#333] rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-emerald-600 mb-3" autoFocus />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-1.5 rounded text-[11px] text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-1.5 rounded bg-emerald-600 text-white text-[11px] font-medium hover:bg-emerald-500 transition-colors">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Area ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ─── File Tree ─── */}
        {showFileTree && (
          <aside className="w-48 sm:w-56 border-r border-[#2a2a2a] bg-[#111111] shrink-0 flex flex-col">
            <div className="h-8 flex items-center justify-between px-3 border-b border-[#2a2a2a]">
              <span className="text-[9px] font-mono tracking-widest text-zinc-600 uppercase">Files</span>
              <span className="text-[7px] text-zinc-800 font-mono">Ctrl+B</span>
              <div className="flex items-center gap-1">
                <button onClick={openCreateFile} className="p-0.5 rounded hover:bg-[#2a2a2a] text-zinc-600 hover:text-zinc-300 transition-colors" title="New file"><FilePlus2 size={11} /></button>
                <button onClick={openCreateFolder} className="p-0.5 rounded hover:bg-[#2a2a2a] text-zinc-600 hover:text-zinc-300 transition-colors" title="New folder"><FolderPlus size={11} /></button>
                <button onClick={() => fetchFiles()} className="p-0.5 rounded hover:bg-[#2a2a2a] text-zinc-600 hover:text-zinc-300 transition-colors"><RotateCw size={11} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pt-2">
              <FileTree files={files} onFileSelect={(f: any) => setActiveFile(f)} />
            </div>
          </aside>
        )}

        {/* ─── Editor + Terminal ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab bar */}
          <div className="h-9 flex items-center bg-[#181818] border-b border-[#2a2a2a] px-2 gap-1 shrink-0 overflow-x-auto pt-0.5">
            {files.map((f: any) => (
              <button key={f.id} onClick={() => setActiveFile(f)}
                className={`px-2 sm:px-3 py-1.5 text-[11px] font-mono rounded-t whitespace-nowrap transition-colors ${activeFile?.id === f.id ? 'bg-[#0d0d0d] text-white border-t border-x border-[#2a2a2a]' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {f.name}
              </button>
            ))}
            <div className="flex-1" />
            {dirty && <span className="text-[9px] text-amber-500 font-mono mr-2 shrink-0">unsaved</span>}
          </div>

          {/* Editor */}
          <div className="flex-1 bg-[#0d0d0d] min-h-0 relative">
            <MonacoEditor code={activeFile?.content || "// select a file..."} onChange={handleEditorChange} />
          </div>

          {/* Terminal */}
          {showTerminal ? (
            <div className="border-t border-[#2a2a2a] bg-[#0d0d0d] flex flex-col shrink-0" style={{ height: terminalHeight }}>
              {/* Drag handle */}
              <div
                onMouseDown={onTerminalDragStart}
                className="h-1.5 cursor-ns-resize bg-transparent hover:bg-indigo-500/30 active:bg-indigo-500/50 transition-colors shrink-0 relative -top-0.5 z-10"
              />
              <div className="h-7 flex items-center justify-between px-3 bg-[#181818] border-b border-[#2a2a2a] shrink-0">
                <div className="flex items-center gap-2"><TermIcon size={12} className="text-zinc-500" /><span className="text-[9px] font-mono tracking-widest text-zinc-600 uppercase">Terminal</span></div>
                <div className="flex items-center gap-2">
                  <span className="text-[7px] text-zinc-700 font-mono hidden sm:inline">Ctrl+`</span>
                  <button onClick={() => setShowTerminal(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors"><X size={11} /></button>
                </div>
              </div>
              <div className="flex-1 p-2 min-h-0"><Terminal onMount={(t: any) => { terminalRef.current = t; }} onData={(d: any) => shellWriter?.write(d)} /></div>
            </div>
          ) : (
            <button onClick={() => setShowTerminal(true)} className="h-6 bg-[#181818] border-t border-[#2a2a2a] flex items-center justify-center text-zinc-600 hover:text-zinc-300 text-[9px] font-mono tracking-widest uppercase shrink-0 gap-2"><TermIcon size={10} /> Terminal <span className="text-[7px] text-zinc-800 font-mono normal-case">Ctrl+`</span></button>
          )}
        </div>

        {/* ─── Chat ─── */}
        {showChat && (
          <aside className="w-72 sm:w-80 border-l border-[#2a2a2a] bg-[#111111] shrink-0 hidden md:block">
            <ChatSidebar projectId={projectId} onAction={handleAction} currentFiles={files} projectType={projectType} />
          </aside>
        )}
      </div>

      {/* ─── Draggable Preview ─── */}
      {previewUrl && !previewMinimized && (
        <Rnd default={{ x: 80, y: 80, width: 560, height: 380 }} minWidth={320} minHeight={200} bounds="window" className="z-50" dragHandleClassName="preview-handle"
          enableResizing={{ top: true, right: true, bottom: true, left: true, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}>
          <div className="w-full h-full bg-[#1a1a1a] rounded-lg shadow-2xl overflow-hidden border border-[#333] flex flex-col">
            <div className="preview-handle bg-[#222] px-3 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing select-none">
              <div className="flex items-center gap-2">
                <div className="flex gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" /><div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" /><div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" /></div>
                <span className="text-[10px] font-mono text-zinc-400 ml-3">Preview</span>
              </div>
              <div className="flex items-center gap-1">
                {projectType !== 'expo' && (
                  <div className="flex gap-0.5 mr-2">
                    {(['iphone', 'android', 'tablet', 'laptop'] as const).map(d => (
                      <button key={d} onClick={() => setDeviceMode(deviceMode === d ? 'none' : d)}
                        className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase transition-all ${deviceMode === d ? 'bg-indigo-600/30 text-indigo-300' : 'text-zinc-600 hover:text-zinc-300'}`}>
                        {d === 'iphone' ? '📱' : d === 'android' ? '🤖' : d === 'tablet' ? '📟' : '💻'}
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={openInNewTab} className="p-1 rounded hover:bg-[#333] text-zinc-400 hover:text-white transition-colors"><ExternalLink size={12} /></button>
                <button onClick={() => setPreviewMinimized(true)} className="p-1 rounded hover:bg-[#333] text-zinc-400 hover:text-white transition-colors"><Minimize2 size={12} /></button>
                <button onClick={() => setPreviewUrl("")} className="p-1 rounded hover:bg-[#333] text-zinc-400 hover:text-red-400 transition-colors"><X size={12} /></button>
              </div>
            </div>
            {projectType === 'expo' ? (
              <ExpoPreview projectName={new URLSearchParams(window.location.search).get('name') || 'Expo App'} url={expoServerUrl} />
            ) : deviceMode !== 'none' ? (
              <div className="flex-1 flex items-center justify-center bg-zinc-900 p-4 overflow-auto">
                {deviceMode === 'iphone' ? (
                  <div className="relative" style={{ width: 377, height: 814 }}>
                    <div className="absolute inset-0 rounded-[44px] bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-2xl" />
                    <div className="absolute inset-[3px] rounded-[41px] bg-black overflow-hidden shadow-inner">
                      {/* Dynamic Island */}
                      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full z-10 shadow-lg flex items-center justify-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700" />
                        <div className="w-5 h-1.5 rounded-full bg-zinc-800/60" />
                      </div>
                      {/* Speaker grille */}
                      <div className="absolute top-[16px] left-1/2 -translate-x-1/2 w-[46px] h-[2px] bg-zinc-800 rounded-full z-20 opacity-60" />
                      {/* Side buttons */}
                      <div className="absolute -left-[2px] top-[140px] w-[2px] h-[60px] bg-zinc-600 rounded-r" />
                      <div className="absolute -left-[2px] top-[210px] w-[2px] h-[50px] bg-zinc-600 rounded-r" />
                      <div className="absolute -left-[2px] top-[270px] w-[2px] h-[50px] bg-zinc-600 rounded-r" />
                      <div className="absolute -right-[2px] top-[160px] w-[2px] h-[70px] bg-zinc-600 rounded-l" />
                      {/* Screen */}
                      <div className="absolute inset-[6px] top-[52px] bottom-[6px] rounded-[36px] overflow-hidden bg-white">
                        <iframe src={previewUrl} className="w-full h-full" title="iPhone Preview" style={{ border: 'none' }} />
                      </div>
                      {/* Home indicator */}
                      <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white/80 rounded-full z-10" />
                    </div>
                  </div>
                ) : deviceMode === 'android' ? (
                  <div className="relative" style={{ width: 414, height: 917 }}>
                    <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-zinc-600 to-zinc-900 shadow-2xl" />
                    <div className="absolute inset-[3px] rounded-[29px] bg-black overflow-hidden shadow-inner">
                      {/* Punch hole camera top-left */}
                      <div className="absolute top-[16px] left-[28px] w-[10px] h-[10px] bg-zinc-900 rounded-full z-10 border-2 border-zinc-800" />
                      {/* Screen */}
                      <div className="absolute inset-[6px] top-[6px] bottom-[6px] rounded-[24px] overflow-hidden bg-white">
                        <iframe src={previewUrl} className="w-full h-full" title="Android Preview" style={{ border: 'none' }} />
                      </div>
                      {/* Navigation bar area */}
                      <div className="absolute bottom-0 left-0 right-0 h-[36px] bg-black/80 flex items-center justify-center gap-8 z-10">
                        <div className="w-[10px] h-[10px] rounded-full border-2 border-white/40" />
                        <div className="w-[16px] h-[10px] border-b-2 border-l-2 border-r-2 border-white/40 rounded-b-sm" />
                        <div className="w-[10px] h-[10px] border-2 border-white/40" />
                      </div>
                    </div>
                  </div>
                ) : deviceMode === 'tablet' ? (
                  <div className="relative" style={{ width: 822, height: 1182 }}>
                    <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-zinc-600 to-zinc-800 shadow-2xl" />
                    <div className="absolute inset-[3px] rounded-[21px] bg-black overflow-hidden shadow-inner">
                      {/* Camera dot (top center, landscape) */}
                      <div className="absolute top-[16px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] bg-zinc-900 rounded-full z-10 border border-zinc-700" />
                      {/* Screen */}
                      <div className="absolute inset-[6px] top-[6px] bottom-[6px] rounded-[16px] overflow-hidden bg-white">
                        <iframe src={previewUrl} className="w-full h-full" title="Tablet Preview" style={{ border: 'none' }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative" style={{ width: 1280, height: 750 }}>
                    {/* Laptop screen */}
                    <div className="absolute inset-0 rounded-t-[12px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-2xl overflow-hidden">
                      <div className="absolute inset-[3px] rounded-t-[10px] bg-black overflow-hidden">
                        {/* Webcam */}
                        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] bg-zinc-900 rounded-full z-10" />
                        {/* Screen */}
                        <div className="absolute inset-[4px] top-[14px] bottom-0 overflow-hidden bg-white">
                          <iframe src={previewUrl} className="w-full h-full" title="Laptop Preview" style={{ border: 'none' }} />
                        </div>
                      </div>
                    </div>
                    {/* Laptop base/keyboard */}
                    <div className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 w-[125%] h-[22px] bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-b-[8px] shadow-lg">
                      <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-[96%] h-[3px] bg-zinc-600 rounded-full" />
                      {/* Keyboard hint */}
                      <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[40%] h-[4px] bg-zinc-600/30 rounded" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <iframe src={previewUrl} className="w-full flex-1 bg-white" title="Preview" />
            )}
          </div>
        </Rnd>
      )}
    </div>
  );
}
