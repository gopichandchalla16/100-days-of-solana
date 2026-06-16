use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod counter {
    use super::*;

    /// Initialize a new counter account with a starting value of 0
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        counter.authority = ctx.accounts.user.key();
        msg!("Counter initialized! count = {}", counter.count);
        Ok(())
    }

    /// Increment the counter by 1
    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count.checked_add(1).unwrap();
        msg!("Counter incremented! count = {}", counter.count);
        Ok(())
    }

    /// Decrement the counter by 1 (floor at 0)
    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count.checked_sub(1).unwrap_or(0);
        msg!("Counter decremented! count = {}", counter.count);
        Ok(())
    }

    /// Reset the counter back to 0
    pub fn reset(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        msg!("Counter reset! count = {}", counter.count);
        Ok(())
    }
}

// ── Account structs ──────────────────────────────────────────────────────────

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + CounterAccount::LEN
    )]
    pub counter: Account<'info, CounterAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut, has_one = authority)]
    pub counter: Account<'info, CounterAccount>,
    pub authority: Signer<'info>,
}

// ── State ────────────────────────────────────────────────────────────────────

#[account]
pub struct CounterAccount {
    pub count: u64,
    pub authority: Pubkey,
}

impl CounterAccount {
    // 8 bytes (u64) + 32 bytes (Pubkey)
    pub const LEN: usize = 8 + 32;
}
