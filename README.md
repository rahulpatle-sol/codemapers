<div align="center">

# ⚡ CodeMapers

**The AI-Orchestrated Cloud IDE — Build, Preview & Deploy from Your Browser**

[![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Groq](https://img.shields.io/badge/Groq-10a37f?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)
[![PostgreSQL](https://img.shields.io/badge/NeonDB-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![License](https://img.shields.io/badge/License-MIT-f5b041?style=for-the-badge)](LICENSE)

<p align="center">
  <img src="https://img.shields.io/badge/dynamic/json?color=10a37f&label=AI%20Model&query=%24.model&url=https%3A%2F%2Fraw.githubusercontent.com%2Frahulpatle-sol%2Fcodemapers%2Fmain%2Fpackage.json&style=plastic" />
  <img src="https://img.shields.io/github/last-commit/rahulpatle-sol/codemapers?style=plastic&color=6366f1" />
  <img src="https://img.shields.io/badge/status-Active-success?style=plastic" />
</p>

---

## 📸 Demo

> **Next.js 15** · **Vite 6** · **Expo SDK 54** — Three frameworks, one IDE.

</div>

---

## ✨ Features

### 🤖 AI Agent Chat
- **Context-aware** — understands your whole project, not just one file
- **Groq LLM** — fast inference with `llama-3.3-70b-versatile`
- **File-aware responses** — AI reads current files, suggests changes
- **Auto file write** — AI can create & modify files directly
- **Custom API key** — bring your own Groq key

### 📝 Multi-Framework Editor
| Framework | Auto-Config | Live Preview | Device Frames |
|:---|:---:|:---:|:---:|
| Next.js 15 | ✓ SSR + App Router | ✓ HMR | ✓ Mobile/Tablet/Laptop |
| Vite 6 React | ✓ Fast Refresh | ✓ HMR | ✓ Mobile/Tablet/Laptop |
| Expo SDK 54 | ✓ Expo Router | ✓ QR + Expo Go | ✓ iPhone/Android/iPad |

### 💻 Full IDE Features
- **Monaco Editor** — VS Code-quality code editing with syntax highlighting
- **File Tree** — create, rename, delete files & folders
- **Real Terminal** — `xterm.js` with `jsh` shell, `Ctrl+C` kill, command history
- **Resizable panels** — drag to resize terminal, file tree, preview
- **Auto-save** — debounced save to database (1.5s)
- **Keyboard shortcuts** — `Ctrl+`` ` terminal · `Ctrl+B` file tree · `Ctrl+\` chat

### 🚀 Deploy & Push
- **GitHub Push** — create public/private repos, push code with one click
- **ZIP Download** — export entire project as archive
- **One-click Open** — preview in new tab

### 📱 Responsive Device Preview
- **iPhone** — Dynamic Island, bezels, home bar
- **Android** — punch hole camera, nav buttons
- **iPad** — slim bezels, camera dot
- **Laptop** — screen + keyboard base

### 🧪 Built-in Testing
- **Vitest** + **@testing-library/react** — 22+ tests
- Component & integration tests

---

## 🎯 How It Works

### 1. Create a Project
```
Dashboard → "New Architecture" → Pick Name + Framework → Enter IDE
```

### 2. Code with AI
```
Open a file → Monaco Editor → Type code
OR
Open Chat → Describe what to build → AI writes files
```

### 3. See Live Preview (Web Frameworks)
```
Next.js / Vite → WebContainer boots → npm install → dev server starts
Edit code → auto-save → HMR → preview updates instantly
```

### 4. Preview Expo (Mobile)
```
Expo project → WebContainer boots → Metro starts → QR code generated
Scan QR with Expo Go on phone → changes hot-reload on device
```

### 5. Push to GitHub
```
IDE Toolbar → Push button → Set repo name → Public/Private → Push
Visit `https://github.com/{user}/{repo}` to see your code
```

### 6. Download or Build
```
ZIP — Download complete project as archive
Build (Expo) — iOS/Android options (requires EAS)
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│                  Browser                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Monaco    │ │ Terminal │ │ AI Chat      │ │
│  │ Editor    │ │ (xterm)  │ │ (Groq LLM)   │ │
│  └────┬─────┘ └────┬─────┘ └──────┬───────┘ │
│       │            │               │         │
│  ┌────▼────────────▼───────────────▼───────┐ │
│  │         WebContainer API                │ │
│  │  (Node.js + npm + dev server in-browser)│ │
│  └────────────────┬────────────────────────┘ │
└───────────────────┼──────────────────────────┘
                    │
┌───────────────────▼──────────────────────────┐
│           Next.js API Routes                 │
│  ┌────────┐ ┌────────┐ ┌───────┐ ┌────────┐ │
│  │ Auth   │ │Files   │ │  AI   │ │ GitHub │ │
│  │ OAuth  │ │ CRUD   │ │ Chat  │ │  Sync  │ │
│  └───┬────┘ └───┬────┘ └───┬───┘ └───┬────┘ │
└──────┼──────────┼──────────┼─────────┼───────┘
       │          │          │         │
┌──────▼──────────▼──────────▼─────────▼───────┐
│           External Services                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│  │GitHub  │ │NeonDB  │ │Groq    │ │Cloudin-│ │
│  │ OAuth  │ │(PG)    │ │ API    │ │ary     │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ │
└──────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Category | Technology |
|:---|:---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Framer Motion |
| **Editor** | Monaco Editor (CodeMirror-based) |
| **Terminal** | xterm.js + jsh shell |
| **AI** | Groq API (llama-3.3-70b-versatile) |
| **Container** | WebContainer API |
| **Database** | NeonDB (PostgreSQL) |
| **Auth** | GitHub OAuth + Google OAuth |
| **File Storage** | PostgreSQL + Cloudinary (images) |
| **Image Opt** | sharp (resize + webp) |
| **DevTools** | @expo/next-adapter, react-rnd |
| **Testing** | Vitest + @testing-library/react |

---

## 🚀 Local Setup

```bash
# 1. Clone
git clone https://github.com/rahulpatle-sol/codemapers.git
cd codemapers

# 2. Install
npm install

# 3. Set environment variables (.env.local)
cat > .env.local << EOF
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/codemapers?sslmode=require
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
GROQ_API_KEY=your-groq-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
EOF

# 4. Run
npm run dev
```

> ⚠️ **NeonDB tables** must exist. Run `schema.sql` if not already created.
> The `files` table requires `UNIQUE (project_id, path)` for upsert queries.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|:---|:---:|:---|
| `DATABASE_URL` | ✅ | NeonDB/PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret for JWT token signing |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public URL of your deployment |
| `GITHUB_CLIENT_ID` | ✅ | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | ✅ | GitHub OAuth App client secret |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret |
| `GROQ_API_KEY` | ✅ | Groq API key for AI chat |
| `CLOUDINARY_CLOUD_NAME` | ❌ | Cloudinary cloud name (falls back to local) |
| `CLOUDINARY_API_KEY` | ❌ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ❌ | Cloudinary API secret |

---

## 📁 Project Structure

```
codemapers/
├── app/
│   ├── (auth)/login/        # Login page (GitHub/Google)
│   ├── (dashbord)/
│   │   ├── dashboard/       # Project list + create
│   │   └── project/[id]/    # Main IDE page
│   ├── api/                 # API routes
│   │   ├── auth/            # GitHub/Google OAuth
│   │   ├── ai/chat/         # Groq AI chat
│   │   ├── files/           # File CRUD
│   │   ├── projects/        # Project CRUD
│   │   └── github/          # GitHub sync
│   └── components/          # UI components
│       ├── editor/          # Monaco, Terminal, FileTree, ExpoPreview
│       └── ai/              # ChatSidebar
├── hooks/                   # useFileSystem, useWebContainer
├── lib/                     # db, auth-utils, rate-limiter, cloudinary
└── tests/                   # Vitest test files
```

---

## 📋 Keyboard Shortcuts

| Shortcut | Action |
|:---|:---|
| `Ctrl` + `` ` `` | Toggle terminal |
| `Ctrl` + `B` | Toggle file tree |
| `Ctrl` + `\` | Toggle AI chat |
| `Ctrl` + `S` | Save current file |

---

## 🧪 Running Tests

```bash
npm test
```

```
✓ rate-limiter — IP-based rate limiting (20 req/min)
✓ templates — Expo/Vite/Next template generation
✓ auth-flow — OAuth state validation
✓ file-tree — FileTree component rendering
✓ example — Basic component test
✓ auth-env — Environment validation
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

<div align="center">

---

**Built with ☕ & code by [Rahul Patle](https://rahulpatle.xyz)**

[![GitHub](https://img.shields.io/badge/GitHub-rahulpatle--sol-181717?style=flat&logo=github)](https://github.com/rahulpatle-sol)
[![Website](https://img.shields.io/badge/Web-rahulpatle.xyz-6366f1?style=flat&logo=vercel)](https://rahulpatle.xyz)

</div>