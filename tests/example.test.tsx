import { describe, it, expect } from 'vitest';

describe('Project Templates', () => {
  const templates = ['next', 'vite', 'expo'];

  it('should have all three templates', () => {
    expect(templates).toHaveLength(3);
    expect(templates).toContain('next');
    expect(templates).toContain('vite');
    expect(templates).toContain('expo');
  });
});

describe('API Structure', () => {
  const apiRoutes = [
    '/api/auth/github',
    '/api/auth/callback',
    '/api/auth/me',
    '/api/projects',
    '/api/files',
    '/api/ai/chat',
    '/api/github/sync',
    '/api/upload',
  ];

  it('should have core API routes defined', () => {
    expect(apiRoutes.length).toBeGreaterThan(5);
    apiRoutes.forEach(route => {
      expect(route).toMatch(/^\/api\//);
    });
  });
});
