"use client";
import React, { useState } from 'react';
import { 
  FileCode, FileJson, CodeXml, File, ChevronRight, 
  ChevronDown, Folder, FolderPlus, FilePlus2, RotateCw 
} from 'lucide-react';

// 1. Icon Helper: Extension ke hisaab se color aur icon
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx': return <FileCode size={14} className="text-yellow-400" />;
    case 'ts':
    case 'tsx': return <FileCode size={14} className="text-blue-400" />;
    case 'json': return <FileJson size={14} className="text-orange-400" />;
    case 'html': return <CodeXml size={14} className="text-orange-600" />;
    case 'css': return <CodeXml size={14} className="text-pink-400" />;
    default: return <File size={14} className="text-zinc-500" />;
  }
};

// 2. Tree Builder: Flat files ko nested folders mein convert karta hai
const buildTree = (files: any[]) => {
  const root: any = {};
  files.forEach(file => {
    const parts = file.path.split('/');
    let current = root;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = { ...file, isFile: true };
      } else {
        if (!current[part]) current[part] = { isFile: false, children: {} };
        current = current[part].children;
      }
    });
  });
  return root;
};

const TreeNode = ({ name, node, onFileSelect, depth = 0 }: any) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.isFile) {
    return (
      <button 
        onClick={() => onFileSelect(node)}
        className="w-full text-left px-4 py-1 text-[11px] text-zinc-400 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors"
        style={{ paddingLeft: `${depth * 12 + 16}px` }}
      >
        {getFileIcon(name)}
        <span className="truncate">{name}</span>
      </button>
    );
  }

  return (
    <div>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 font-semibold transition-colors"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <Folder size={14} className={`${isOpen ? 'text-amber-400/80' : 'text-amber-500/60'} fill-current`} />
        <span className="truncate uppercase tracking-tighter">{name}</span>
      </button>
      {isOpen && (
        <div className="border-l border-white/5 ml-[14px]">
          {Object.entries(node.children).map(([childName, childNode]: any) => (
            <TreeNode key={childName} name={childName} node={childNode} onFileSelect={onFileSelect} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FileTree({ files, onFileSelect, onRefresh, onCreateFile, onCreateFolder }: any) {
  if (!files || files.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-3 opacity-20">
        <RotateCw size={20} className="animate-spin text-indigo-500" />
        <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Syncing_FS...</span>
      </div>
    );
  }

  const tree = buildTree(files);

  return (
    <div className="flex flex-col h-full bg-[#080808]">
      {/* --- VS CODE STYLE HEADER --- */}
      <div className="p-3 border-b border-white/5 flex items-center justify-between group">
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Explorer</span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onCreateFile} className="hover:text-white text-zinc-500 transition-colors" title="New File">
            <FilePlus2 size={14} />
          </button>
          <button onClick={onCreateFolder} className="hover:text-white text-zinc-500 transition-colors" title="New Folder">
            <FolderPlus size={14} />
          </button>
          <button onClick={onRefresh} className="hover:text-white text-zinc-500 transition-colors" title="Refresh">
            <RotateCw size={14} />
          </button>
        </div>
      </div>

      {/* --- TREE CONTENT --- */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        {Object.entries(tree).map(([name, node]: any) => (
          <TreeNode key={name} name={name} node={node} onFileSelect={onFileSelect} />
        ))}
      </div>
    </div>
  );
}