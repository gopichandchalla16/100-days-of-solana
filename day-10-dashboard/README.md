# Day 10 — Solana Devnet Dashboard

> **100 Days of Solana** | Arc Theme: Reading the Blockchain

## What I built
A **zero-dependency browser dashboard** that reads live Solana devnet data for any address. No Vite, no npm, no build step — just open `index.html` directly in your browser. Calls the Solana RPC API using the browser's native `fetch()`.

## Features
- 🔍 Search any Solana devnet address
- 💰 Live SOL balance with animated number counter
- 📜 Last 5 transactions — signature, slot, timestamp, status
- 🔗 Clickable signatures → open in Solana Explorer
- ⚠️ Error handling for invalid addresses and network issues
- ⏳ Loading state with spinner
- 🎨 Dark themed UI with Solana brand colors

## How to run
**Option 1 — Open directly in browser:**
```
Just double-click index.html — no server needed!
```

**Option 2 — Simple HTTP server (if CORS issues):**
```bash
# Python (from the day-10-dashboard folder)
python3 -m http.server 8080
# Open http://localhost:8080
```

## How it works
This dashboard calls the [Solana JSON-RPC API](https://solana.com/docs/rpc) directly using the browser's built-in `fetch()`. No SDK needed — the RPC endpoints are standard HTTP POST requests.

```js
// Example: Get balance
const res = await fetch('https://api.devnet.solana.com', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0', id: 1,
    method: 'getBalance',
    params: [address, { commitment: 'confirmed' }]
  })
});
```

## What I learned
- Solana RPC is plain JSON-RPC over HTTP — no special SDK required in the browser
- `getBalance` returns lamports as an integer → divide by 1,000,000,000 for SOL
- `getSignaturesForAddress` returns newest-first transaction history
- Error handling in browser is critical — bad addresses and network errors need graceful UI
- Moving from `console.log` (Days 8 & 9) to DOM rendering is the Web2 → Web3 frontend bridge

## Key Concept
> Days 8 & 9 = backend terminal scripts
> Day 10 = frontend browser app
> **Same RPC calls. Different output target.**

## Resources
- [Solana RPC docs](https://solana.com/docs/rpc)
- [getBalance](https://solana.com/docs/rpc/http/getbalance)
- [getSignaturesForAddress](https://solana.com/docs/rpc/http/getsignaturesforaddress)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
