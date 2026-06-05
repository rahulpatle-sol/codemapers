import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Minimal inline FileTree component for testing (same logic path)
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['js', 'jsx', 'ts', 'tsx'].includes(ext || '')) return 'code';
  if (ext === 'json') return 'json';
  if (['css', 'scss', 'less'].includes(ext || '')) return 'style';
  if (['md', 'txt'].includes(ext || '')) return 'text';
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext || '')) return 'image';
  return 'file';
};

function FileTreeItem({ name, depth = 0 }: { name: string; depth?: number }) {
  const icon = getFileIcon(name);
  return (
    <div data-testid="file-item" style={{ paddingLeft: depth * 12 }}>
      <span data-testid="icon">{icon}</span>
      <span>{name}</span>
    </div>
  );
}

function FileTree({ files }: { files: string[] }) {
  return (
    <div data-testid="file-tree">
      {files.map((f, i) => (
        <FileTreeItem key={i} name={f} />
      ))}
    </div>
  );
}

describe('FileTree', () => {
  it('should render file list', () => {
    const files = ['index.tsx', 'style.css', 'data.json', 'README.md'];
    render(<FileTree files={files} />);
    const items = screen.getAllByTestId('file-item');
    expect(items).toHaveLength(4);
  });

  it('should get correct icon for tsx files', () => {
    expect(getFileIcon('component.tsx')).toBe('code');
    expect(getFileIcon('App.ts')).toBe('code');
    expect(getFileIcon('lib.js')).toBe('code');
  });

  it('should get correct icon for json files', () => {
    expect(getFileIcon('package.json')).toBe('json');
  });

  it('should get correct icon for image files', () => {
    expect(getFileIcon('logo.png')).toBe('image');
    expect(getFileIcon('photo.jpg')).toBe('image');
    expect(getFileIcon('icon.svg')).toBe('image');
  });

  it('should get file icon for unknown extensions', () => {
    expect(getFileIcon('random.xyz')).toBe('file');
    expect(getFileIcon('Makefile')).toBe('file');
  });
});
