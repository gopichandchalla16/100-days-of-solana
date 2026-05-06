# Day 16 — Send Your First SOL Transfer

> **100 Days of Solana** | Arc Theme: Transactions and State Changes

## What I did
Sent a deliberate 0.5 SOL transfer on devnet step by step.
No intermediary. No webhook. No pending state. Settled in under a second.

---

## Commands Run

### Step 1: Configure devnet
```bash
solana config set -ud
solana config get
```

### ✅ Output
```
RPC URL: https://api.devnet.solana.com
Keypair Path: /home/gopichand/.config/solana/id.json
Commitment: confirmed
```

---

### Step 2: Check balance
```bash
solana balance
```

### ✅ Output
```
2.498995 SOL
```

---

### Step 3: Generate recipient keypair
```bash
solana-keygen new --outfile ~/recipient-keypair.json --no-bip39-passphrase
```

### ✅ Output
```
pubkey: 4mW77HkFWnFqq1Zz6Vi4o78RRX5PGEjY5EDUBXtdPiT7
```

---

### Step 4: Send 0.5 SOL transfer
```bash
solana transfer $(solana address -k ~/recipient-keypair.json) 0.5 --allow-unfunded-recipient
```

### ✅ Output
```
Signature: 36ZztT5VFAooZsWdrdmYP2jR8q6YVkoLoZ1mPpAmZTJV1WtNEaLi2LUCJJrL1SMUFaWLwzXXhShiEL5rBZFLkYJo
```

---

### Step 5: Verify balances
```bash
solana balance
solana balance $(solana address -k ~/recipient-keypair.json)
```

### ✅ Output
```
Sender    (AWKYsCGB...): 1.99899 SOL  (was 2.498995 → sent 0.5 + fee)
Recipient (4mW77HkF...): 0.5 SOL     (was 0 → now funded)
```

---

## Transfer Summary

| Field | Value |
|-------|-------|
| **Sender** | `AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y` |
| **Recipient** | `4mW77HkFWnFqq1Zz6Vi4o78RRX5PGEjY5EDUBXtdPiT7` |
| **Amount** | 0.5 SOL (500,000,000 lamports) |
| **Fee** | ~0.000005 SOL (5000 lamports) |
| **Sender balance before** | 2.498995 SOL |
| **Sender balance after** | 1.99899 SOL |
| **Recipient balance after** | 0.5 SOL |
| **Signature / TX ID** | `36ZztT5VFAooZsWdrdmYP2jR8q6YVkoLoZ1mPpAmZTJV1WtNEaLi2LUCJJrL1SMUFaWLwzXXhShiEL5rBZFLkYJo` |
| **Network** | Devnet |
| **Settlement time** | < 1 second |

---

## Solana Explorer
[View transaction on Solana Explorer (devnet)](https://explorer.solana.com/tx/36ZztT5VFAooZsWdrdmYP2jR8q6YVkoLoZ1mPpAmZTJV1WtNEaLi2LUCJJrL1SMUFaWLwzXXhShiEL5rBZFLkYJo?cluster=devnet)

---

## Why `--allow-unfunded-recipient`?
The recipient `4mW77HkF...` had never received SOL before — no on-chain
account existed for it. Without this flag, the CLI rejects the transfer
as a safety measure. When SOL is sent to a new address, the network
creates the account automatically and the transferred SOL covers rent.
This is different from Ethereum where any address can receive funds
without prior setup.

---

## Solana vs Web2 Payment (Stripe)

| Stripe API | Solana Transfer |
|---|---|
| Auth headers + API key | Ed25519 signature (private key) |
| POST /v1/charges | `solana transfer` CLI / RPC call |
| Stripe servers process | Thousands of validators process |
| 3–5 business days to settle | < 1 second to finalize |
| Webhook callbacks for status | Transaction signature = instant receipt |
| Stripe holds funds briefly | No intermediary at any point |
| Fees to Stripe | 5000 lamports to validators |

---

## Resources
- [Send and Receive Tokens — Solana CLI Guide](https://docs.anza.xyz/cli/examples/transfer-tokens)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
- [How to Get Devnet SOL](https://solana.com/developers/guides/getstarted/solana-token-airdrop-and-faucets)
