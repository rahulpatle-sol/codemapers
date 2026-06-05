"use client";
import React, { useState } from 'react';
import {
  FileCode, FileJson, CodeXml, File, ChevronRight,
  ChevronDown, Folder, FolderPlus, FilePlus2, RotateCw
} from 'lucide-react';

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

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx': return <FileCode size={13} className="text-yellow-500" />;
    case 'ts':
    case 'tsx': return <FileCode size={13} className="text-blue-400" />;
    case 'json': return <FileJson size={13} className="text-orange-400" />;
    case 'html': return <CodeXml size={13} className="text-orange-500" />;
    case 'css': return <CodeXml size={13} className="text-pink-400" />;
    default: return <File size={13} className="text-zinc-600" />;
  }
};

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
        className="w-full text-left px-3 py-1 text-[12px] text-zinc-400 hover:bg-[#1a1a1a] hover:text-white flex items-center gap-2 transition-colors"
        style={{ paddingLeft: `${depth * 14 + 12}px` }}
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
        className="w-full text-left px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
      >
        {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
        <Folder size={13} className="text-zinc-500" />
        <span className="truncate">{name}</span>
      </button>
      {isOpen && node.children && (
        <div>
          {Object.entries(node.children).map(([childName, childNode]) => (
            <TreeNode key={childName} name={childName} node={childNode} onFileSelect={onFileSelect} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FileTree({ files, onFileSelect, onRefresh, onCreateFile, onCreateFolder }: FileTreeProps) {
  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
        <RotateCw size={18} className="animate-spin text-zinc-500" />
        <span className="text-[10px] font-mono tracking-wider text-zinc-600">Loading...</span>
      </div>
    );
  }

  const tree = buildTree(files);

  return (
    <div className="py-1">
      {Object.entries(tree).map(([name, node]) => (
        <TreeNode key={name} name={name} node={node} onFileSelect={onFileSelect} />
      ))}
    </div>
  );
}
