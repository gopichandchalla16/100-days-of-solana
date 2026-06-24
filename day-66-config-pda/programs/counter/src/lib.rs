use anchor_lang::prelude::*;

declare_id!("DodFVa4BFYGnMB49Z274dBDWiBAz7wTpaaWnWeeU7KJq");

// ─── Account Types ───────────────────────────────────────────────────────────

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub admin: Pubkey,
    pub paused: bool,
    pub total_counters: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub user: Pubkey,
    pub count: u64,
    pub bump: u8,
}

// ─── Errors ──────────────────────────────────────────────────────────────────

#[error_code]
pub enum CounterError {
    #[msg("counter overflow")]
    Overflow,
    #[msg("Increments are currently paused")]
    Paused,
}

// ─── Program ─────────────────────────────────────────────────────────────────

#[program]
pub mod counter {
    use super::*;

    /// One-time setup: the first caller becomes admin.
    pub fn init_config(ctx: Context<InitConfig>) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.admin = ctx.accounts.admin.key();
        config.paused = false;
        config.total_counters = 0;
        config.bump = ctx.bumps.config;
        Ok(())
    }

    /// Admin can flip the global pause switch.
    pub fn set_paused(ctx: Context<SetPaused>, paused: bool) -> Result<()> {
        ctx.accounts.config.paused = paused;
        Ok(())
    }

    /// Any wallet can create its own counter; total_counters is incremented.
    pub fn init_counter(ctx: Context<InitCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.user = ctx.accounts.user.key();
        counter.count = 0;
        counter.bump = ctx.bumps.counter;

        let config = &mut ctx.accounts.config;
        config.total_counters = config.total_counters.checked_add(1).unwrap();
        Ok(())
    }

    /// Increment — blocked when paused; only the owning wallet may call.
    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count.checked_add(1).map_err(|_| CounterError::Overflow)?;
        Ok(())
    }
}

// ─── Accounts Structs ────────────────────────────────────────────────────────

#[derive(Accounts)]
pub struct InitConfig<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + Config::INIT_SPACE,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetPaused<'info> {
    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump,
        has_one = admin,
    )]
    pub config: Account<'info, Config>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct InitCounter<'info> {
    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump,
    )]
    pub config: Account<'info, Config>,
    #[account(
        init,
        payer = user,
        space = 8 + Counter::INIT_SPACE,
        seeds = [b"counter", user.key().as_ref()],
        bump
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(
        seeds = [b"config"],
        bump = config.bump,
        constraint = !config.paused @ CounterError::Paused,
    )]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        seeds = [b"counter", user.key().as_ref()],
        bump = counter.bump,
        has_one = user,
    )]
    pub counter: Account<'info, Counter>,
    pub user: Signer<'info>,
}
