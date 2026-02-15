# Rblx — Safe Social Gaming for Teens

A re-engineered social gaming platform designed for teenagers (13–17) with **safety-first architecture**. Rblx prevents predators at all costs through structural design, AI-powered grooming detection, and parent-gated social features.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Accounts

| Email | State | Description |
|---|---|---|
| `demo@rblx.com` | Parent Approved | Full access to all features |
| `locked@rblx.com` | Locked | Chat and friends locked, needs parent approval |
| Any other email | Locked | Creates new locked account |

Use any password to log in.

### Try Grooming Detection

1. Log in with `demo@rblx.com`
2. Go to **Chat** → open any conversation
3. Type **"test groomer"** and send — a simulated grooming message will appear with safety alerts

## Tech Stack

- **React 19** + **Vite 7** — fast dev and build
- **Tailwind CSS 4** — utility-first styling with custom design tokens
- **Lucide React** — icon library
- **react-router-dom 7** — client-side routing

## Features

### Safety (Core)
- **Parent-first safety gate** — all social features locked until parent approves
- **Anti-grooming detection** — AI pattern matching for 7 predatory behavior categories
- **Real-time risk scoring** — cumulative account risk with auto-actions
- **Profanity masking** — all curse words replaced with `######`, including leetspeak evasion
- **1-tap Block + Report** — always visible in chat and profile
- **No stranger DMs** — structurally blocked, not just a setting

### Platform
- **Discover** — experience browser with genre taxonomy and safety metadata
- **Chat** — safety-first messaging with grooming alerts and profanity filtering
- **Friends** — trust badges, safety labels, rate-limited requests
- **Profile** — safety status, badges, stats, recently played
- **Safety Dashboard** — threat log, safety score, detection categories, settings

### Design
- Premium dark UI with glassmorphism and brand gradient
- WCAG 2.2 accessibility (keyboard nav, focus states, reduced motion, contrast)
- Mobile-first responsive layout
- Micro-interactions with `prefers-reduced-motion` support

## Project Structure

```
src/
├── context/         # AuthContext (state machine) + SafetyContext (monitoring)
├── utils/           # profanityFilter.js + groomerDetection.js
├── components/      # Layout (TopNav, Sidebar, AppLayout)
├── pages/           # Login, SafetyGate, Discover, Profile, Friends, Chat, Safety
docs/
├── PRD.md           # Full Product Requirements Document
└── BACKEND_SPEC.md  # Backend-ready API specification
```

## Documentation

- [`docs/PRD.md`](docs/PRD.md) — Full PRD with state machine, taxonomy, edge cases, accessibility
- [`docs/BACKEND_SPEC.md`](docs/BACKEND_SPEC.md) — API schemas, moderation pipeline, WebSocket events

## Brand Colors

| Token | Hex |
|---|---|
| Bright Magenta | `#D24C8F` |
| Pink-Purple | `#B14A9A` |
| Medium Violet | `#8A4AA6` |
| Deep Purple | `#5A3E8E` |
| Indigo Edge | `#3C2F63` |
| Accent Blue | `#7CC6D9` |
