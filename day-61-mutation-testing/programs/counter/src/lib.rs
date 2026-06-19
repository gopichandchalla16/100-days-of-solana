use anchor_lang::prelude::*;
use anchor_lang::solana_program::program_error::ProgramError;

declare_id!("4yXwSNTTQNAArrvxfwTB3fE2WPiePZbADzDqHQSsPttz");

// ────────────────────────────────────────────────────────────────────────
// Day 61 — Mutation Testing (hand-rolled)
//
// EXPERIMENT 1: Remove has_one = authority from Increment accounts struct
//   Bug:   #[account(mut)]  <- no has_one
//   Catch: increment_fails_when_wrong_authority_signs → RED (wrong authority
//          now accepted, assertion that result.is_err() fails)
//   Fix:   restore has_one = authority
//
// EXPERIMENT 2: Change checked_add(1) to checked_add(2)
//   Bug:   counter.count.checked_add(2)
//   Catch: initialize_then_increment → RED (assert_eq!(parsed.count, 1) fails
//          with left=2, right=1)
//   Fix:   restore checked_add(1)
//
// EXPERIMENT 3: Comment out counter.authority = ctx.accounts.authority.key()
//   Bug:   authority field left as default Pubkey::default() (all zeros)
//   Catch: initialize_then_increment → RED at increment step
//          ConstraintHasOne 2001: Left=111...111 Right=<real pubkey>
//          (failure is at increment, but the bug lives in initialize)
//   Fix:   uncomment the line
//
// All three bugs were planted, observed to turn the suite RED, then reverted.
// This file is the RESTORED (clean) version. Suite: 3 passed, 0 failed.
// ────────────────────────────────────────────────────────────────────────

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        // MUTATION 3 TARGET: comment this line out to plant the
        // "uninitialized authority" bug. The tx still succeeds but
        // authority stays Pubkey::default() (all zeros), causing
        // ConstraintHasOne 2001 on the very next increment call.
        counter.authority = ctx.accounts.authority.key(); // ← restored
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        // MUTATION 2 TARGET: change checked_add(1) to checked_add(2) to
        // plant the off-by-one bug. The tx succeeds but count == 2,
        // and assert_eq!(parsed.count, 1) turns RED immediately.
        counter.count = counter
            .count
            .checked_add(1) // ← restored (was 2 during experiment)
            .ok_or(ProgramError::ArithmeticOverflow)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Counter::INIT_SPACE,
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    // MUTATION 1 TARGET: remove `has_one = authority` to plant the
    // missing access-control bug. Any wallet can then increment any
    // counter, and increment_fails_when_wrong_authority_signs turns RED.
    #[account(mut, has_one = authority)] // ← restored
    pub counter: Account<'info, Counter>,
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub authority: Pubkey,
    pub count: u64,
}
