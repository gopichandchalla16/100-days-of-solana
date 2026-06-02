# Day 43 — Mint a 1-of-1 SPL Token: Your First NFT

> **Challenge:** Create the simplest possible NFT on Solana — one indivisible token, one owner, and no way to mint another.

---

## NFT Details

| Field | Value |
|-------|-------|
| **Mint Address** | `6vQmZriYw7NtGsH67ANbZyJiLWWgYh75QHgRRsHSRMnE` |
| **Program** | `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` (Original SPL Token) |
| **Decimals** | 0 (indivisible) |
| **Supply** | 1 (fixed forever) |
| **Mint Authority** | **Disabled** 🔒 |
| **Token Account** | `FuzByqAiD3mHovnhYzFnDMtQf1PCofyQrrPfSgytY3WZ` |
| **Owner** | `AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y` |
| **Explorer** | [View on Devnet](https://explorer.solana.com/address/6vQmZriYw7NtGsH67ANbZyJiLWWgYh75QHgRRsHSRMnE?cluster=devnet) |

---

## Commands Run

### Step 1 — Confirm devnet
```bash
solana config set --url https://api.devnet.solana.com
solana balance
# Balance: 6.07758412 SOL
```

### Step 2 — Create mint (0 decimals)
```bash
spl-token create-token --decimals 0
# Mint: 6vQmZriYw7NtGsH67ANbZyJiLWWgYh75QHgRRsHSRMnE
# Sig:  3DeCjitEhxe376eLq3w71Has3SpE1ZDYKzWMPPGoChA7r3LRHjvBWiTz6xAKr4d2nmabuDPbD9Z3WG1QDyzRycAz
```

### Step 3 — Create token account
```bash
spl-token create-account 6vQmZriYw7NtGsH67ANbZyJiLWWgYh75QHgRRsHSRMnE
# Account: FuzByqAiD3mHovnhYzFnDMtQf1PCofyQrrPfSgytY3WZ
# Sig: 4wuPq7UYKtag4pUiPohEZzfC9vaRoWkpVAC1EjV8dsGmeBS2XRMSHRpy9U5UCByRMNtLVuXmwesfHUiorY97tT4K
```

### Step 4 — Mint exactly 1 token
```bash
spl-token mint 6vQmZriYw7NtGsH67ANbZyJiLWWgYh75QHgRRsHSRMnE 1
# Minting 1 tokens
# Recipient: FuzByqAiD3mHovnhYzFnDMtQf1PCofyQrrPfSgytY3WZ
# Sig: 2baSFKrq3Mtyhg3qMUkbvSsD8TuS6k6Zko3gESxceFWFjuvxADFCAADmPeFJZsDNUcER9abasDRQLxQSEudP9eFC
```

### Step 5 — Disable mint authority forever 🔒
```bash
spl-token authorize 6vQmZriYw7NtGsH67ANbZyJiLWWgYh75QHgRRsHSRMnE mint --disable
# Current mint: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
# New mint: disabled
# Sig: 4YGZw5QCdnY45ThnJMPJ3ToQ1ZSp3uUWJZQLH3TXngHvEykpkiLE81hRcTrLYBuTU1YuaGFbVtUxTw2WAKuT2HR9
```

### Step 6 — Verify supply
```bash
spl-token supply 6vQmZriYw7NtGsH67ANbZyJiLWWgYh75QHgRRsHSRMnE
# Output: 1
```

---

## Transaction History (Solana Explorer)

| Transaction | Instruction | Block | Status |
|-------------|-------------|-------|--------|
| [3DeCj...RycAz](https://explorer.solana.com/tx/3DeCjitEhxe376eLq3w71Has3SpE1ZDYKzWMPPGoChA7r3LRHjvBWiTz6xAKr4d2nmabuDPbD9Z3WG1QDyzRycAz?cluster=devnet) | Initialize Mint | 466,580,484 | ✅ Success |
| [4wuPq...7tT4K](https://explorer.solana.com/tx/4wuPq7UYKtag4pUiPohEZzfC9vaRoWkpVAC1EjV8dsGmeBS2XRMSHRpy9U5UCByRMNtLVuXmwesfHUiorY97tT4K?cluster=devnet) | Create Token Account | 466,580,668 | ✅ Success |
| [2baSF...P9eFC](https://explorer.solana.com/tx/2baSFKrq3Mtyhg3qMUkbvSsD8TuS6k6Zko3gESxceFWFjuvxADFCAADmPeFJZsDNUcER9abasDRQLxQSEudP9eFC?cluster=devnet) | Mint To Checked | 466,580,678 | ✅ Success |
| [4YGZw...T2HR9](https://explorer.solana.com/tx/4YGZw5QCdnY45ThnJMPJ3ToQ1ZSp3uUWJZQLH3TXngHvEykpkiLE81hRcTrLYBuTU1YuaGFbVtUxTw2WAKuT2HR9?cluster=devnet) | Set Authority (Disabled) | 466,580,690 | ✅ Success |

---

## What Makes This an NFT

| Property | Value | Why it matters |
|----------|-------|----------------|
| Decimals | 0 | Cannot be subdivided — no 0.5 of this token |
| Supply | 1 | Only one exists on the entire Solana network |
| Mint authority | Disabled | Nobody can ever create a second copy |

The two conditions for non-fungibility:
1. **Indivisible** — `--decimals 0`
2. **Uncopyable** — `authorize mint --disable`

Without metadata (name, image, description), Explorer shows it as "Unknown Token." That is intentional — the next days in this arc will layer on metadata using Token-2022 extensions and Metaplex. Today's lesson is the raw foundation every NFT is built on.

---

## Web2 Analogy

> Think of a unique row in a relational database with an immutable ownership history. The mint address is the primary key. There is exactly one row. Nobody — not even the creator — can insert a duplicate. The entire Solana network is the database.

---

*Part of [#100DaysOfSolana](https://github.com/gopichandchalla16/100-days-of-solana) — building in public daily.*
