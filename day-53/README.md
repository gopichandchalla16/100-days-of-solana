# Day 53 — Audit Your Token-2022 Mints and Map Every Extension

> **Challenge:** Point `spl-token display` at your two previous mints and confirm, with your own eyes, that the configuration you typed is the configuration that actually lives on chain. No new extensions. No new programs. Just reading what you built.

---

## The Two Mints Under Audit

| | Day 50/51 Mint | Day 52 Mint |
|--|----------------|-------------|
| **Address** | `HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr` | `A6TAeNgxBVwYna8NqQVmBpQzjVYKoZA3e68yMvoVVUva` |
| **Program** | Token-2022 | Token-2022 |
| **Extensions** | TransferFeeConfig only | TransferFeeConfig + InterestBearingConfig |
| **Explorer** | [View](https://explorer.solana.com/address/HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr?cluster=devnet) | [View](https://explorer.solana.com/address/A6TAeNgxBVwYna8NqQVmBpQzjVYKoZA3e68yMvoVVUva?cluster=devnet) |

---

## Commands Run

```bash
solana config set --url https://api.devnet.solana.com
solana balance

# Audit Day 50/51 mint (fee-only)
spl-token display HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr

# Audit Day 52 mint (fee + interest stacked)
spl-token display A6TAeNgxBVwYna8NqQVmBpQzjVYKoZA3e68yMvoVVUva
```

---

## Audit Output — Day 50/51 Mint (Fee-Only)

```
SPL Token Mint
  Address: HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 1001000000000
  Decimals: 6
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: (not set)
Extensions
  Transfer fees:
    Current fee: 100bps          ← 1% fee on every transfer ✅
    Current maximum: 1000000000000
    Config authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withdrawal authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withheld fees: 0
```

**Extensions found:** 1 — `TransferFeeConfig` only ✅

---

## Audit Output — Day 52 Mint (Fee + Interest Stacked)

```
SPL Token Mint
  Address: A6TAeNgxBVwYna8NqQVmBpQzjVYKoZA3e68yMvoVVUva
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 1000000000000
  Decimals: 6
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: (not set)
Extensions
  Interest-bearing:
    Current rate: 5000bps        ← 50% APR compounding via clock ✅
    Average rate: 5000bps
    Rate authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Transfer fees:
    Current fee: 100bps          ← 1% fee on every transfer ✅
    Current maximum: 1000000000000
    Config authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withdrawal authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withheld fees: 0
```

**Extensions found:** 2 — `InterestBearingConfig` + `TransferFeeConfig` ✅

---

## Extension Map — Plain English

| Extension | What it does |
|-----------|-------------|
| **TransferFeeConfig** | Every time tokens move, the protocol automatically withholds a percentage (100bps = 1%) from the amount before crediting the recipient — no custom code, just a flag on the mint. |
| **InterestBearingConfig** | The mint stores an annual rate (5000bps = 50% APR) and the network clock; any reader can compute a growing UI amount from the raw balance at any moment — no transaction, no balance update, just math. |

---

## The Schema Analogy

```
SQL DESCRIBE table_name
  → shows columns, types, constraints, indexes

spl-token display MINT_ADDRESS
  → shows supply, decimals, authority, extensions

Key difference:
  SQL schema lives on a private server (you need credentials)
  Solana mint config lives on a public account (anyone reads it, forever)
  The configuration you typed 3 days ago is the same bytes
  a wallet, an exchange, or a hostile auditor sees right now.
```

---

## What I Learned

- `spl-token display` is not calling a private API — it is decoding the same public account bytes that every wallet on earth reads.
- The Day 50 mint has **one TLV entry** (TransferFeeConfig). The Day 52 mint has **two TLV entries** (InterestBearingConfig + TransferFeeConfig). The CLI prints them in the order they appear in the account's byte buffer.
- Both mints have the same `Config authority` and `Withdrawal authority` (`AWKYs...`), confirming they were created by the same wallet.
- `Withheld fees: 0` on both mints confirms the fee sweep from Day 51 and Day 52 completed successfully — the audit closes the loop on previous work.
- Token-2022 extensions are **configuration flags**, not custom programs. Two behaviors that previously required separate smart contracts now live as TLV entries in a single mint account.

---

> *"The moment after you finish building is the moment you run DESCRIBE. On Solana, that command is spl-token display, and the schema is public forever."*
> — 100 Days of Solana, Day 53
