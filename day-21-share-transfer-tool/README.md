# Day 21 — Share Your Transfer Tool

> **100 Days of Solana** | Arc Theme: Transactions and State Changes (Week 3 Complete! ✅)

## What I Did

Shared the Solana transfer tool built over Days 17–18 on X (Twitter), including a live devnet transaction proof on Solana Explorer.

---

## 📣 X Post

**Posted at:** [@GopichandAI](https://x.com/GopichandAI/status/2054100764197634276)

**Content:**
> Day 21/100 🚀 Built a Node.js CLI tool that transfers SOL on Solana devnet with live confirmation tracking.
>
> Biggest lesson: failed transactions still cost fees. Validators did the work — they get paid regardless.
>
> 🔍 Tx proof:
> https://explorer.solana.com/tx/3hYmkD3mmCCAJiji76mccJUqU2xB7YeNPokUPnZV6rJ3btGt8kzzzvmq7B8ytd83saDDkiZUYeAcSMtStLi9fQZz?cluster=devnet
>
> #100DaysOfSolana @solana

---

## ✅ On-Chain Proof

| Field | Value |
|-------|-------|
| **Signature** | `3hYmkD3mmCCAJiji76mccJUqU2xB7YeNPokUPnZV6rJ3btGt8kzzzvmq7B8ytd83saDDkiZUYeAcSMtStLi9fQZz` |
| **Explorer** | [View on Solana Explorer (devnet)](https://explorer.solana.com/tx/3hYmkD3mmCCAJiji76mccJUqU2xB7YeNPokUPnZV6rJ3btGt8kzzzvmq7B8ytd83saDDkiZUYeAcSMtStLi9fQZz?cluster=devnet) |
| **Network** | Devnet |
| **Status** | Finalized ✅ |

---

## Transfer Tool Summary (Days 17–18)

The tool being shared was built across Days 17 and 18:

- **Day 17** — Reusable Node.js CLI: arg parsing, balance check, signature output, Explorer link
- **Day 18** — Live confirmation UI: Processed → Confirmed → Finalized stage tracking

```bash
# How to run
node transfer.mjs <recipient-address> <amount-in-SOL>

# Example output
Solana Transfer Tool — with Confirmation Tracking
===================================================
Sender:    AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
Recipient: 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ
Amount:    0.01 SOL
Sender balance: 3.645935 SOL

Sending transaction...
Tracking confirmation stages...
[Processed → Confirmed] ✅ reached in 0.3s
[Confirmed → Finalized] ✅ reached in 0.2s

Transaction successful! 🎉
Signature: 3hYmkD3m...
```

---

## Week 3 Complete! 🎉

| Day | Challenge | Status |
|-----|-----------|--------|
| Day 15 | Transaction anatomy | ✅ |
| Day 16 | First SOL transfer | ✅ |
| Day 17 | Build transfer tool | ✅ |
| Day 18 | Confirmation UI | ✅ |
| Day 19 | Explore failed transactions | ✅ |
| Day 20 | Write about transactions | ✅ |
| Day 21 | Share transfer tool | ✅ |
