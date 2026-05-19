# Day 29 — Exploring Token Economics & Incentives

> **100 Days of Solana** · Arc: Token Fundamentals

## What I Did

Created a custom SPL token on Solana devnet, minted 100 tokens, and inspected the on-chain state.

## Token Details

| Field | Value |
|-------|-------|
| **Mint Address** | `2M6t3SbJMz95mZ8nzF8MLq364v2ZQQ235BkxhE93g7hq` |
| **Token Account** | `B4SSsjUA1fcJmjMhmYis3EpLTSBD9GGo1DBEZAwjae7c` |
| **Supply (raw)** | `100000000000` |
| **Decimals** | `9` |
| **Human Supply** | `100 tokens` |
| **Program** | `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` |
| **Mint Authority** | `AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y` |
| **Freeze Authority** | `(not set)` |

## Commands Run

```bash
solana config set --url devnet
solana address              # AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
solana balance              # 6.137925 SOL

spl-token create-token
# → 2M6t3SbJMz95mZ8nzF8MLq364v2ZQQ235BkxhE93g7hq

spl-token create-account 2M6t3SbJMz95mZ8nzF8MLq364v2ZQQ235BkxhE93g7hq
# → B4SSsjUA1fcJmjMhmYis3EpLTSBD9GGo1DBEZAwjae7c

spl-token mint 2M6t3SbJMz95mZ8nzF8MLq364v2ZQQ235BkxhE93g7hq 100

spl-token supply 2M6t3SbJMz95mZ8nzF8MLq364v2ZQQ235BkxhE93g7hq
# → 100

spl-token accounts
# Token: 2M6t3SbJMz95mZ8nzF8MLq364v2ZQQ235BkxhE93g7hq  Balance: 100

spl-token display 2M6t3SbJMz95mZ8nzF8MLq364v2ZQQ235BkxhE93g7hq
# SPL Token Mint
#   Address:         2M6t3SbJMz95mZ8nzF8MLq364v2ZQQ235BkxhE93g7hq
#   Program:         TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
#   Supply:          100000000000
#   Decimals:        9
#   Mint authority:  AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
#   Freeze authority: (not set)
```

## Key Learnings

- **Mint Account** = global source of truth for a token (supply, decimals, mint authority)
- **Token Account** = per-wallet per-token "folder" — you must create it before receiving tokens
- **Raw supply** = `100 × 10^9 = 100,000,000,000` because decimals = 9
- **SPL Token Program** is shared and audited — no custom smart contract needed
- **Freeze authority** is optional; if not set, tokens flow freely

## Devnet Explorer

[View Mint on Solana Explorer](https://explorer.solana.com/address/2M6t3SbJMz95mZ8nzF8MLq364v2ZQQ235BkxhE93g7hq?cluster=devnet)

---

*Day 29 of 100 — #100DaysOfSolana by [@GopichandAI](https://twitter.com/GopichandAI)*
