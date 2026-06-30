# Day 73 — PDA Vault: Deposit + PDA-Signed Withdraw

## Challenge
**Move SOL into a PDA vault and let the program sign to withdraw it — your first PDA-signer CPI.**

## What I Built
An Anchor program (`vault`) with two instructions:
- **`deposit`** — user signs a CPI to the System Program transferring SOL into a PDA vault
- **`withdraw`** — the program itself signs the CPI using PDA seeds, draining the vault back to the user

This is the key unlock from Day 71: a real keypair's signature is forwarded automatically, but a PDA has no private key — you must pass `signer_seeds` into `CpiContext::new_with_signer` so the runtime can verify the program's authority.

## Key Concepts
- `seeds = [b"vault", user.key().as_ref()]` — per-user PDA deterministically derived
- `bump` stored via `ctx.bumps.vault` and passed into signer seeds
- `CpiContext::new_with_signer(program, accounts, signer_seeds)` — the PDA-signing form of CpiContext
- `SystemAccount<'info>` for the vault (no Anchor data, just lamports)
- Deposit: `CpiContext::new` (user signs the outer tx) → System Program transfer
- Withdraw: `CpiContext::new_with_signer` (program signs on behalf of PDA) → System Program transfer

## Test Results
```
  vault
vault after deposit: 500000000
vault after withdraw: 0
    ✔ deposits, then the program signs to withdraw (437ms)

  1 passing (444ms)
```

## Program
```rust
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("9ijB739rvqdAt23Ez9WgC9upuX2467fzhb9zU3BNbFbD");

#[program]
pub mod vault {
    use super::*;

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.key(),
            Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        transfer(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let user_key = ctx.accounts.user.key();
        let bump = ctx.bumps.vault;
        let signer_seeds: &[&[&[u8]]] = &[&[b"vault", user_key.as_ref(), &[bump]]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.system_program.key(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.user.to_account_info(),
            },
            signer_seeds,
        );
        transfer(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
```

## Resources
- [Anchor Docs: CPI](https://www.anchor-lang.com/docs/basics/cpi)
- [Solana Docs: CPI](https://solana.com/docs/intro/quick-start/cross-program-invocation)
