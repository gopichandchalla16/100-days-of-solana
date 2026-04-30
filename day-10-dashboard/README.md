# Day 10 — Solana Devnet Dashboard

> **100 Days of Solana** | Arc Theme: Reading the Blockchain

## What I built
A browser-based dashboard using Vite + `@solana/kit` that lets you look up **any Solana devnet address** and see its live SOL balance and 5 most recent transactions — all in a clean dark UI.

## Features
- 🔍 Search any devnet address
- 💰 Live SOL balance display
- 📜 Last 5 transactions with signature, slot, timestamp, and status
- 🔗 Clickable signatures → open in Solana Explorer
- ⚠️ Error handling for invalid addresses
- ⏳ Loading state while fetching

## Setup & Run
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

## What I learned
- The same `@solana/kit` RPC calls (Days 8 & 9) work identically in the browser
- Vite bundles `@solana/kit` for browser use seamlessly
- Error handling is critical in browser apps (vs terminal where crashes are fine)
- `try/catch` around RPC calls handles bad addresses and network errors gracefully
- Moving from `console.log` to DOM rendering is the bridge from Web2 to Web3 frontend

## Key Concept
> Days 8 & 9 = backend terminal scripts
> Day 10 = frontend browser app
> **Same RPC calls. Different output target.**

## Tech Stack
- `@solana/kit` — Solana TypeScript SDK
- Vite — Dev server & bundler
- Vanilla JS + HTML/CSS — No framework needed

## Resources
- [Vite Getting Started](https://vitejs.dev/guide/)
- [Solana Kit docs](https://www.solanakit.com/docs)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
