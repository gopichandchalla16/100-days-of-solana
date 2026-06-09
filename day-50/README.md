# Day 50 — Create a Fee-Bearing Token with Token-2022

> **Challenge:** Create a Solana token that charges a transfer fee automatically using the Transfer Fee extension — no custom smart contract code required. The middleware lives inside the asset.

🎉 **Day 50 of 100 — Half century!**

---

## Token Created

| Field | Value |
|-------|-------|
| **Mint Address** | `HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr` |
| **Program** | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` (Token-2022) |
| **Decimals** | 6 |
| **Transfer Fee** | 100 bps (1%) |
| **Max Fee** | 1,000,000 |
| **Mint Authority** | `AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y` |
| **Token Account** | `75Wzc54YESWxxfWTCWFcLkR4sZ8DJhHh4fmLzGv1FBzs` |
| **Supply Minted** | 1,000 tokens |
| **Explorer** | [View on Devnet](https://explorer.solana.com/address/HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr?cluster=devnet) |

---

## Commands Run

### Step 1 — Create fee-bearing mint

```bash
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  create-token \
  --transfer-fee-basis-points 100 \
  --transfer-fee-maximum-fee 1000000 \
  --decimals 6
```

**Mint:** `HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr`
**Signature:** [2NjhYaN...yuJz](https://explorer.solana.com/tx/2NjhYaN6moeGH8gCBuM46RKo9NfGrDPcKpseNfn8HARMfJgLpKpFrmWTnHhF7Y9PMRmtxGc4ZEZQoHB6UBeVyuJz?cluster=devnet)

---

### Step 2 — Create associated token account

```bash
spl-token create-account HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr
```

**Account:** `75Wzc54YESWxxfWTCWFcLkR4sZ8DJhHh4fmLzGv1FBzs`
**Signature:** [3859wo...E3ph](https://explorer.solana.com/tx/3859wobKXDMAQZs5uBQ8eqMXFwENxcYHpRpwz3fjQtauvNsziRtnJmF8x1XAqCMJtDwt2sVTAmK2PfhKBvx6E3ph?cluster=devnet)

---

### Step 3 — Mint 1000 tokens

```bash
spl-token mint HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr 1000
```

**Signature:** [5TuSiv...G8HN](https://explorer.solana.com/tx/5TuSivWAh2YcxjJ2omt1W3v3JC3FHBFqJY8v71LXMSoWmie7E3qJAHNcrb5p5Y387pTGPZQWR2eKvYzRnkNjG8HN?cluster=devnet)

---

### Step 4 — Verify on-chain

```bash
spl-token display HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr
```

**Output:**
```
SPL Token Mint
  Address: HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 1000000000
  Decimals: 6
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: (not set)
Extensions
  Transfer fees:
    Current fee: 100bps
    Current maximum: 1000000000000
    Config authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withdrawal authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withheld fees: 0
```

---

## Transaction History

| Step | Action | Signature | Status |
|------|--------|-----------|--------|
| 1 | Create fee-bearing mint | [2NjhYaN...yuJz](https://explorer.solana.com/tx/2NjhYaN6moeGH8gCBuM46RKo9NfGrDPcKpseNfn8HARMfJgLpKpFrmWTnHhF7Y9PMRmtxGc4ZEZQoHB6UBeVyuJz?cluster=devnet) | ✅ |
| 2 | Create token account | [3859wo...E3ph](https://explorer.solana.com/tx/3859wobKXDMAQZs5uBQ8eqMXFwENxcYHpRpwz3fjQtauvNsziRtnJmF8x1XAqCMJtDwt2sVTAmK2PfhKBvx6E3ph?cluster=devnet) | ✅ |
| 3 | Mint 1000 tokens | [5TuSiv...G8HN](https://explorer.solana.com/tx/5TuSivWAh2YcxjJ2omt1W3v3JC3FHBFqJY8v71LXMSoWmie7E3qJAHNcrb5p5Y387pTGPZQWR2eKvYzRnkNjG8HN?cluster=devnet) | ✅ |

---

## What I Learned

- The Transfer Fee extension bakes the fee rule **directly into the mint account** — not a wrapper contract, not middleware next to the asset, but inside the asset itself.
- Every wallet, program, and CLI that handles this token automatically respects the 1% fee because it is enforced by the Token-2022 program at the protocol level. There is no way to route around it.
- `100 basis points = 1%` — the fee is deducted from the transferred amount and held as `withheld fees` on the destination token account, ready to be withdrawn by the withdrawal authority.
- This is the Web2-to-Web3 mental model shift: instead of shipping middleware next to your asset, you ship the rule once, on the mint, and every downstream integration inherits it for free.

---

## The Key Mental Model

```
Web2 approach:
  Transfer → Your middleware wrapper → Skim 1% → Forward rest
  (Every integration must call your wrapper. If they don't, no fee.)

Solana Token-2022 approach:
  Transfer → Token-2022 program checks TransferFeeConfig → Auto-skims 1%
  (Every integration inherits the fee. No wrapper. No trust required.)
```

---

> *"Extensions are composable rules you snap onto a mint at creation time. Transfer Fee is one. Non-Transferable, Interest-Bearing, Default Account State, Permanent Delegate are all in the same family."*
> — 100 Days of Solana, Day 50
