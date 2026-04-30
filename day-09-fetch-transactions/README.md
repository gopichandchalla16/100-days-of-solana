# Day 9 — Fetch and Display Recent Transactions

## What I built
A Node.js script using `@solana/kit` that fetches the 5 most recent transaction signatures for any public Solana address, displaying signature, slot, timestamp, and status.

## Setup & Run
```bash
npm init -y
npm install @solana/kit
node fetch-transactions.mjs
```

## What I learned
- `getSignaturesForAddress` fetches transaction history for any public address
- Transaction **signatures** are unique base-58 IDs — paste into Solana Explorer to inspect
- **Slot** = sequence number for transaction batches; new slot every ~400ms
- **blockTime** is a Unix timestamp (seconds since Jan 1, 1970) → convert with `new Date(blockTime * 1000)`
- Some older transactions may have no blockTime — always handle that case
- Results are ordered newest → oldest by default
- No API key needed — all transaction history is public on Solana

## Key Concept
> If Day 8 was `GET /users/:id/balance`, Day 9 is `GET /users/:id/transactions`.
> Same RPC pattern, richer data.

## Resources
- [getSignaturesForAddress RPC docs](https://solana.com/docs/rpc/http/getsignaturesforaddress)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
- [Solana Kit docs](https://www.solanakit.com/docs)
