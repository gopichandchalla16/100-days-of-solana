# Day 17 — Build a Transfer Tool

> **100 Days of Solana** | Arc Theme: Transactions and State Changes

## What I Built

Turned the one-off CLI transfer from Day 16 into a **reusable Node.js command-line tool** with:
- ✅ Argument parsing (recipient + amount)
- ✅ Input validation (positive number, missing args)
- ✅ Balance check before sending (prevents paying fees on a doomed tx)
- ✅ Live transaction signature output
- ✅ Solana Explorer link
- ✅ Post-transfer balance confirmation

---

## Project Setup

```bash
mkdir sol-transfer-tool && cd sol-transfer-tool
npm init -y
npm install @solana/kit @solana-program/system
npm pkg set type=module
```

---

## Commands Run

### Test 1: No args → usage message
```bash
node transfer.mjs  0.05
```

### ✅ Output
```
Usage: node transfer.mjs <recipient-address> <amount-in-SOL>
Example: node transfer.mjs 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ 0.05
```

---

### Test 2: Successful 0.001 SOL transfer
```bash
node transfer.mjs 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ 0.001
```

### ✅ Output
```
Solana Transfer Tool
====================
Connected to Solana devnet.
Sender:    AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
Recipient: 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ
Amount:    0.001 SOL
Sender balance: 3.747955 SOL

Sending transaction...
Transaction confirmed! ✅
Signature: 4G2xYXgJ3APaPDEABweLE7evgKvJuLJjy6Nj3NYsfCHqDnzt1snenMrL3DsVjxE6PftjsFF3Fb6ADJ3CiUBxUKZR
Explorer:  https://explorer.solana.com/tx/4G2xYXgJ3APaPDEABweLE7evgKvJuLJjy6Nj3NYsfCHqDnzt1snenMrL3DsVjxE6PftjsFF3Fb6ADJ3CiUBxUKZR?cluster=devnet
New sender balance: 3.74695 SOL
```

---

### Test 3: Confirmed on-chain via `solana confirm -v`
```bash
solana confirm -v 4G2xYXgJ3APaPDEABweLE7evgKvJuLJjy6Nj3NYsfCHqDnzt1snenMrL3DsVjxE6PftjsFF3Fb6ADJ3CiUBxUKZR
```

### ✅ Output
```
Transaction executed in slot 460986088:
  Block Time: 2026-05-08T17:31:46+00:00
  Version: legacy
  Signature 0: 4G2xYXgJ3APaPDEABweLE7evgKvJuLJjy6Nj3NYsfCHqDnzt1snenMrL3DsVjxE6PftjsFF3Fb6ADJ3CiUBxUKZR
  Account 0: srw- AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y (fee payer)
  Account 1: -rw- 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ
  Account 2: -r-x 11111111111111111111111111111111
  Instruction 0
    Program: 11111111111111111111111111111111
    Transfer { lamports: 1000000 }
  Status: Ok
    Fee: 0.000005 SOL
    Account 0 balance: 3.74695 -> 3.745945 SOL
    Account 1 balance: 0.252 -> 0.253 SOL
  Compute Units Consumed: 150
Finalized
```

---

## Transfer Summary

| Field | Value |
|-------|-------|
| **Sender** | `AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y` |
| **Recipient** | `8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ` |
| **Amount** | 0.001 SOL (1,000,000 lamports) |
| **Fee** | 0.000005 SOL (5000 lamports) |
| **Sender balance before** | 3.747955 SOL |
| **Sender balance after** | 3.74695 SOL |
| **Signature** | `4G2xYXgJ3APaPDEABweLE7evgKvJuLJjy6Nj3NYsfCHqDnzt1snenMrL3DsVjxE6PftjsFF3Fb6ADJ3CiUBxUKZR` |
| **Slot** | 460986088 |
| **Network** | Devnet |
| **Status** | Finalized |

---

## Solana Explorer
[View transaction on Solana Explorer (devnet)](https://explorer.solana.com/tx/4G2xYXgJ3APaPDEABweLE7evgKvJuLJjy6Nj3NYsfCHqDnzt1snenMrL3DsVjxE6PftjsFF3Fb6ADJ3CiUBxUKZR?cluster=devnet)

---

## What I Learned

**Web2 analogy:** This is the same pattern as wrapping a payment SDK call (e.g., Stripe) inside a reusable Express utility — the API call stays the same, you add input parsing, validation, and user feedback around it.

**5 things the tool does every run:**
1. Connects to Solana devnet RPC
2. Loads keypair from disk (`~/.config/solana/id.json`)
3. Checks balance **before** sending (failed txs still cost fees on Solana)
4. Builds, signs, and sends the transfer
5. Prints signature + Explorer link + new balance

**Why balance check matters:** On Solana, a failed transaction still deducts the transaction fee. Validating before sending is the blockchain equivalent of form validation before an HTTP POST.

---

## Resources
- [How to Send SOL — Solana Cookbook](https://solana.com/developers/cookbook/transactions/send-sol)
- [Send and Receive Tokens — Solana CLI Guide](https://docs.anza.xyz/cli/examples/transfer-tokens)
- [How to Send Transactions with Solana Kit — QuickNode](https://www.quicknode.com/guides/solana-development/tooling/web3-2/transfer-sol)
