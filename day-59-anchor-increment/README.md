# Day 59 — Add an Increment Instruction and Test Both Calls End to End

## What I Built
Extended the Anchor counter program from Day 58 by adding an `increment` instruction with `has_one = authority` constraint and a full end-to-end LiteSVM test.

## Key Concepts
- `has_one = authority` — Anchor enforces the signer matches the stored authority **before** the handler runs (declarative authorization)
- `checked_add(1)` — safe arithmetic; returns `ArithmeticOverflow` error instead of panicking
- LiteSVM state **persists across transactions** in one test instance — true end-to-end simulation, no validator needed
- `has_one` is the Solana equivalent of `if request.user.id !== resource.authority_id: return 403`

## Program Structure
```rust
// handler — bumps count safely
pub fn increment(ctx: Context<Increment>) -> Result<()> {
    let counter = &mut ctx.accounts.counter;
    counter.count = counter.count
        .checked_add(1)
        .ok_or(ProgramError::ArithmeticOverflow)?;
    Ok(())
}

// accounts struct — constraint enforced at macro layer
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut, has_one = authority)]
    pub counter: Account<'info, Counter>,
    pub authority: Signer<'info>,
}
```

## Test Flow
```
initialize (payer = authority, counter_kp)
    → increment (signer = authority)
        → assert count == 1 ✅
        → assert authority == authority.pubkey() ✅
```

## Test Result
```
running 1 test
test initialize_then_increment ... ok
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; finished in 0.44s
```

## How to Run
```bash
cd ~/100-days-of-solana/day-58-counter-state
anchor build
cargo test -p day-58-counter-state --test counter -- --nocapture
```

## Files
- `lib.rs` — updated program with `initialize` + `increment` handlers and `has_one` constraint
- `counter.rs` — end-to-end LiteSVM test: initialize → increment → assert

## Tomorrow (Day 60)
Deliberately break the `has_one` constraint by passing a **stranger's signer** to prove the 403-equivalent rejection works.
