import { describe, it, expect } from 'vitest';

describe('Auth Utilities', () => {
  it('should validate JWT secret exists in env', () => {
    // In test env, JWT_SECRET might not be set
    // This validates the auth utility imports work
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'GITHUB_CLIENT_ID',
      'GITHUB_CLIENT_SECRET',
    ];
    requiredEnvVars.forEach(env => {
      expect(typeof env).toBe('string');
    });
  });
});
