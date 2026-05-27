# Day 37 — Build a Multi-Extension Token on Solana

> **Challenge:** Create a single Token-2022 mint with three extensions active simultaneously: transfer fees, interest-bearing rate, and on-chain metadata.

---

## What I Built

A **Multi-Extension Token (ArcCoin / ARC)** combining three Token-2022 extensions in one mint:
- ✅ **Transfer Fee** — 1% (100 bps), max 500 raw units
- ✅ **Interest-Bearing** — 5 bps continuous compounding
- ✅ **On-Chain Metadata** — Name, Symbol, URI stored directly on mint

---

## Token Details

| Field | Value |
|-------|-------|
| **Mint Address** | `49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8` |
| **Program** | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` (Token-2022) |
| **Token Name** | ArcCoin |
| **Symbol** | ARC |
| **Decimals** | 2 |
| **Transfer Fee** | 100 bps (1%), max 50000 raw |
| **Interest Rate** | 5 bps |
| **My Token Account** | `3tyJtcLfprawA3ojqKgV6ttrPGB3dJ2H9fuTz9dGLkQK` |
| **Second Wallet** | `HxpSz71T5LiZV21N6PxRSVHqiLRmeDT2hGFbWCCXX1tE` |
| **Second Token Account** | `BzHipWeqK2WgEs5zQCQ8qMUirTqzPeqdi6hDrhMufKYE` |

---

## Steps Executed

### Step 1 — Create Multi-Extension Mint
```bash
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  create-token \
  --decimals 2 \
  --transfer-fee-basis-points 100 \
  --transfer-fee-maximum-fee 500 \
  --interest-rate 5 \
  --enable-metadata

# Mint: 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8
# Sig:  4D9gPh6EC4Q3n9uPTXxZgLtbSUQJANdyBbNQrFH9friCcf9dN4oVhN4tXpBntbDEvyUexPdKVG6FMfiqYe2ApXei
```

One command allocates space for all three TLV (type-length-value) extension entries simultaneously.

### Step 2 — Initialize Metadata
```bash
spl-token initialize-metadata \
  49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8 \
  "ArcCoin" \
  "ARC" \
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/metadata.json"

# Sig: vQ5k9HLZfvVUL9bfr6nviYUWDqLYeHQPHaVCtHWDCp8NnTUbBaJ29HtSbdtxmM2votnWMNZPFrkmukBALzDLuTv
```

### Step 3 — Inspect All 3 Extensions ✅ (MLH Submission Screenshot)
```bash
spl-token display 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8
```

```
SPL Token Mint
  Address: 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 0
  Decimals: 2
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: (not set)
Extensions
  Interest-bearing:
    Current rate: 5bps
    Average rate: 5bps
    Rate authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Transfer fees:
    Current fee: 100bps
    Current maximum: 50000
    Config authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withdrawal authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withheld fees: 0
  Metadata Pointer:
    Authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Metadata address: 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8
  Metadata:
    Update Authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Mint: 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8
    Name: ArcCoin
    Symbol: ARC
    URI: https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/metadata.json
```

### Step 4 — Create Token Account & Mint 1000 Tokens
```bash
spl-token create-account 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8
# Account: 3tyJtcLfprawA3ojqKgV6ttrPGB3dJ2H9fuTz9dGLkQK
# Sig: 3yTaEvE3Pg85bxx4vS1yryyFxZQeMLmHeiYNHQ4YQJM86MAEYrh1Nn7y13ZY8VgyhpdW1vXitf8JT7nxiGvBbHeW

spl-token mint 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8 1000
# Sig: 2RF9hXXDBCY5qjuF2tXjdAWitFyb6NvXnZ6DyHb3VR9VRwEMqEKKbSZBvmb9ANTz3EJwmGCK13dTJnZCtNcm4YNL
```

### Step 5 — Second Wallet & Transfer 100 Tokens
```bash
solana-keygen new --outfile ~/second-wallet.json --no-bip39-passphrase --force
# Second wallet pubkey: HxpSz71T5LiZV21N6PxRSVHqiLRmeDT2hGFbWCCXX1tE

spl-token create-account 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8 \
  --owner ~/second-wallet.json --fee-payer ~/.config/solana/id.json
