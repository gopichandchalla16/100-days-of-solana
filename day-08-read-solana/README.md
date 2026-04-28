# Day 8 — Read Your First On-Chain Data

## What I built
A Node.js script that connects to Solana devnet and reads any wallet's SOL balance using `@solana/kit` — no API key, no authentication, no rate limits.

## Setup
```bash
npm install @solana/kit
node read-balance.mjs
```

## Output
```
Address: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
Balance: 0.00114144 SOL
Balance (raw lamports): 1141440
```

## What I learned
- `createSolanaRpc` connects to a Solana RPC node — like calling a REST API
- No API key needed — all account data on Solana is public by default
- Balance is returned in **lamports** (1 SOL = 1,000,000,000 lamports)
- Solana is a global shared public database — everyone reads the same data
- The `getBalance().send()` pattern is the foundation for all on-chain reads

## Resources
- [Solana Kit docs](https://www.solanakit.com/docs)
- [Solana RPC docs](https://solana.com/docs/rpc)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
