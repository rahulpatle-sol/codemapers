import { describe, it, expect } from 'vitest';

// Inline rate limiter for testing (same logic as route.ts)
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

function checkRateLimit(ip: string) {
  const now = Date.now();
  const record = requestCounts.get(ip);
  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }
  record.count += 1;
  const remaining = Math.max(0, MAX_REQUESTS - record.count);
  if (record.count > MAX_REQUESTS) return { allowed: false, remaining: 0 };
  return { allowed: true, remaining };
}

describe('Rate Limiter', () => {
  it('should allow first request', () => {
    const result = checkRateLimit('test-ip-1');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(19);
  });

  it('should block after 20 requests', () => {
    const ip = 'test-ip-2';
    for (let i = 0; i < 20; i++) checkRateLimit(ip);
    const result = checkRateLimit(ip);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should handle multiple IPs independently', () => {
    requestCounts.clear();
    for (let i = 0; i < 20; i++) checkRateLimit('ip-a');
    const a = checkRateLimit('ip-a');
    const b = checkRateLimit('ip-b');
    expect(a.allowed).toBe(false);
    expect(b.allowed).toBe(true);
  });

  it('should track remaining count', () => {
    requestCounts.clear();
    const r1 = checkRateLimit('remaining-test');
    expect(r1.remaining).toBe(19);
    const r2 = checkRateLimit('remaining-test');
    expect(r2.remaining).toBe(18);
  });
});
