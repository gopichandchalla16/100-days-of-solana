# Day 72 — Mint Token-2022 Tokens with a CPI

**Challenge:** Mint Token-2022 tokens through an Anchor program using a CPI to `token_interface::mint_to`.

## What I built

An Anchor 1.0 program (`token_cpi`) that exposes a single `mint_tokens` instruction. Instead of minting directly from the client, the program calls the Token-2022 program via a Cross-Program Invocation (CPI) using `anchor-spl`'s `token_interface` module.

## Key concepts

| Piece | Purpose |
|---|---|
| `anchor-spl::token_interface` | Token-program-agnostic CPI helpers (works for both SPL Token and Token-2022) |
| `InterfaceAccount<'info, Mint>` | Accepts any token-program mint account |
| `Interface<'info, TokenInterface>` | Accepts either `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` or `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` |
| `MintTo { mint, to, authority }` | The three accounts Token-2022 needs to mint |
| `CpiContext::new(program_key, accounts)` | Bundles the target program + accounts for Anchor 1.0 |

## Test result

```
  token_cpi
Minted base units: 1000000000
    ✔ mints Token-2022 tokens through the program (601ms)

  1 passing (607ms)
```

## Why `token_interface` instead of `token`?

`anchor_spl::token` is hard-coded to the classic SPL Token program ID. `token_interface` resolves the program ID at runtime from the account you pass in, so the same instruction works for both Token and Token-2022 without any code change.
