# Day 18 — Add Transaction Confirmation UI

> **100 Days of Solana** | Arc Theme: Transactions and State Changes

## What I Built

Upgraded the Day 17 transfer tool from a black-box single call into a **live confirmation tracker** that shows every stage of Solana's commitment ladder in real time:

- ✅ `Processed` → a validator included the tx in a block
- ✅ `Confirmed` → supermajority (66%+) of validators voted on the block
- ✅ `Finalized` → 31+ confirmed blocks built on top, irreversible
- ✅ Live terminal line that overwrites in place (no scroll spam)
- ✅ On-chain error surfaced as proper exception
- ✅ Explorer link on completion

---

## Command Run

```bash
node transfer.mjs 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ 0.01
```

## ✅ Output

```
Solana Transfer Tool — with Confirmation Tracking
===================================================
Connected to Solana devnet.
Sender:    AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
Recipient: 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ
Amount:    0.01 SOL
Sender balance: 3.645935 SOL

Sending transaction...
Signature: 3hYmkD3mmCCAJiji76mccJUqU2xB7YeNPokUPnZV6rJ3btGt8kzzzvmq7B8ytd83saDDkiZUYeAcSMtStLi9fQZz

Tracking confirmation stages...
[Processed → Confirmed] ✅ reached in 0.3s
[Confirmed → Finalized] ✅ reached in 0.2s

Transaction successful! 🎉
Signature: 3hYmkD3mmCCAJiji76mccJUqU2xB7YeNPokUPnZV6rJ3btGt8kzzzvmq7B8ytd83saDDkiZUYeAcSMtStLi9fQZz
View on Solana Explorer:
https://explorer.solana.com/tx/3hYmkD3mmCCAJiji76mccJUqU2xB7YeNPokUPnZV6rJ3btGt8kzzzvmq7B8ytd83saDDkiZUYeAcSMtStLi9fQZz?cluster=devnet
New sender balance: 3.63593 SOL
```

---

## Transfer Summary

| Field | Value |
|-------|-------|
| **Sender** | `AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y` |
| **Recipient** | `8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ` |
| **Amount** | 0.01 SOL (10,000,000 lamports) |
| **Fee** | 0.000005 SOL (5000 lamports) |
| **Sender balance before** | 3.645935 SOL |
| **Sender balance after** | 3.63593 SOL |
| **Signature** | `3hYmkD3mmCCAJiji76mccJUqU2xB7YeNPokUPnZV6rJ3btGt8kzzzvmq7B8ytd83saDDkiZUYeAcSMtStLi9fQZz` |
| **Processed → Confirmed** | 0.3s |
| **Confirmed → Finalized** | 0.2s |
| **Network** | Devnet |
| **Status** | Finalized ✅ |

---

## Solana Explorer
[View transaction on Solana Explorer (devnet)](https://explorer.solana.com/tx/3hYmkD3mmCCAJiji76mccJUqU2xB7YeNPokUPnZV6rJ3btGt8kzzzvmq7B8ytd83saDDkiZUYeAcSMtStLi9fQZz?cluster=devnet)

---

## Solana Commitment Levels Explained

| Level | What it means | Web2 analogy |
|-------|--------------|---------------|
| **Processed** | Validator included tx in a block | POST request reached the server |
| **Confirmed** | 66%+ validators voted on the block | 200 OK from load-balanced API |
| **Finalized** | 31+ blocks built on top, irreversible | DB commit replicated + flushed to disk |

---

## What I Learned

- Solana confirmation is **not binary** — it moves through 3 commitment levels
- `Processed` → `Confirmed` takes ~400ms on devnet
- `Confirmed` → `Finalized` takes ~6–12 seconds on devnet
- Polling `getSignatureStatuses` at each level is how wallets, DEXes, and NFT marketplaces track confirmation
- A failed transaction still costs a fee — catching errors early matters
- `statusUpdate()` overwrites the terminal line instead of printing new ones — clean UX

---

## Resources
- [Transaction Confirmation and Expiration — Solana Docs](https://solana.com/developers/guides/advanced/confirmation)
- [What are Solana Commitment Levels? — Helius](https://www.helius.dev/blog/solana-commitment-levels)
- [getSignatureStatuses RPC Method — Solana Docs](https://solana.com/docs/rpc/http/getsignaturestatuses)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
