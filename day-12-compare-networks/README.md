# Day 12 — Compare Data Across Devnet and Mainnet

> **100 Days of Solana** | Arc Theme: Reading the Blockchain

## What I built
A Node.js script using `@solana/kit` that queries the **same address** on both Solana devnet and mainnet simultaneously, displaying balances and recent transactions side by side to show how two networks can have the same schema but completely different data.

## Setup & Run
```bash
# Use the @solana/kit from Day 8 folder or install fresh
npm install
node compare-networks.mjs
```

## Expected Output
```
  Solana Network Comparison
  Address: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Querying devnet and mainnet...

==================================================
  DEVNET  (TEST NETWORK — FREE SOL, TEST DATA)
==================================================
  Address : TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Balance : 0.001159846 SOL
  Lamports: 1159846

  Recent Transactions (3 found):

  [1] Sig    : 5wJa1Pz83czCHuKb...
       Slot   : 459179358
       Time   : 1/5/2026, 12:24:18 am
       Status : Success
  ...

==================================================
  MAINNET (LIVE NETWORK — REAL SOL, REAL DATA)
==================================================
  Address : TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Balance : [different from devnet]
  Lamports: [different value]

  Recent Transactions (3 found):
  [1] Sig    : [completely different signatures]
       Slot   : [different slot numbers]
       Time   : [different timestamps]
       Status : Success
  ...

==================================================
  Key Insight:
  Same address. Same code. Same RPC calls.
  Only the URL changed — but the data is totally different.
  devnet() and mainnet() helpers add type safety too.
==================================================
```

## What I learned
- `devnet()` and `mainnet()` from `@solana/kit` are more than labels — they add **type safety** so you can't accidentally pass a devnet RPC where mainnet is expected
- Devnet and mainnet are **completely separate databases** — same address, different state
- This mirrors Web2: staging vs production — same schema, different data
- The RPC call code (`getBalance`, `getSignaturesForAddress`) is **100% identical** across networks
- Only the URL passed to `createSolanaRpc()` changes
- Mainnet holds **real SOL with real value**; devnet is free to experiment with
- Transaction histories differ because different users interact on each network

## Key Concept
> Devnet = staging database (free, for testing)
> Mainnet = production database (real value, real consequences)
> **Same API. Same code. Same address. Completely different data.**

## Network URLs
| Network | URL |
|---------|-----|
| Devnet | `https://api.devnet.solana.com` |
| Testnet | `https://api.testnet.solana.com` |
| Mainnet | `https://api.mainnet-beta.solana.com` |

## Resources
- [Solana Clusters docs](https://solana.com/docs/core/clusters)
- [Solana Kit docs](https://www.solanakit.com/docs)
- [Solana Explorer (mainnet)](https://explorer.solana.com/)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
