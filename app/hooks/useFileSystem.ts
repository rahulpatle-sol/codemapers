"use client";
import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';

export function useFileSystem(projectId: string, projectType: string = 'next') {
  const [files, setFiles] = useState<any[]>([]);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

 // useFileSystem.ts mein fetchFiles function update karo
const fetchFiles = async () => {
  if (!projectId) return;
  const { data, error } = await supabase.from('files').select('*').eq('project_id', projectId);
  
  if (data && data.length === 0) {
    // Check if it's Vite or Next from URL params
    const isVite = window.location.search.includes('type=vite');
    
    const defaultFiles = isVite ? [
      { project_id: projectId, name: 'package.json', path: 'package.json', content: '{"name":"vite-app","scripts":{"dev":"vite"},"dependencies":{"vite":"latest","react":"18.2.0","react-dom":"18.2.0"}}' },
      { project_id: projectId, name: 'index.html', path: 'index.html', content: '<div id="root"></div><script type="module" src="/src/main.tsx"></script>' },
      { project_id: projectId, name: 'main.tsx', path: 'src/main.tsx', content: 'import React from "react"; import ReactDOM from "react-dom/client"; ReactDOM.createRoot(document.getElementById("root")).render(<h1>Vite Solar</h1>);' }
    ] : [
      { project_id: projectId, name: 'package.json', path: 'package.json', content: '{"name":"next-app","scripts":{"dev":"next dev"},"dependencies":{"next":"14.2.0","react":"18.2.0","react-dom":"18.2.0"}}' },
      { project_id: projectId, name: 'page.tsx', path: 'app/page.tsx', content: 'export default function Home() { return <h1>Next Solar</h1> }' }
    ];

    const { data: seeded } = await supabase.from('files').insert(defaultFiles).select();
    setFiles(seeded || []);
  } else {
    setFiles(data || []);
  }
};

  const saveFile = async (id: string, content: string) => {
    await supabase.from('files').update({ content }).eq('id', id);
  };

  const createFile = async (name: string, content: string, path: string) => {
    const { data } = await supabase.from('files').insert([{ project_id: projectId, name, content, path }]).select().single();
    if (data) setFiles(prev => [...prev, data]);
    return data;
  };

  return { files, fetchFiles, saveFile, createFile };
}