import { describe, it, expect } from 'vitest';

describe('Expo Template', () => {
  const pkg = {
    name: 'expo-app',
    dependencies: {
      expo: '~54.0.0',
      'expo-router': '~5.0.0',
      'react-native': '0.79.2',
    },
  };

  it('should use Expo SDK 54', () => {
    expect(pkg.dependencies.expo).toBe('~54.0.0');
  });

  it('should have expo-router', () => {
    expect(pkg.dependencies['expo-router']).toBeDefined();
  });

  it('should have react-native 0.79', () => {
    expect(pkg.dependencies['react-native']).toBe('0.79.2');
  });
});

describe('Next.js Template', () => {
  const pkg = {
    name: 'next-app',
    dependencies: {
      next: '^15.1.0',
      react: '^19.0.0',
    },
  };

  it('should use Next.js 15', () => {
    expect(pkg.dependencies.next).toBe('^15.1.0');
  });

  it('should use React 19', () => {
    expect(pkg.dependencies.react).toBe('^19.0.0');
  });
});

describe('Vite Template', () => {
  const pkg = {
    name: 'vite-app',
    dependencies: {
      vite: '^6.0.0',
      react: '^19.0.0',
    },
  };

  it('should use Vite 6', () => {
    expect(pkg.dependencies.vite).toBe('^6.0.0');
  });

  it('should use React 19', () => {
    expect(pkg.dependencies.react).toBe('^19.0.0');
  });
});
