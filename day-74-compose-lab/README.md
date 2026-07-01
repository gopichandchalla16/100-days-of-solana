# Day 74 — CPI to a Custom Program with `compose-lab`

> **Challenge:** Call another Anchor program via CPI using `declare_program!` — making two independent programs compose atomically on-chain.

## What I Built

A two-program workspace (`compose-lab`) where:
- **`counter`** — owns a `Tally` account and exposes `initialize` + `increment` instructions
- **`compose-lab`** — the caller program that CPIs into `counter` via `declare_program!` and a typed `CpiContext`

## Key Concepts

| Concept | What it does |
|---|---|
| `declare_program!(counter)` | Imports the counter program's types and CPI helpers at compile time from the IDL |
| `cpi::increment(cpi_ctx)` | Typed CPI call — no raw instruction building needed |
| `CpiContext::new(program_key, accounts)` | Bundles the callee program + its required accounts |
| `anchor new counter` | Adds a second program crate to the Anchor workspace |

## Workspace Structure

```
compose-lab/
├── programs/
│   ├── counter/src/lib.rs      # Tally account + initialize/increment
│   └── compose-lab/src/lib.rs  # bump() — CPIs into counter
├── tests/compose-lab.ts        # End-to-end: init tally → bump via CPI → assert count == 1
├── idls/counter.json           # Counter IDL (needed by declare_program!)
└── Anchor.toml
```

## Program Code

### counter/src/lib.rs
```rust
use anchor_lang::prelude::*;

declare_id!("8GM63Fe2dFnGEhxhJLh162GJ4cSpWgb927uW6sd2vzbx");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.tally.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        ctx.accounts.tally.count += 1;
        msg!("counter is now {}", ctx.accounts.tally.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = 8 + Tally::INIT_SPACE)]
    pub tally: Account<'info, Tally>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub tally: Account<'info, Tally>,
}

#[account]
#[derive(InitSpace)]
pub struct Tally {
    pub count: u64,
}
```

### compose-lab/src/lib.rs
```rust
use anchor_lang::prelude::*;

declare_program!(counter);

use counter::{
    accounts::Tally,
    cpi::{self, accounts::Increment},
    program::Counter,
};

declare_id!("Gs4H4zaqUtRC1iPJhcvYxcQwpq4sakkHoiJBiRpCRALM");

#[program]
pub mod compose_lab {
    use super::*;

    pub fn bump(ctx: Context<Bump>) -> Result<()> {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.counter_program.key(),
            Increment {
                tally: ctx.accounts.tally.to_account_info(),
            },
        );
        cpi::increment(cpi_ctx)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Bump<'info> {
    #[account(mut)]
    pub tally: Account<'info, Tally>,
    pub counter_program: Program<'info, Counter>,
}
```

## Test Output

```
  compose-lab
counter value set by the caller: 1
    ✔ the caller bumps the counter through a CPI (494ms)

  1 passing (504ms)
```

## What I Learned

- **`declare_program!`** pulls in the callee's full type system — accounts structs, CPI modules, and program type — straight from the IDL, giving you compile-time safety with zero raw instruction building.
- **`anchor new <name>`** scaffolds an additional program crate inside the same workspace cleanly.
- **The `idls/` folder** is the bridge: `anchor build` writes the counter IDL there, and `declare_program!` reads from it — so `anchor build && cp target/idl/counter.json idls/` must run before compose-lab can compile.
- Two independent programs compose **atomically** — if the CPI fails, the entire outer transaction rolls back with no partial state.
- The caller (`compose-lab`) never owns the `Tally` account; it just passes it through. Ownership stays with the `counter` program, enforced at the runtime level.

## Resources
- [Anchor docs: Cross-Program Invocations](https://www.anchor-lang.com/docs/basics/cpi)
- [Anchor docs: declare_program!](https://www.anchor-lang.com/docs/references/macros#declare_program)
- [Solana docs: CPI](https://solana.com/docs/intro/quick-start/cross-program-invocation)
