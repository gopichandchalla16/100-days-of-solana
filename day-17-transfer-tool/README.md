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
node transfer.mjs
```

### ✅ Output
```
Usage: node transfer.mjs <recipient-address> <amount-in-SOL>
Example: node transfer.mjs 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ 0.05
```

---

### Test 2: Successful 0.05 SOL transfer
```bash
node transfer.mjs 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ 0.05
```

### ✅ Output
```
Solana Transfer Tool
====================
Connected to Solana devnet.
Sender:    AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
Recipient: 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ
Amount:    0.05 SOL
Sender balance: 3.69594 SOL

Sending transaction...
CLI output: Signature: 5MxSKNco34ysu6Z6u7B815WtZARHY1ZRL39ZDyB3Xy1H5JKRht6Fy2NuhQYjDEUGqjYJuBZdovQaQjaaiY7J9QGS

Transaction confirmed! ✅
Signature: 5MxSKNco34ysu6Z6u7B815WtZARHY1ZRL39ZDyB3Xy1H5JKRht6Fy2NuhQYjDEUGqjYJuBZdovQaQjaaiY7J9QGS
Explorer:  https://explorer.solana.com/tx/5MxSKNco34ysu6Z6u7B815WtZARHY1ZRL39ZDyB3Xy1H5JKRht6Fy2NuhQYjDEUGqjYJuBZdovQaQjaaiY7J9QGS?cluster=devnet
New sender balance: 3.645935 SOL
```

---

### Test 3: Insufficient balance → error caught
```bash
node transfer.mjs 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ 9999
```

### ✅ Output
```
Error: Insufficient balance.
Need: 9999.000005 SOL | Have: 3.645935 SOL
```

---

## Transfer Summary

| Field | Value |
|-------|-------|
| **Sender** | `AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y` |
| **Recipient** | `8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ` |
| **Amount** | 0.05 SOL (50,000,000 lamports) |
| **Fee** | 0.000005 SOL (5000 lamports) |
| **Sender balance before** | 3.69594 SOL |
| **Sender balance after** | 3.645935 SOL |
| **Signature** | `5MxSKNco34ysu6Z6u7B815WtZARHY1ZRL39ZDyB3Xy1H5JKRht6Fy2NuhQYjDEUGqjYJuBZdovQaQjaaiY7J9QGS` |
| **Network** | Devnet |
| **Status** | Confirmed ✅ |

---

## Solana Explorer
[View transaction on Solana Explorer (devnet)](https://explorer.solana.com/tx/5MxSKNco34ysu6Z6u7B815WtZARHY1ZRL39ZDyB3Xy1H5JKRht6Fy2NuhQYjDEUGqjYJuBZdovQaQjaaiY7J9QGS?cluster=devnet)

---

## What I Learned

**Web2 analogy:** This is the same pattern as wrapping a payment SDK call (e.g., Stripe) inside a reusable Express utility — the API call stays the same, you add input parsing, validation, and user feedback around it.

**5 things the tool does every run:**
1. Parses recipient address and amount from CLI args
2. Validates inputs before touching the network
3. Checks balance **before** sending (failed txs still cost fees on Solana)
4. Sends transfer via Solana CLI and captures real signature
5. Prints signature + Explorer link + new balance

**Why balance check matters:** On Solana, a failed transaction still deducts the transaction fee. Validating before sending is the blockchain equivalent of form validation before an HTTP POST.

---

## Resources
- [How to Send SOL — Solana Cookbook](https://solana.com/developers/cookbook/transactions/send-sol)
- [Send and Receive Tokens — Solana CLI Guide](https://docs.anza.xyz/cli/examples/transfer-tokens)
- [How to Send Transactions with Solana Kit — QuickNode](https://www.quicknode.com/guides/solana-development/tooling/web3-2/transfer-sol)
