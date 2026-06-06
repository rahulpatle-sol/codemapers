"use client";
import { useState } from 'react';

export function useFileSystem(projectId: string, projectType: string = 'next') {
  const [files, setFiles] = useState<any[]>([]);

  const fetchFiles = async () => {
    if (!projectId) return;
    const res = await fetch(`/api/files?project_id=${projectId}`);
    const data = await res.json();
    setFiles(data.files || []);
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
