import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { query } from '@/app/lib/db';

const TEMPLATES: Record<string, Array<{ name: string; path: string; content: string }>> = {
  expo: [
    { name: 'package.json', path: 'package.json', content: JSON.stringify({ name: 'expo-app', version: '1.0.0', scripts: { start: 'expo start --web', android: 'expo start --android' }, dependencies: { expo: '~54.0.0', react: '19.0.0', 'react-native': '0.79.2', 'expo-router': '~5.0.0', 'react-native-screens': '~4.10.0', 'expo-linking': '~7.0.0', 'expo-constants': '~17.0.0', 'react-native-safe-area-context': '~5.4.0', 'react-native-gesture-handler': '~2.24.0', 'react-native-web': '~0.19.0', 'react-dom': '19.0.0' }, devDependencies: { typescript: '~5.8.0', '@types/react': '~19.0.0' } }, null, 2) },
    { name: 'app.json', path: 'app.json', content: JSON.stringify({ expo: { name: 'expo-app', slug: 'expo-app', platforms: ['ios', 'android'], version: '1.0.0', scheme: 'expo-app', plugins: ['expo-router'] } }, null, 2) },
    { name: '_layout.tsx', path: 'app/_layout.tsx', content: 'import { Stack } from "expo-router";\n\nexport default function RootLayout() {\n  return <Stack screenOptions={{ contentStyle: { backgroundColor: "#0d0d0d" } }} />;\n}' },
    { name: 'index.tsx', path: 'app/index.tsx', content: 'import { Text, View, StyleSheet } from "react-native";\nimport { Link } from "expo-router";\n\nexport default function Index() {\n  return (\n    <View style={styles.container}>\n      <Text style={styles.title}>CodeMapers Expo</Text>\n      <Text style={styles.subtitle}>Built with AI</Text>\n      <Link href="/details" style={styles.link}>Get Started</Link>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d0d0d" },\n  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },\n  subtitle: { fontSize: 14, color: "#888", marginTop: 8 },\n  link: { marginTop: 20, color: "#6366f1", fontSize: 14, fontWeight: "600" },\n});' },
    { name: 'details.tsx', path: 'app/details.tsx', content: 'import { Text, View, StyleSheet } from "react-native";\nimport { Link } from "expo-router";\n\nexport default function Details() {\n  return (\n    <View style={styles.container}>\n      <Text style={styles.title}>Details Screen</Text>\n      <Text style={styles.subtitle}>Your Expo app is working!</Text>\n      <Link href="/" style={styles.link}>Go Back</Link>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d0d0d" },\n  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },\n  subtitle: { fontSize: 14, color: "#888", marginTop: 8 },\n  link: { marginTop: 20, color: "#6366f1", fontSize: 14, fontWeight: "600" },\n});' },
    { name: 'App.tsx', path: 'App.tsx', content: 'import { ExpoRoot } from "expo-router";\n\nconst ctx = require.context("./app");\n\nexport default function App() {\n  return <ExpoRoot context={ctx} />;\n}' },
    { name: 'tsconfig.json', path: 'tsconfig.json', content: JSON.stringify({ extends: 'expo/tsconfig.base', compilerOptions: { strict: true } }, null, 2) },
  ],
  vite: [
    { name: 'package.json', path: 'package.json', content: JSON.stringify({ name: 'vite-app', private: true, scripts: { dev: 'vite', build: 'vite build' }, dependencies: { vite: '^6.0.0', react: '^19.0.0', 'react-dom': '^19.0.0' }, devDependencies: { typescript: '^5.6.0', '@types/react': '^19.0.0', '@vitejs/plugin-react': '^4.3.0' } }, null, 2) },
    { name: 'vite.config.ts', path: 'vite.config.ts', content: 'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nexport default defineConfig({ plugins: [react()] });' },
    { name: 'tsconfig.json', path: 'tsconfig.json', content: '{"compilerOptions":{"target":"ES2020","module":"ESNext","jsx":"react-jsx","strict":true,"moduleResolution":"bundler"}}' },
    { name: 'index.html', path: 'index.html', content: '<!DOCTYPE html><html><head><meta charset="UTF-8" /></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>' },
    { name: 'main.tsx', path: 'src/main.tsx', content: 'import React from "react"; import ReactDOM from "react-dom/client"; import App from "./App";\nReactDOM.createRoot(document.getElementById("root")!).render(<App />);' },
    { name: 'App.tsx', path: 'src/App.tsx', content: 'export default function App() { return <h1 style={{fontFamily:"system-ui",padding:"2rem"}}>Vite + React</h1>; }' },
  ],
  next: [
    { name: 'package.json', path: 'package.json', content: JSON.stringify({ name: 'next-app', version: '0.1.0', private: true, scripts: { dev: 'next dev', build: 'next build', start: 'next start' }, dependencies: { next: '^15.1.0', react: '^19.0.0', 'react-dom': '^19.0.0' }, devDependencies: { typescript: '^5.6.0', '@types/react': '^19.0.0', '@types/node': '^22.0.0', '@types/react-dom': '^19.0.0' } }, null, 2) },
    { name: 'tsconfig.json', path: 'tsconfig.json', content: '{"compilerOptions":{"target":"ES2017","lib":["dom","dom.iterable","esnext"],"allowJs":true,"skipLibCheck":true,"strict":true,"noEmit":true,"esModuleInterop":true,"module":"esnext","moduleResolution":"bundler","resolveJsonModule":true,"isolatedModules":true,"jsx":"preserve","incremental":true,"plugins":[{"name":"next"}],"paths":{"@/*":["./*"]}}},"include":["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],"exclude":["node_modules"]}' },
    { name: 'layout.tsx', path: 'app/layout.tsx', content: 'import type { Metadata } from "next";\nexport const metadata: Metadata = { title: "CodeMapers App" };\nexport default function RootLayout({children}:{children:React.ReactNode}){return(<html lang="en"><body style={{margin:0,fontFamily:"system-ui"}}>{children}</body></html>);}' },
    { name: 'page.tsx', path: 'app/page.tsx', content: 'export default function Home() { return <h1 style={{padding:"2rem"}}>Next.js + CodeMapers</h1>; }' },
  ],
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { rows } = await query(
    'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
    [user.id]
  );
  return NextResponse.json({ projects: rows });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, type } = await request.json();
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  const projectType = type || 'next';
  const { rows: projectRows } = await query(
    'INSERT INTO projects (name, type, user_id) VALUES ($1, $2, $3) RETURNING *',
    [name, projectType, user.id]
  );
  const project = projectRows[0];

  // Seed template files server-side (same request, no race condition)
  const templateFiles = TEMPLATES[projectType] || TEMPLATES.next;
  const seededFiles = [];
  for (const f of templateFiles) {
    const { rows: fileRows } = await query(
      `INSERT INTO files (project_id, name, content, path)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (project_id, path) DO UPDATE SET content = $3
       RETURNING *`,
      [project.id, f.name, f.content, f.path]
    );
    seededFiles.push(fileRows[0]);
  }

  return NextResponse.json({ project, files: seededFiles });
}
