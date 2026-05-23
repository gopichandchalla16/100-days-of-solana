# Day 33 — Test Token Distribution Strategies

> **Challenge:** Create a non-transferable (soulbound) token, prove the transfer fails, and confirm burning still works.

---

## What I Built

A **Soulbound Token** on Token-2022 using the `--enable-non-transferable` extension:
- ✅ Minted 10 tokens to my wallet
- ❌ Transfer attempt **rejected** at the protocol level
- ✅ Burn of 3 tokens **succeeded** (owner stays in control)

---

## Token Details

| Field | Value |
|-------|-------|
| **Mint Address** | `FSkyr3PcJqAft8YMDxF8s6BG5VoctSqibrJrLcMJXZMu` |
| **Program** | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` (Token-2022) |
| **Extension** | Non-Transferable |
| **Decimals** | 9 |
| **My Token Account** | `9NuLwL5zszG9qUC3GQzK7jDnfZfTG5vciT83rD4ke7ce` |
| **Experiment Wallet** | `BtrZUCcKSs2Jd5wXknc1RK8V8wzeie9EyVDrPWhM2dXj` |
| **Experiment Token Account** | `8AmeXre76K1NCXdFummhr163YqWfeP2rRYoqV48KG39r` |

---

## Steps Executed

### Step 1 — Confirm Environment
```bash
solana config set --url devnet
solana balance
# Output: 6.11004352 SOL ✅
```

### Step 2 — Create Non-Transferable Mint
```bash
spl-token create-token \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --enable-non-transferable

# Mint: FSkyr3PcJqAft8YMDxF8s6BG5VoctSqibrJrLcMJXZMu
# Sig:  3cT2u69Awxr6U7v154i6fhu6PTFxxd9nSWpCgJWkzbekZDMfqRXF53LPxt7gJXVnix3zMLUvzgwRBnF4HkPV5KMR
```

### Step 3 — Create Account + Mint 10 Tokens
```bash
spl-token create-account FSkyr3PcJqAft8YMDxF8s6BG5VoctSqibrJrLcMJXZMu \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
# Account: 9NuLwL5zszG9qUC3GQzK7jDnfZfTG5vciT83rD4ke7ce

spl-token mint FSkyr3PcJqAft8YMDxF8s6BG5VoctSqibrJrLcMJXZMu 10 \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
# Balance: 10 ✅
```

### Step 4 — Generate Experiment Wallet
```bash
solana-keygen new --outfile ~/experiment-wallet.json \
  --no-bip39-passphrase --force
# pubkey: BtrZUCcKSs2Jd5wXknc1RK8V8wzeie9EyVDrPWhM2dXj
```

### Step 4b — Create Recipient Account
```bash
spl-token create-account FSkyr3PcJqAft8YMDxF8s6BG5VoctSqibrJrLcMJXZMu \
  --owner ~/experiment-wallet.json \
  --fee-payer ~/.config/solana/id.json \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
# Account: 8AmeXre76K1NCXdFummhr163YqWfeP2rRYoqV48KG39r ✅
```

### Step 4c — Transfer Attempt (FAILS ❌ — This Is The Point)
```bash
spl-token transfer FSkyr3PcJqAft8YMDxF8s6BG5VoctSqibrJrLcMJXZMu 5 \
  BtrZUCcKSs2Jd5wXknc1RK8V8wzeie9EyVDrPWhM2dXj \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --allow-unfunded-recipient
```

**Error received:**
```
Error: Client(Error { request: Some(SendTransaction), kind: RpcError(RpcResponseError {
  code: -32002,
  message: "Transaction simulation failed: Error processing Instruction 0: custom program error: 0x25",
  logs: [
    "Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb invoke [1]",
    "Program log: Instruction: TransferChecked",
    "Program log: Transfer is disabled for this mint",   ⬅️ THE KEY LINE
    "Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0x25"
  ]
})
```

> `Transfer is disabled for this mint` — the Token Extensions Program itself rejected the transaction. Not application code. Not a smart contract check. The program.

### Step 5 — Burn 3 Tokens (SUCCEEDS ✅)
```bash
spl-token burn 9NuLwL5zszG9qUC3GQzK7jDnfZfTG5vciT83rD4ke7ce 3 \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

# Sig: QZgW8XGRV7VunXe2TXjBYeUhYmcJM99FpRcJDHdNaHEj5ahhhaUHqsud1taMMVF3b2WnikvwQh8DgjeFiR7Xx9o

spl-token balance FSkyr3PcJqAft8YMDxF8s6BG5VoctSqibrJrLcMJXZMu \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
# Balance: 7 ✅
```

---

## What Just Happened

| Action | Result | Why |
|--------|--------|-----|
| Create mint with `--enable-non-transferable` | ✅ Success | Extension baked into mint account |
| Mint 10 tokens | ✅ Success | Minting is allowed |
| Transfer 5 to another wallet | ❌ **Rejected** | `Transfer is disabled for this mint` |
| Burn 3 tokens | ✅ Success | Owner can destroy, just not transfer |
| Final balance | **7** | 10 minted − 3 burned = 7 |

---

## Key Insight

This is what the blockchain world calls a **"soulbound token"** — permanently bound to the wallet that holds it.

**Real-world use cases:**
- 🎓 Course completion certificates
- ✅ KYC / identity verification tokens
- 🏅 Hackathon participation badges
- 💼 Employee credentials
- 🔐 On-chain reputation scores

In Web2, preventing credential trading requires application-layer rules that can be worked around. On Solana, the **Token Extensions Program enforces it at the protocol level** — no client, no script, no program can override it.

The error code `0x25` (decimal 37) = `NonTransferable` — a first-class error in the Token-2022 program.

---

## Transactions on Devnet

| Action | Signature |
|--------|----------|
| Create non-transferable mint | `3cT2u69A...` |
| Create my token account | `4PqXJyFX...` |
| Mint 10 tokens | `3p9KwEAe...` |
| Create experiment token account | `C88FHEu4...` |
| Transfer (FAILED) | `❌ rejected — not submitted` |
| Burn 3 tokens | `QZgW8XGR...` |

---

*Part of [#100DaysOfSolana](https://github.com/gopichandchalla16/100-days-of-solana) — building in public daily.*
