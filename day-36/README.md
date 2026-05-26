# Day 36 — Create an Interest-Bearing Token on Solana

> **Challenge:** Create a Token-2022 mint with the interest-bearing extension, mint tokens, compare raw vs UI balance, and update the interest rate.

---

## What I Built

An **Interest-Bearing Token** on Token-2022 using the `--interest-rate` extension:
- ✅ Created mint with 5% annual rate (500 bps)
- ✅ Minted 1000 tokens — UI amount already accruing from first second
- ✅ Updated rate to 150% (15000 bps)
- ✅ Proved raw balance stays `1000` while UI amount grows continuously

---

## Token Details

| Field | Value |
|-------|-------|
| **Mint Address** | `DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4` |
| **Program** | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` (Token-2022) |
| **Extension** | Interest-Bearing |
| **Initial Rate** | 500 bps (5% annual) |
| **Updated Rate** | 15000 bps (150% annual) |
| **Decimals** | 9 |
| **My Token Account** | `2UNRfo47m6tVGpvYmSBy8GcA8KoTLsU3vXJGbm7RUzBF` |

---

## Steps Executed

### Step 1 — Confirm Environment
```bash
solana config get
solana balance
# Output: 6.1037356 SOL ✅
```

### Step 2 — Create Interest-Bearing Mint (500 bps = 5%)
```bash
spl-token create-token \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --interest-rate 500

# Mint: DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4
# Sig:  3r7YB3wD6eok7B8gnNEZrbrspR4ePPQ4R41qkJh8RVrF64wGK4hKxfw6FVBEanKiiBg3Tj7jw8NcswTSwDpkKBjw
```

### Step 3 — Create Token Account
```bash
spl-token create-account DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4 \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
# Account: 2UNRfo47m6tVGpvYmSBy8GcA8KoTLsU3vXJGbm7RUzBF ✅
```

### Step 4 — Mint 1000 Tokens
```bash
spl-token mint DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4 1000 \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
# Sig: BgvM3NUrpucwsTwCPWZMRqEVYrZeFdEmZ1m9KoCpqUYyC2A29e56cS3kP4PEZixAmzykyqgn124AdBZdYx83zhN
```

### Step 5 — Raw Balance vs UI Amount (Key Proof ✅)
```bash
spl-token balance DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4 \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
# Output: 1000.000117249  ⬅️ UI amount already accruing!
```

> Raw on-chain supply: `1000000000000` (1000 with 9 decimals)
> UI display amount: `1000.000117249` — interest running from mint moment

### Step 6 — Inspect Interest Config
```bash
spl-token display DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4 \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
```

```
SPL Token Mint
  Address: DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 1000000000000
  Decimals: 9
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: (not set)
Extensions
  Interest-bearing:
    Current rate: 500bps
    Average rate: 500bps
    Rate authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
```

### Step 7 — Check RPC Account Data
```bash
solana account DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4 --output json
# Returns base64-encoded mint account data including interest rate + timestamps
```

### Step 8 — Update Rate to 15000 bps (150%)
```bash
spl-token set-interest-rate DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4 15000
# Sig: 2WTvqsmCbQ8yWc25hKEtYR9RAPNyA8TBF1JbhhjkTfhk6Ca5xeaskp9WNh6dzAUH3f6ioydcZr56t6ifRLrXp6pR
```

### Step 9 — Display After Rate Update
```bash
spl-token display DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4 \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

spl-token balance DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4 \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
```

```
Extensions
  Interest-bearing:
    Current rate: 15000bps   ⬅️ updated to 150%
    Average rate: 500bps     ⬅️ historical average preserved!
    Rate authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y

Balance: 1000.000255096      ⬅️ growing faster now!
```

---

## Raw vs UI Amount — The Proof

| Snapshot | Raw On-Chain | UI Display Amount | Rate |
|----------|-------------|-------------------|------|
| After mint | `1000` | `1000.000117249` | 500 bps |
| After rate update | `1000` | `1000.000255096` | 15000 bps |

> The raw balance **never changed**. The UI amount grew using continuous compounding:
> 
> **A = P × e^(r×t)**
>
> where P=1000, r=rate, t=elapsed time in years

---

## Key Insight

In **Web2**, showing interest requires:
- A backend service
- A scheduled job / cron
- A database with balance snapshots
- Application-layer math

On **Solana with Token-2022**, it requires:
- One flag at mint creation: `--interest-rate 500`
- Zero backend. Zero cron jobs. Zero coordination between services.

The extension stores the **rate** + **timestamp checkpoints** directly in the mint account. Any Token-2022-aware wallet computes the display amount automatically using the same formula. The rate authority can update the rate at any time, and the extension **preserves the historical average** so past accrual is never lost.

---

## Transactions on Devnet

| Action | Signature |
|--------|----------|
| Create interest-bearing mint | `3r7YB3wD...` |
| Create token account | `4s62zucM...` |
| Mint 1000 tokens | `BgvM3NUr...` |
| Update rate to 15000 bps | `2WTvqsmC...` |

---

*Part of [#100DaysOfSolana](https://github.com/gopichandchalla16/100-days-of-solana) — building in public daily.*
