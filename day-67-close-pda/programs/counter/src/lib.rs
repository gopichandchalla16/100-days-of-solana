use anchor_lang::prelude::*;

declare_id!("D6Wr9PKwA8fi4tJawzMTgJNi1ZREyxrnYac684dGmJNJ");

#[program]
pub mod counter {
    use super::*;

    pub fn init_config(ctx: Context<InitConfig>) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.admin = ctx.accounts.admin.key();
        config.paused = false;
        config.bump = ctx.bumps.config;
        Ok(())
    }

    pub fn set_paused(ctx: Context<SetPaused>, paused: bool) -> Result<()> {
        ctx.accounts.config.paused = paused;
        Ok(())
    }

    pub fn init_counter(ctx: Context<InitCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.user = ctx.accounts.user.key();
        counter.count = 0;
        counter.bump = ctx.bumps.counter;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        require!(!ctx.accounts.config.paused, ErrorCode::Paused);
        ctx.accounts.counter.count += 1;
        Ok(())
    }

    pub fn close_counter(_ctx: Context<CloseCounter>) -> Result<()> {
        Ok(())
    }
}

#[account]
pub struct Config {
    pub admin: Pubkey,
    pub paused: bool,
    pub bump: u8,
}

#[account]
pub struct Counter {
    pub user: Pubkey,
    pub count: u64,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct InitConfig<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 1 + 1,
        seeds = [b"config"],
        bump,
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
        init,
        payer = user,
        space = 8 + 32 + 8 + 1,
        seeds = [b"counter", user.key().as_ref()],
        bump,
    )]
    pub counter: Account<'info, Counter>,
    #[account(
        seeds = [b"config"],
        bump = config.bump,
    )]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(
        mut,
        seeds = [b"counter", user.key().as_ref()],
        bump = counter.bump,
        has_one = user,
    )]
    pub counter: Account<'info, Counter>,
    #[account(
        seeds = [b"config"],
        bump = config.bump,
    )]
    pub config: Account<'info, Config>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseCounter<'info> {
    #[account(
        mut,
        close = user,
        seeds = [b"counter", user.key().as_ref()],
        bump = counter.bump,
        has_one = user,
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Program is paused")]
    Paused,
}