# Account: BzHipWeqK2WgEs5zQCQ8qMUirTqzPeqdi6hDrhMufKYE
# Sig: 4z4Cr2S24ExnkVDkeZ8JuQqvpG3RYVBesqJjQFkmvfuvjFaUbvJ7gidUZVcqBW4BWXYm5H7wKF5gXWRan6ck8PoM

spl-token transfer 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8 100 ~/second-wallet.json \
  --expected-fee 1 --allow-unfunded-recipient
# Sender: 3tyJtcLfprawA3ojqKgV6ttrPGB3dJ2H9fuTz9dGLkQK
# Recipient ATA: BzHipWeqK2WgEs5zQCQ8qMUirTqzPeqdi6hDrhMufKYE
# Sig: 3t4XxGjXGfSf34HYJ28fKt7RPuA9cpkUp1HWSxuwLXwwZ6DUfCpV2mpRPWQwm5vuJZVW6wCU3eDNGnbQaiUdj7tz
```

### Step 6 — Balance Check — Transfer Fee Proof ✅
```bash
spl-token balance 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8
# 900   ⬅ sent 100, kept 900

spl-token balance 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8 --owner ~/second-wallet.json
# 99    ⬅ received 100, 1 withheld as fee
```

### Step 7 — Interest-Adjusted Display Amount
```bash
spl-token display 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8
# All 3 extensions still active, supply: 100000 (raw)
# Interest compounding silently on UI amount
```

> The interest-bearing extension operates completely independently of the transfer fee — one adjusts **display amounts**, the other **deducts tokens** during transfers.

### Step 8 — Harvest Withheld Fees
```bash
spl-token accounts --owner ~/second-wallet.json -v
# BzHipWeqK2WgEs5zQCQ8qMUirTqzPeqdi6hDrhMufKYE  Balance: 99

spl-token withdraw-withheld-tokens \
  3tyJtcLfprawA3ojqKgV6ttrPGB3dJ2H9fuTz9dGLkQK \
  BzHipWeqK2WgEs5zQCQ8qMUirTqzPeqdi6hDrhMufKYE
# Sig: 4uLfnkbnrmpHofZrRe9vGGeinuf8bFaz1WVPCgugmhmv8dSnnTtkuTsuSfWuerjFnHfHTMXdNZaG7GTt65RDWMZo
```

The 1 withheld ARC token is transferred back to your account. ✅

---

## Balance Summary

| Wallet | Action | Balance |
|--------|--------|---------|
| My wallet | Minted 1000, sent 100 | **900** |
| Second wallet | Received 100 - 1% fee | **99** |
| Withheld fee | Harvested back to my wallet | **1** |

---

## Extension Composability — The Key Insight

In **Web2**, combining these three features means:
- Payment processor (Stripe) for transfer fees
- A scheduled interest calculation service / cron
- A metadata API / CDN for token info
- All three are separate dependencies with independent failure modes

On **Solana with Token-2022**, all three live inside the **same on-chain mint account**, enforced by the same program, declared at creation time:

```
--transfer-fee-basis-points 100   → fee engine
--interest-rate 5                  → display formula
--enable-metadata                  → on-chain identity
```

> ⚠️ Critical constraint: **Extensions cannot be added after mint creation.** You must declare all capabilities upfront — similar to defining a database schema before writing rows.

---

## Extension Comparison

| Extension | What it does | Touches raw balance? |
|-----------|-------------|---------------------|
| Transfer fee | Withholds % on every transfer into recipient withheld slot | ✅ Yes |
| Interest-bearing | Adjusts UI display amount via compounding formula | ❌ No |
| Metadata | Stores name, symbol, URI directly on mint account | ❌ No |

---

## Transactions on Devnet

| Action | Signature |
|--------|-----------|
| Create multi-extension mint | `4D9gPh6E...` |
| Initialize metadata | `vQ5k9HLZ...` |
| Create my token account | `3yTaEvE3...` |
| Mint 1000 tokens | `2RF9hXXD...` |
| Create second wallet token account | `4z4Cr2S2...` |
| Transfer 100 (fee withheld) | `3t4XxGjX...` |
| Harvest withheld fees | `4uLfnkbn...` |

---

*Part of [#100DaysOfSolana](https://github.com/gopichandchalla16/100-days-of-solana) — building in public daily.*
