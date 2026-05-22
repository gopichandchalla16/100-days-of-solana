# Day 32 — Review Token Incentive Mechanics

> **Challenge:** Build the full token lifecycle in one sitting — mint, metadata, transfer fees, and fee collection — without notes.

---

## What I Built

**ReinforceCoin (RFC)** — a Token-2022 token with:
- ✅ On-chain metadata (name, symbol, URI)
- ✅ 2% transfer fee (200 basis points)
- ✅ Maximum fee cap: 5000 tokens
- ✅ Full lifecycle: mint → transfer → fee collection

---

## Token Details

| Field | Value |
|-------|-------|
| **Mint Address** | `6YnDTE8cETtvKyesVM9frSeWCfpQUx757qcCQyHaBe9T` |
| **Program** | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` (Token-2022) |
| **Name** | ReinforceCoin |
| **Symbol** | RFC |
| **Decimals** | 9 |
| **Transfer Fee** | 200 bps (2%) |
| **Max Fee** | 5000000000000 (raw) |
| **My Token Account** | `7MSSyMH5HUVFjkhgGMK6D4qC4gFmJ62ioZ5Jfd9NE8Qc` |
| **Recipient Token Account** | `91AnkiG4vspsVpumzR8nuq7agfvYeFt7yfFjmJTVgGby` |

---

## Steps Executed

### Step 1 — Confirm Environment
```bash
solana config set --url devnet
solana balance
# Output: 6.11911064 SOL ✅
```

### Step 2 — Create Token-2022 with Transfer Fee + Metadata
```bash
spl-token create-token \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --transfer-fee-basis-points 200 \
  --transfer-fee-maximum-fee 5000 \
  --enable-metadata \
  --decimals 9

# Mint: 6YnDTE8cETtvKyesVM9frSeWCfpQUx757qcCQyHaBe9T
# Sig:  32T6kBhUsH8fMdL4eHHhp7pwGRhQSvTFBevx3pJamyuoaUh2Tf1UpFNBNtE96qzxkF1sHeCeR4xaJdTswmFfp9Zn
```

### Step 3 — Initialize Metadata
```bash
spl-token initialize-metadata 6YnDTE8cETtvKyesVM9frSeWCfpQUx757qcCQyHaBe9T \
  "ReinforceCoin" "RFC" \
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/metadata.json"

# Sig: 2T2CTLaqgu97JgaFhQWNmnPKowtZPC1864F4wLsi2TRjc5AvHcn7XvSRkrNZ6Qacmr9awND1VybqageuhQX9kpSB
```

### Step 4 — Create Account + Mint 1000 RFC
```bash
spl-token create-account 6YnDTE8cETtvKyesVM9frSeWCfpQUx757qcCQyHaBe9T
# Account: 7MSSyMH5HUVFjkhgGMK6D4qC4gFmJ62ioZ5Jfd9NE8Qc

spl-token mint 6YnDTE8cETtvKyesVM9frSeWCfpQUx757qcCQyHaBe9T 1000
# Balance: 1000 ✅
```

### Step 5 — Create Second Wallet Token Account
```bash
spl-token create-account 6YnDTE8cETtvKyesVM9frSeWCfpQUx757qcCQyHaBe9T \
  --owner GLyRe2CitW4xErgvn1AE17nzG3ZCVRrxQ7vx8BM9Eats \
  --fee-payer ~/.config/solana/id.json
# Account: 91AnkiG4vspsVpumzR8nuq7agfvYeFt7yfFjmJTVgGby
```

### Step 6 — Transfer 100 RFC (2% fee withheld)
```bash
spl-token transfer --fund-recipient 6YnDTE8cETtvKyesVM9frSeWCfpQUx757qcCQyHaBe9T 100 \
  GLyRe2CitW4xErgvn1AE17nzG3ZCVRrxQ7vx8BM9Eats \
  --expected-fee 2 --allow-unfunded-recipient

# Recipient received: 98 RFC ✅ (2 RFC withheld as fee)
# Sig: onh5PTSN6FHTa2DH3cTVrkxqKPAVBjc8uuQS8T83PS7BEo3jmSUL6CqUpXjwcy2gBZrKVCo3EMMUxN8Ewgx3SG4
```

### Step 7 — Withdraw Withheld Fees
```bash
spl-token withdraw-withheld-tokens \
  7MSSyMH5HUVFjkhgGMK6D4qC4gFmJ62ioZ5Jfd9NE8Qc \
  91AnkiG4vspsVpumzR8nuq7agfvYeFt7yfFjmJTVgGby

# My balance after: 902 RFC ✅ (900 kept + 2 fees collected)
# Sig: 2ANGSCbhKV3NEkLe3c3WkoEAy3D3ii6pkhNiVHMLpJoyFqNyCyRBFcfk3QxmKS9bLCWzGFpgGwUMqNkJ67swAfX
```

### Step 8 — Final Display
```
SPL Token Mint
  Address: 6YnDTE8cETtvKyesVM9frSeWCfpQUx757qcCQyHaBe9T
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 1000000000000
  Decimals: 9
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: (not set)
Extensions
  Transfer fees:
    Current fee: 200bps
    Current maximum: 5000000000000
    Config authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withdrawal authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withheld fees: 0
  Metadata Pointer:
    Authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Metadata address: 6YnDTE8cETtvKyesVM9frSeWCfpQUx757qcCQyHaBe9T
  Metadata:
    Update Authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Mint: 6YnDTE8cETtvKyesVM9frSeWCfpQUx757qcCQyHaBe9T
    Name: ReinforceCoin
    Symbol: RFC
    URI: https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/metadata.json
```

---

## Key Takeaways

- The full token lifecycle: **create → configure → mint → transfer → collect** is a repeatable pattern
- Token-2022 enforces fees **at the protocol level** — no backend, no middleware
- Withheld fees sit locked in the recipient's token account until the **withdrawal authority** collects them
- Metadata lives **directly on-chain** inside the mint account — no separate metadata program needed
- In Web2, this would require a database + payment processor + API layer. On Solana: **4 CLI commands**

---

## Transactions on Devnet

| Action | Signature |
|--------|----------|
| Create mint | `32T6kBhU...` |
| Init metadata | `2T2CTLaq...` |
| Create account | `4ngw3Knf...` |
| Mint 1000 RFC | `5eEjwLX7...` |
| Create recipient account | `2EmCaK94...` |
| Transfer 100 RFC | `onh5PTSN...` |
| Withdraw fees | `2ANGSCbh...` |

---

*Part of [#100DaysOfSolana](https://github.com/gopichandchalla16/100-days-of-solana) — building in public daily.*
