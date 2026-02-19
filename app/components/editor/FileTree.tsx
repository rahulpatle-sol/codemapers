"use client";
import React, { useState } from 'react';
import { 
  FileCode, FileJson, CodeXml, File, ChevronRight, 
  ChevronDown, Folder, FolderPlus, FilePlus2, RotateCw 
} from 'lucide-react';

// --- 1. Definitive Types ---
interface FileNode {
  path: string;
  content?: string;
  isFile: boolean;
  children?: Record<string, FileNode>;
}

interface FileTreeProps {
  files: Array<{ path: string; content?: string }>;
  onFileSelect: (file: any) => void;
  onRefresh?: () => void;
  onCreateFile?: () => void;
  onCreateFolder?: () => void;
}

// --- 2. Icon Helper (With Proper Typing) ---
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx': return <FileCode size={14} className="text-yellow-600" />;
    case 'ts':
    case 'tsx': return <FileCode size={14} className="text-blue-600" />;
    case 'json': return <FileJson size={14} className="text-orange-600" />;
    case 'html': return <CodeXml size={14} className="text-orange-800" />;
    case 'css': return <CodeXml size={14} className="text-pink-600" />;
    default: return <File size={14} className="text-[#2b2b2b]/40" />;
  }
};

// --- 3. Tree Builder (Fixed Logic) ---
const buildTree = (files: Array<{ path: string; content?: string }>) => {
  const root: Record<string, FileNode> = {};
  files.forEach(file => {
    const parts = file.path.split('/');
    let current = root;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = { ...file, isFile: true };
      } else {
        if (!current[part]) {
          current[part] = { path: parts.slice(0, index + 1).join('/'), isFile: false, children: {} };
        }
        current = current[part].children!;
      }
    });
  });
  return root;
};

// --- 4. Sub-Component: TreeNode ---
const TreeNode = ({ name, node, onFileSelect, depth = 0 }: { 
  name: string; 
  node: FileNode; 
  onFileSelect: (f: any) => void; 
  depth?: number 
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.isFile) {
    return (
      <button 
        onClick={() => onFileSelect(node)}
        className="w-full text-left px-4 py-1 text-[11px] text-[#2b2b2b] hover:bg-[#2b2b2b]/5 flex items-center gap-2 transition-colors font-serif"
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
        className="w-full text-left px-2 py-1 text-[11px] text-[#2b2b2b]/70 hover:text-[#2b2b2b] flex items-center gap-1 font-bold transition-colors font-serif"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <Folder size={14} className={`${isOpen ? 'text-[#2b2b2b]' : 'text-[#2b2b2b]/40'} fill-current`} />
        <span className="truncate uppercase tracking-tighter">{name}</span>
      </button>
      {isOpen && node.children && (
        <div className="border-l border-[#2b2b2b]/10 ml-[14px]">
          {Object.entries(node.children).map(([childName, childNode]) => (
            <TreeNode key={childName} name={childName} node={childNode} onFileSelect={onFileSelect} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- 5. Main Component ---
export default function FileTree({ files, onFileSelect, onRefresh, onCreateFile, onCreateFolder }: FileTreeProps) {
  if (!files || files.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-3 opacity-40 bg-[#f4f1ea] h-full">
        <RotateCw size={20} className="animate-spin text-[#2b2b2b]" />
        <span className="text-[10px] font-serif font-black uppercase tracking-[0.2em]">Archiving_FS...</span>
      </div>
    );
  }

  const tree = buildTree(files);

  return (
    <div className="flex flex-col h-full bg-[#f4f1ea] border-r-2 border-[#2b2b2b]/10">
      {/* --- NEWSPAPER STYLE HEADER --- */}
      <div className="p-3 border-b-2 border-[#2b2b2b] flex items-center justify-between group bg-[#ece9e0]">
        <span className="text-[10px] font-black text-[#2b2b2b] uppercase tracking-widest font-serif">Files_Archive</span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onCreateFile} className="hover:text-black text-[#2b2b2b]/60 transition-colors">
            <FilePlus2 size={14} />
          </button>
          <button onClick={onCreateFolder} className="hover:text-black text-[#2b2b2b]/60 transition-colors">
            <FolderPlus size={14} />
          </button>
          <button onClick={onRefresh} className="hover:text-black text-[#2b2b2b]/60 transition-colors">
            <RotateCw size={14} />
          </button>
        </div>
      </div>

      {/* --- TREE CONTENT --- */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        {Object.entries(tree).map(([name, node]) => (
          <TreeNode key={name} name={name} node={node} onFileSelect={onFileSelect} />
        ))}
      </div>
    </div>
  );
}