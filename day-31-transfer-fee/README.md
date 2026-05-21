# Day 31 — Explore Advanced Token Incentive Design

> **100 Days of Solana** · Arc: Token Fundamentals

## What I Did

Created a Token-2022 mint with a 1% transfer fee extension, transferred 100 tokens (1 withheld as fee), then swept the withheld fee back to my wallet.

## Token Details

| Field | Value |
|-------|-------|
| **Mint Address** | `FpR9UjJv8rGnGiwLD3FCvhxiAzqSF2rLxmjqh4qR6NbM` |
| **Program** | Token-2022 `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` |
| **Transfer Fee** | 1% (100 basis points) |
| **Max Fee** | 5000 base units |
| **Decimals** | 9 |
| **My Token Account** | `325YZrTDiKbMYJiKRwNMtd6bzXVExsGj5xMrvTbDZPog` |
| **Second Wallet** | `GLyRe2CitW4xErgvn1AE17nzG3ZCVRrxQ7vx8BM9Eats` |
| **Second Wallet Token Account** | `BpUvFogEhi5BMg3ddUHJgsVmUXiZb1K1ajHE1eWZnxUo` |

## Final Balances

| Account | Balance |
|---------|--------|
| My wallet (after fee withdrawal) | **901 tokens** ✅ |
| Second wallet | **99 tokens** ✅ |
| Withheld fee swept | **1 token** ✅ |

## Commands Run

```bash
# Step 1: Create token with 1% transfer fee
spl-token create-token \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --transfer-fee-basis-points 100 \
  --transfer-fee-maximum-fee 5000
# → FpR9UjJv8rGnGiwLD3FCvhxiAzqSF2rLxmjqh4qR6NbM

# Step 2: Create token account + mint 1000
spl-token create-account FpR9UjJv8rGnGiwLD3FCvhxiAzqSF2rLxmjqh4qR6NbM
# → 325YZrTDiKbMYJiKRwNMtd6bzXVExsGj5xMrvTbDZPog
spl-token mint FpR9UjJv8rGnGiwLD3FCvhxiAzqSF2rLxmjqh4qR6NbM 1000

# Step 3: Create token account for second wallet
spl-token create-account FpR9UjJv8rGnGiwLD3FCvhxiAzqSF2rLxmjqh4qR6NbM \
  --owner GLyRe2CitW4xErgvn1AE17nzG3ZCVRrxQ7vx8BM9Eats \
  --fee-payer ~/.config/solana/id.json
# → BpUvFogEhi5BMg3ddUHJgsVmUXiZb1K1ajHE1eWZnxUo

# Step 4: Transfer 100 tokens with expected fee of 1
spl-token transfer FpR9UjJv8rGnGiwLD3FCvhxiAzqSF2rLxmjqh4qR6NbM 100 \
  GLyRe2CitW4xErgvn1AE17nzG3ZCVRrxQ7vx8BM9Eats \
  --expected-fee 1 --allow-unfunded-recipient

# Step 5: Check balances
spl-token balance FpR9UjJv8rGnGiwLD3FCvhxiAzqSF2rLxmjqh4qR6NbM
# → 900
spl-token balance FpR9UjJv8rGnGiwLD3FCvhxiAzqSF2rLxmjqh4qR6NbM \
  --owner GLyRe2CitW4xErgvn1AE17nzG3ZCVRrxQ7vx8BM9Eats
# → 99  (100 sent - 1 withheld as fee)

# Step 6: Withdraw withheld fees
spl-token withdraw-withheld-tokens \
  325YZrTDiKbMYJiKRwNMtd6bzXVExsGj5xMrvTbDZPog \
  BpUvFogEhi5BMg3ddUHJgsVmUXiZb1K1ajHE1eWZnxUo

spl-token balance FpR9UjJv8rGnGiwLD3FCvhxiAzqSF2rLxmjqh4qR6NbM
# → 901  (900 + 1 fee swept back)
```

## Transaction Signatures

| Action | Signature |
|--------|----------|
| Create Mint | `5Vk8Mss646RWrNLXvE9CWUzV5dCEzAzf45uECKD2sEhUvBfGW1Yy5pmb94rnXHomwfDpgQYMnJ25WP7oe7s3cb2u` |
| Create My Token Account | `tqGQaqrCkw2n4rZZHnE9aAPpvAXjxnT3iR9hEQhexYxDwzeawKBvqxLNHqCxrWm2cHcgwzfjvF1hv3qKTAtxJpW` |
| Mint 1000 | `uYQQ8K8BNtnL1vDkSbwah8NXjtFPF3LXqkBNGpVrBZjWiFnKPgk1XNCHGKJirmHDFAb8gH531FtLMzH2hKBnbXA` |
| Create Second Wallet ATA | `57Ms7tgChyzJsZsxnT6HMwHTAdj2Z3kxvSgSj8kaYtNwYiyjngp9JFMX73jMmtkPjrfHkXWBXt33rH7Wzex2Bope` |
| Transfer 100 (1 withheld) | `58fQG8dAFXDJ6gWpQbRgQVMmp1ESQLZ5TwUfFMqpsvdWg8URhYLp4WFHVU34e62cK2Y4kcQYbXrEexkUuEnUTeS9` |
| Withdraw Withheld Fee | `318prwvajYSX1xcCTkmRPA5vpTqixPeJV9o7GYRhbocC1kT3TAYsSjJGb4CTkt15b2dUUSfg44b54WBKNudUaw3b` |

## Key Learnings

- **Basis points**: 100 bps = 1% fee. Transfer of 100 tokens → 1 token withheld
- **Extensions are immutable**: Transfer fee must be set at mint creation — cannot be added later
- **Withheld ≠ received**: Recipient gets 99, but 1 sits locked in their token account
- **Withdraw withheld authority**: Only the mint creator (my wallet) can sweep fees out
- **`--expected-fee` flag**: Safety check — transfer fails if calculated fee ≠ specified fee
- **`--allow-unfunded-recipient`**: Needed even when ATA exists if the owner wallet has no SOL

## Fee Flow Diagram

```
My Wallet (1000)
    │
    ├── transfer 100 ──► Second Wallet receives 99
    │                        1 withheld in their ATA
    │
    └── withdraw-withheld ► My Wallet gets the 1 back

Final: My Wallet = 901 | Second Wallet = 99
```

## Web2 Analogy

| Web2 Concept | Solana Equivalent |
|---|---|
| Payment processor fee (e.g. Stripe 2.9%) | Transfer fee basis points |
| Middleware fee handler | Token-2022 transfer fee extension |
| Fee collection job / cron | `withdraw-withheld-tokens` |
| Max fee cap | `--transfer-fee-maximum-fee` |

## Devnet Explorer

[View Mint on Solana Explorer](https://explorer.solana.com/address/FpR9UjJv8rGnGiwLD3FCvhxiAzqSF2rLxmjqh4qR6NbM?cluster=devnet)

---

*Day 31 of 100 — #100DaysOfSolana by [@GopichandAI](https://twitter.com/GopichandAI)*
