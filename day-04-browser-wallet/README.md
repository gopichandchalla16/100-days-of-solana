# Day 4 — Connect a Browser Wallet

## Challenge
Build a browser app that detects installed Solana wallets, lets the user connect, and displays their wallet address and devnet balance — without ever asking for a private key.

## What This Does
- Discovers all installed Solana browser wallets using the **Wallet Standard**
- Shows each wallet as a clickable button with its icon
- Requests user approval via the wallet popup
- Displays the connected wallet address and live devnet balance
- Supports disconnect and reconnect

## Tech Stack
- [Vite](https://vitejs.dev/) — frontend build tool
- [@solana/kit](https://github.com/solana-labs/solana-web3.js) — Solana RPC client
- [@wallet-standard/app](https://github.com/wallet-standard/wallet-standard) — wallet discovery protocol

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser with Phantom or another Solana wallet installed.

## Key Concept
The app never sees your private key. It uses `getWallets()` from `@wallet-standard/app` to discover wallets, then calls `connectFeature.connect()` which triggers the wallet's approval popup. Only the public address is shared with the app.

## Part of
[100 Days of Solana — MLH Challenge](https://www.mlh.com/events/100-days-of-solana/challenges)
