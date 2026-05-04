# Day 12 — Compare Data Across Devnet and Mainnet

> **100 Days of Solana** | Arc Theme: Reading the Blockchain

## What I built
A Node.js script using `@solana/kit` that queries the **same address** on both Solana devnet and mainnet simultaneously, displaying balances and recent transactions side by side — proving that the same code, same address, and same RPC calls return completely different data depending on which network you point to.

## Setup & Run
```bash
# Run from day-08-read-solana (has @solana/kit already installed)
cd ~/day1-solana/day-08-read-solana
node compare-networks.mjs
```

## ✅ Live Output (5 May 2026, Devnet + Mainnet)

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

  [1] Sig    : 4zrH8SM7DqyqC9jHvPjD...
       Slot   : 459981397
       Time   : 5/4/2026, 7:27:54 AM
       Status : Success

  [2] Sig    : 3ZxWsxhf3V2vbZKKTNVk...
       Slot   : 459981360
       Time   : 5/4/2026, 7:27:40 AM
       Status : Success

  [3] Sig    : 2BzvBF4Zikjn33pwPmAb...
       Slot   : 459981346
       Time   : 5/4/2026, 7:27:35 AM
       Status : Success

==================================================
  MAINNET (LIVE NETWORK — REAL SOL, REAL DATA)
==================================================
  Address : TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Balance : 0.069875097 SOL
  Lamports: 69875097

  Recent Transactions (3 found):

  [1] Sig    : bMhpfHbA87jqktCJZQti...
       Slot   : 417486413
       Time   : 5/4/2026, 7:27:58 AM
       Status : Success

  [2] Sig    : 3yoniWPavwamW96ysxvg...
       Slot   : 417486413
       Time   : 5/4/2026, 7:27:58 AM
       Status : Success

  [3] Sig    : 2TmkG6kVQdV79AMsab6U...
       Slot   : 417486413
       Time   : 5/4/2026, 7:27:58 AM
       Status : Success

==================================================
  Key Insight:
  Same address. Same code. Same RPC calls.
  Only the URL changed — but the data is totally different.
  devnet() and mainnet() helpers add type safety too.
==================================================
```

## 📊 What the numbers reveal

| Field | Devnet | Mainnet |
|-------|--------|---------|
| Balance | 0.001159846 SOL | 0.069875097 SOL |
| Lamports | 1,159,846 | 69,875,097 |
| Slot range | ~459,981,xxx | ~417,486,xxx |
| Signatures | Completely different | Completely different |
| Users transacting | Devnet testers | Real Solana users |

> Mainnet has **60x more SOL** than devnet for the same address —
> because mainnet has real economic activity.
> Devnet slots are **higher** than mainnet slots because devnet
> produces blocks faster (less validators, more lenient timing).

## What I learned
- `devnet()` and `mainnet()` from `@solana/kit` are more than labels — they add **type safety** preventing accidental cross-network RPC usage
- Devnet and mainnet are **completely separate databases** — same address, totally different state
- This mirrors Web2: staging vs production — same schema, different data
- `getBalance` and `getSignaturesForAddress` code is **100% identical** across networks
- Only the URL passed to `createSolanaRpc()` changes
- Mainnet holds **real SOL**; devnet is free and resets occasionally
- Transaction histories differ because different user populations interact on each network

## Key Concept
> Devnet = staging database (free, safe to experiment)
> Mainnet = production database (real SOL, real consequences)
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
