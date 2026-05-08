# Day 19 — Explore Failed Transactions

> **100 Days of Solana** | Arc Theme: Transactions and State Changes

## What I Built

Deliberately triggered multiple types of failed transactions on Solana devnet, then dissected them using `solana confirm -v` and Solana Explorer to understand exactly what went wrong, what was charged, and why.

---

## Steps Completed

### Step 1 — Create a broke wallet
```bash
solana-keygen new --outfile /tmp/broke-wallet.json --no-bip39-passphrase --force
```
```
pubkey: 8nwngJPMfxHiBf8EUjshjWfu34JhdNNhguUUbebmcyQJ
Balance: 0 SOL
```

### Step 2 — Send from empty wallet (local failure)
```bash
solana transfer --keypair /tmp/broke-wallet.json $(solana address) 1 --url devnet --allow-unfunded-recipient
```
```
Error: Account 8nwngJPMfxHiBf8EUjshjWfu34JhdNNhguUUbebmcyQJ has insufficient funds
for spend (1 SOL) + fee (0.000005 SOL)
```
> CLI caught this locally — tx never reached the network.

### Step 3 — Send 500 SOL (local failure)
```bash
solana transfer $(solana-keygen pubkey /tmp/broke-wallet.json) 500 --url devnet --allow-unfunded-recipient
```
```
Error: Account AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y has insufficient funds
for spend (500 SOL) + fee (0.000005 SOL)
```

### Step 4 — Force on-chain failure with skipPreflight
```bash
node force-fail.mjs
```
```
Sender: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
Broke wallet: 8nwngJPMfxHiBf8EUjshjWfu34JhdNNhguUUbebmcyQJ

Attempting to send 9999 SOL (way more than balance)...
skipPreflight: true — bypassing local check, sending to chain...

Transaction sent (will fail on-chain)!
Signature: 2xQrSQUhoiF2ob4NAukfp9PvRoa4P6PSvHSKwW5bkKvgVoua8Agti2brD9FPEZonAbQDsqYVad5ZHbfvH8prtdyU
Explorer: https://explorer.solana.com/tx/2xQrSQUhoiF2ob4NAukfp9PvRoa4P6PSvHSKwW5bkKvgVoua8Agti2brD9FPEZonAbQDsqYVad5ZHbfvH8prtdyU?cluster=devnet
```

### Step 5 — Inspect on-chain failure with `solana confirm -v`
```bash
solana confirm -v 2xQrSQUhoiF2ob4NAukfp9PvRoa4P6PSvHSKwW5bkKvgVoua8Agti2brD9FPEZonAbQDsqYVad5ZHbfvH8prtdyU --url devnet
```
```
Transaction executed in slot 460991992:
  Block Time: 2026-05-08T18:09:19+00:00
  Version: legacy
  Recent Blockhash: FVSnvFfGRu3KwVXZGgAStYAnhWUGDBwfEkhrtEFFBL3S
  Signature 0: 2xQrSQUhoiF2ob4NAukfp9PvRoa4P6PSvHSKwW5bkKvgVoua8Agti2brD9FPEZonAbQDsqYVad5ZHbfvH8prtdyU
  Account 0: srw- AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y (fee payer)
  Account 1: -rw- 8nwngJPMfxHiBf8EUjshjWfu34JhdNNhguUUbebmcyQJ
  Account 2: -r-x 11111111111111111111111111111111
  Instruction 0
    Program:   11111111111111111111111111111111 (2)
    Account 0: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y (0)
    Account 1: 8nwngJPMfxHiBf8EUjshjWfu34JhdNNhguUUbebmcyQJ (1)
    Transfer { lamports: 9999000000000 }
  Status: Error processing Instruction 0: custom program error: 0x1
    Fee: ◎0.000005
    Account 0 balance: ◎6.13593 -> ◎6.135925
    Account 1 balance: ◎0
    Account 2 balance: ◎0.000000001
  Compute Units Consumed: 150
  Log Messages:
    Program 11111111111111111111111111111111 invoke [1]
    Transfer: insufficient lamports 6135925000, need 9999000000000
    Program 11111111111111111111111111111111 failed: custom program error: 0x1

Transaction failed: Error processing Instruction 0: custom program error: 0x1
```

---

## Failed Transaction Analysis

| Field | Value | Insight |
|-------|-------|--------|
| **Status** | `custom program error: 0x1` | System Program error code 1 = insufficient lamports |
| **Fee charged** | `◎0.000005` (5000 lamports) | Fee deducted even on failure! |
| **Transfer attempted** | 9999 SOL = 9,999,000,000,000 lamports | Way more than balance |
| **Balance available** | 6,135,925,000 lamports (≈6.136 SOL) | What fee payer actually had |
| **Balance needed** | 9,999,000,000,000 lamports | What the transfer required |
| **Compute used** | 150 units | Minimal — failed fast |
| **Slot** | 460991992 | On-chain, permanent record |
| **Account 0 balance** | ◎6.13593 → ◎6.135925 | Dropped by fee only |
| **Account 1 balance** | ◎0 → ◎0 | No change — transfer never happened |

---

## Solana Explorer
[View failed transaction on Solana Explorer (devnet)](https://explorer.solana.com/tx/2xQrSQUhoiF2ob4NAukfp9PvRoa4P6PSvHSKwW5bkKvgVoua8Agti2brD9FPEZonAbQDsqYVad5ZHbfvH8prtdyU?cluster=devnet)

---

## Failure Types Encountered

| Type | Where it failed | Fee charged? |
|------|----------------|-------------|
| Empty wallet send (Step 2) | CLI preflight — never reached network | ❌ No |
| Overspend 500 SOL (Step 3) | CLI preflight — never reached network | ❌ No |
| force-fail.mjs 9999 SOL (Step 4) | On-chain — validators executed it | ✅ Yes (5000 lamports) |

---

## Key Insight: Failed Transactions Still Cost Fees

Unlike a failed HTTP request (no billing per attempt), a **failed Solana transaction still charges the fee**. Validators verified the signature and attempted execution — they get paid regardless of outcome. This is why production apps use `simulateTransaction` before submitting to catch errors first.

---

## What I Learned

- `custom program error: 0x1` from System Program = insufficient lamports
- `skipPreflight: true` bypasses local simulation — tx reaches chain and fails there
- Fee payer is always charged even when the instruction fails
- `solana confirm -v` shows full account balance changes, log messages, compute units
- Log Messages are your primary debugging tool (like stack traces in Web2)
- Local CLI failures (preflight) vs on-chain failures are fundamentally different
- `meta.err.InstructionError` carries structured error info for programmatic handling

---

## Resources
- [getTransaction RPC Method — Solana Docs](https://solana.com/docs/rpc/http/gettransaction)
- [Transaction Confirmation and Expiration Guide](https://solana.com/developers/guides/advanced/confirmation)
- [Retrying Transactions Guide](https://solana.com/developers/guides/advanced/retry)
- [Solana CLI Reference](https://docs.anza.xyz/cli/usage)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
