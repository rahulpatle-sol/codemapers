"use client";
import { useState } from 'react';

export function useFileSystem(projectId: string, projectType: string = 'next') {
  const [files, setFiles] = useState<any[]>([]);

  const fetchFiles = async () => {
    if (!projectId) return;
    const res = await fetch(`/api/files?project_id=${projectId}`);
    const data = await res.json();
    
    if (data.files && data.files.length === 0) {
      const isVite = window.location.search.includes('type=vite');
      
      const defaultFiles = isVite ? [
        { name: 'package.json', path: 'package.json', content: '{"name":"vite-app","scripts":{"dev":"bun vite"},"dependencies":{"vite":"latest","react":"18.2.0","react-dom":"18.2.0"}}' },
        { name: 'index.html', path: 'index.html', content: '<div id="root"></div><script type="module" src="/src/main.tsx"></script>' },
        { name: 'main.tsx', path: 'src/main.tsx', content: 'import React from "react"; import ReactDOM from "react-dom/client"; ReactDOM.createRoot(document.getElementById("root")).render(<h1>Vite Solar</h1>);' }
      ] : [
        { name: 'package.json', path: 'package.json', content: '{"name":"next-app","scripts":{"dev":"bun next dev","build":"bun next build"},"dependencies":{"next":"14.2.0","react":"18.2.0","react-dom":"18.2.0"}}' },
        { name: 'page.tsx', path: 'app/page.tsx', content: 'export default function Home() { return <h1>Next Solar</h1> }' }
      ];

      const seeded: any[] = [];
      for (const f of defaultFiles) {
        const res = await fetch('/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project_id: projectId, ...f }),
        });
        const d = await res.json();
        if (d.file) seeded.push(d.file);
      }
      setFiles(seeded);
    } else {
      setFiles(data.files || []);
    }
  };

  const saveFile = async (id: string, content: string) => {
    await fetch(`/api/files/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  };

  const createFile = async (name: string, content: string, path: string) => {
    const res = await fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, name, content, path }),
    });
    const data = await res.json();
    if (data.file) setFiles(prev => [...prev, data.file]);
    return data.file;
  };

  return { files, fetchFiles, saveFile, createFile };
}
