# Day 10 — Solana Devnet Dashboard

> **100 Days of Solana** | Arc Theme: Reading the Blockchain

## What I built
A dark-themed browser dashboard using Vite + `@solana/kit` that fetches **live on-chain data** from Solana devnet — SOL balance and 5 recent transactions — for any address entered by the user.

## Features
- 🔍 Search any devnet address
- 💰 Live SOL balance (green)
- 📜 Last 5 transactions with signature, slot, timestamp, status
- 🔗 Clickable signatures → Solana Explorer (devnet)
- ⚠️ Error handling for invalid addresses / network failures
- ⏳ Loading spinner while fetching
- ⚡ Auto-fetches Token-2022 address on page load

## Setup

### Option A — Vite (Official)
```bash
# Inside WSL / Ubuntu terminal
npm create vite@latest day-10-dashboard -- --template vanilla
cd day-10-dashboard
npm install
npm install @solana/kit
# Copy index.html, main.js, style.css from this repo
npm run dev
```
Open http://localhost:5173

### Option B — Standalone (No build tools)
Open `dashboard-standalone.html` directly in any browser. Uses Solana JSON RPC via `fetch()` — no npm needed.

## What I learned
- `@solana/kit` works identically in Node.js AND the browser — Vite bundles it automatically
- Days 8 & 9 RPC calls (`getBalance`, `getSignaturesForAddress`) are identical in browser vs terminal
- Error handling is more critical in browser apps — users need readable feedback, not stack traces
- Moving from `console.log` to DOM rendering = the bridge from Web2 backend scripts to Web3 frontend
- `fetch()` can call Solana JSON RPC directly without any SDK (vanilla JS option)

## Key Concept
> Days 8 & 9 = backend terminal (`console.log`)
> Day 10 = frontend browser (`innerHTML`)
> **Same RPC. Different destination.**

## Resources
- [Vite Getting Started](https://vitejs.dev/guide/)
- [Solana Kit docs](https://www.solanakit.com/docs)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
- [Solana JSON RPC docs](https://solana.com/docs/rpc)
