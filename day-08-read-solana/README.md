# Day 8 — Read Your First On-Chain Data

## What I built
A Node.js script using `@solana/kit` that connects to Solana devnet and reads the SOL balance of any public address — no API key, no authentication, no rate limits.

## Setup & Run
```bash
npm init -y
npm install @solana/kit
node read-balance.mjs
```

## Live Output
```
Address: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
Balance: 0.001159846 SOL
```

## What I learned
- `createSolanaRpc` connects to a Solana RPC node — same as calling a REST API
- **No API key needed** — all Solana account data is public by default
- Balance is returned in **lamports** → divide by 1,000,000,000 to get SOL
- Solana is a global shared public database — anyone can query any account
- `getBalance().send()` is the foundation pattern for all on-chain reads
- The `@solana/kit` SDK uses `.send()` to dispatch the RPC call

## Key Concept
> Solana is like a massive database where every table is public and every query is free.
> No API key. No auth header. No rate limits.

## Resources
- [Solana Kit docs](https://www.solanakit.com/docs)
- [Solana RPC docs](https://solana.com/docs/rpc)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
