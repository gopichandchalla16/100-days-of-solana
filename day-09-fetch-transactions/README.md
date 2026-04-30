# Day 9 — Fetch and Display Recent Transactions

> **100 Days of Solana** | Arc Theme: Reading the Blockchain

## What I built
A Node.js script using `@solana/kit` that fetches the **5 most recent transaction signatures** for any public Solana address, displaying signature, slot number, human-readable timestamp, and status.

## Setup & Run
```bash
# Uses same @solana/kit from Day 8 folder
npm init -y
npm install @solana/kit
node fetch-transactions.mjs
```

## Live Output
```
Last 5 transactions for TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb:

Signature : 5wJa1Pz83czCHuKb4eQsRoUXfL9GdPQfKgVDrGowiesFh2KEuoDamA6BTZ7svckxBJQMToPLfuwakUq3xn6Q7TKA
Slot      : 459179358
Time      : 1/5/2026, 12:24:18 am
Status    : Success
---
Signature : 5MSFcXCr21ePqgBH9PKeQw46KW215Ym4mthvu7EXCgu1S7vC8feDU1oqtXv75UnQjFo5xHS5yzxDKCph9aWHQ7Yy
Slot      : 459179356
Time      : 1/5/2026, 12:24:17 am
Status    : Success
---
Signature : 4smijUetwTdk65qnCwMKpC43xjwoeKofERPt1bo3dbVCjgMjvKXhMAs62kx24K9UYnfJjXgAH1rNu1XjWKExSwJU
Slot      : 459179354
Time      : 1/5/2026, 12:24:16 am
Status    : Success
---
Signature : 2EUGd479njQC91BK3HzChYwW9umBUKWz1q6xjos2DzF7itBRVLroqDf82ifAYLEi4ZSj523NBoh5WifTKpeG451m
Slot      : 459179352
Time      : 1/5/2026, 12:24:16 am
Status    : Success
---
Signature : 2MHWSVK3UTdxiHjAFaVYi7YtGRYCrY5F1y4YttdCS572pddCgRjbYptdLQV3sR7DSYMbEcF37zUXD1XBuBxkKvdK
Slot      : 459179350
Time      : 1/5/2026, 12:24:15 am
Status    : Success
---
```

## What I learned
- `getSignaturesForAddress` fetches transaction history for any public address
- Transaction **signatures** are unique base-58 IDs — paste into Solana Explorer to inspect full details
- **Slot** = sequence number for transaction batches; Solana creates a new slot every ~400ms
- **blockTime** is a Unix timestamp (seconds since Jan 1, 1970) → convert with `new Date(blockTime * 1000)`
- Some older transactions may have no `blockTime` — always handle that edge case
- Results returned **newest → oldest** by default
- No API key needed — all transaction history is publicly readable on Solana

## Key Concept
> If Day 8 was `GET /users/:id/balance`,
> Day 9 is `GET /users/:id/transactions`.
> Same RPC pattern. Richer data.

## Resources
- [getSignaturesForAddress RPC docs](https://solana.com/docs/rpc/http/getsignaturesforaddress)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
- [Solana Kit docs](https://www.solanakit.com/docs)
