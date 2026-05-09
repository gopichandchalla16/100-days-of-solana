# Day 20 — Write About Transactions

> **100 Days of Solana** | Arc Theme: Transactions and State Changes

## What I Did

Published a technical blog post on DEV.to covering everything learned about Solana transactions in Week 3 (Days 15–19).

## 📝 Blog Post

**Title:** Solana Transactions Explained for Backend Developers (With Real Failures)

**Link:** [dev.to/gopichand_dev/solana-transactions-explained-for-backend-developers-with-real-failures-2ido](https://dev.to/gopichand_dev/solana-transactions-explained-for-backend-developers-with-real-failures-2ido)

**Tags:** `solana` `blockchain` `web3` `100daysofsolana`

---

## Post Covers

- ✅ Why a Solana transaction is NOT an API call
- ✅ Anatomy of a transaction: signature, accounts, instructions, blockhash
- ✅ Solana’s 3 commitment levels: Processed → Confirmed → Finalized
- ✅ Real on-chain failed transaction analysis (`custom program error: 0x1`)
- ✅ Two failure types: local preflight vs on-chain (why fee is charged on-chain failures)
- ✅ Mental model shift from Web2 request/response to blockchain state changes
- ✅ Why production apps use `simulateTransaction` before submitting

---

## Real Terminal Output Used in Post

```
# Confirmation tracking (Day 18)
Tracking confirmation stages...
[Processed → Confirmed] ✅ reached in 0.3s
[Confirmed → Finalized] ✅ reached in 0.2s
Transaction successful! 🎉

# Failed transaction (Day 19)
Status: Error processing Instruction 0: custom program error: 0x1
  Fee: ◎0.000005  ← charged even on failure!
  Account 0 balance: ◎6.13593 -> ◎6.135925
Log Messages:
  Transfer: insufficient lamports 6135925000, need 9999000000000
  Program 11111111111111111111111111111111 failed: custom program error: 0x1
```

---

## Key Insight from the Post

| | Web2 API Call | Solana Transaction |
|---|---|---|
| **Authorization** | API key / token | Cryptographic signature |
| **Record** | Server logs (private) | On-chain (permanent, public) |
| **Expiry** | No expiry | ~60–90s (blockhash window) |
| **Failed cost** | Free | Fee still charged |
| **Retries** | Same request | Must rebuild with fresh blockhash |
| **Atomicity** | Depends on implementation | Always atomic |

---

## Resources Referenced
- [Solana Transactions Documentation](https://solana.com/docs/core/transactions)
- [Transaction Confirmation and Expiration Guide](https://solana.com/developers/guides/advanced/confirmation)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
- [GitHub: 100 Days of Solana](https://github.com/gopichandchalla16/100-days-of-solana)
