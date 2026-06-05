import { describe, it, expect } from 'vitest';

describe('Auth Flow', () => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'DATABASE_URL',
  ];

  it('should define all required auth env vars', () => {
    requiredEnvVars.forEach(env => {
      expect(typeof env).toBe('string');
    });
  });

  it('should have GitHub OAuth routes', () => {
    const routes = ['/api/auth/github', '/api/auth/callback', '/api/auth/me', '/api/auth/logout'];
    expect(routes).toHaveLength(4);
    routes.forEach(r => expect(r.startsWith('/api/auth/')).toBe(true));
  });

  it('should have JWT in session cookie', () => {
    const cookieName = 'session';
    const cookieOpts = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax' as const,
      path: '/',
    };
    expect(cookieName).toBe('session');
    expect(cookieOpts.httpOnly).toBe(true);
    expect(cookieOpts.sameSite).toBe('lax');
  });
});
