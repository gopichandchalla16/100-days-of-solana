# Day 71 — Move SOL from Inside Your Program with a CPI

> **Challenge:** [100 Days of Solana — Day 71](https://www.mlh.com/events/100-days-of-solana/challenges/019f137c-fad9-d4c3-1645-e60101686d4b)

## What I Built

Wrote the **smallest possible Cross-Program Invocation (CPI)**: an Anchor 1.0 program that calls the Solana System Program's `transfer` instruction to move SOL from a signer to a recipient.

## What is a CPI?

A Cross-Program Invocation lets one Solana program pause mid-instruction, call a completely different program, wait for it to return, then resume. It is the feature that allows thousands of independent programs to compose into one ecosystem instead of thousands of walled gardens.

The key insight: **only the program that owns an account can reduce its lamport balance.** Ordinary wallets are owned by the System Program — not your program. So to move SOL, you don't reimplement lamport accounting yourself. You *ask* the System Program to do it. That request is a CPI.

## The Three Pieces

| Piece | Role |
|---|---|
| `Transfer` struct | Names the two accounts — `from` and `to` |
| `CpiContext::new(...)` | Bundles the target program ID + accounts struct |
| `transfer(cpi_context, amount)` | Fires the CPI into the runtime |

## Program Code

```rust
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("2RuhecMfTQqGwfgEC47ca965VqGUbTGefypkSY5Re6ob");

#[program]
pub mod sol_mover {
    use super::*;

    pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.sender.to_account_info(),
            to: ctx.accounts.recipient.to_account_info(),
        };
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.key(),
            cpi_accounts,
        );
        transfer(cpi_context, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,
    #[account(mut)]
    pub recipient: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
```

## Key Notes

- `sender` and `recipient` both marked `mut` — both balances change
- `sender` is a `Signer` — moving SOL requires the owner's authorization
- `system_program` must be included in the accounts struct to CPI into it
- In Anchor 1.0, `CpiContext::new` first arg is a `Pubkey` (use `.key()`), not `AccountInfo`
- **No signing code needed** — `sender` signed the outer transaction and the runtime carries that signature authority down into the CPI automatically

## Test Output

```
  sol-mover
Transaction signature: 389wbbxp3BnJMB44X6XrWNg2GmTk8vZfnzP6wSCFbQAj3STPiCian5RxT1u8jKKTD7z3dDAQ7vq2iRYJKRuw6HPZ
Recipient went from 0 to 250000000 lamports
    ✔ moves SOL with a CPI to the System Program


  1 passing

Done in 4.61s.
```

## What I Learned

- A CPI is the on-chain equivalent of calling another team's API instead of reimplementing the logic yourself
- The transfer is **atomic** — if the CPI fails, the entire outer instruction rolls back. You never end up half-done
- Signer authority is automatically forwarded through CPIs for real keypairs. PDA signing with seeds is a different skill (coming next)
- `anchor keys sync` resolves the `declared program id does not match` error by updating `declare_id!` to match your actual keypair

## Next Up

Signing on behalf of a PDA (which has no private key) — teaching the CPI how to "sign" with seeds instead.

## Resources

- [Anchor docs: Cross-Program Invocations](https://www.anchor-lang.com/docs/basics/cpi)
- [Solana docs: Cross Program Invocation](https://solana.com/docs/intro/quick-start/cross-program-invocation)
- [anchor-lang: system_program module](https://docs.rs/anchor-lang/latest/anchor_lang/system_program/index.html)
