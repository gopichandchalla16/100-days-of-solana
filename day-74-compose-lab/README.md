# Day 74 — compose-lab: CPI Between Two Anchor Programs

> **Challenge:** Call one Anchor program from another using `declare_program!` — your first program-to-program CPI.

## What I Built

A two-program workspace (`compose-lab`) where a **caller** program (`compose-lab`) invokes an instruction on a separate **counter** program via a cross-program invocation. No direct mutation — pure delegation through the CPI layer.

## Programs

### `counter` (the callee)
- `initialize` — creates a `Tally` account and sets `count = 0`
- `increment` — adds 1 to `tally.count` and logs the new value

### `compose-lab` (the caller)
- `bump` — calls `counter::increment` via `CpiContext::new` + `declare_program!(counter)`

## Key Concepts

| Concept | What it does |
|---|---|
| `declare_program!(counter)` | Imports the counter IDL so compose-lab can type-safely call it |
| `CpiContext::new(program_key, accounts)` | Bundles the target program + accounts for the CPI |
| `cpi::increment(cpi_ctx)` | Fires the cross-program invocation into the runtime |
| `Account<'info, Tally>` | compose-lab borrows the Tally account and passes it to counter |

## Test Output

```
  compose-lab
counter value set by the caller: 1
    ✔ the caller bumps the counter through a CPI (494ms)

  1 passing (504ms)
```

## Project Structure

```
compose-lab/
├── programs/
│   ├── counter/src/lib.rs        ← the callee (initialize + increment)
│   └── compose-lab/src/lib.rs   ← the caller (bump → CPI → increment)
├── tests/
│   └── compose-lab.ts           ← init counter → bump via caller → assert count == 1
└── Anchor.toml
```

## How It Works

1. TypeScript test calls `counter.initialize()` — creates the `Tally` account on-chain
2. Test then calls `caller.bump()` — compose-lab's instruction runs
3. Inside `bump`, a `CpiContext` is built pointing at the `Counter` program with the `Tally` account
4. `cpi::increment()` fires the CPI — the runtime invokes counter's `increment` handler
5. `Tally.count` is now `1`, verified by the test assertion

## Resources
- [Anchor docs: Cross-Program Invocations](https://www.anchor-lang.com/docs/basics/cpi)
- [Anchor docs: declare_program!](https://www.anchor-lang.com/docs/references/declare-program)
