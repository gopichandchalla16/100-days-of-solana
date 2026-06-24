# Day 66 — Config PDA + Constraints

> **100 Days of Solana** · Week 10 · Multi-PDA Programs

## What I Built

Extended the Day 65 per-user counter with a **singleton Config PDA** that acts as the program's control plane. The Config account holds an admin, a pause flag, and a counter of total users. Two new constraints wire the two PDAs together so the program enforces rules at the account-validation layer — before any handler code runs.

## Program Architecture

```
Program
├── Config PDA  (seeds = ["config"])          ← singleton, one per program
│     ├── admin: Pubkey
│     ├── paused: bool
│     ├── total_counters: u64
│     └── bump: u8
└── Counter PDA (seeds = ["counter", user])    ← one per wallet
      ├── user: Pubkey
      ├── count: u64
      └── bump: u8
```

## Instructions

| Instruction | Who can call | What it does |
|---|---|---|
| `init_config` | Anyone (once) | Creates singleton Config, caller becomes admin |
| `set_paused` | Admin only (`has_one = admin`) | Flips the global pause switch |
| `init_counter` | Any wallet | Creates per-user Counter, bumps `total_counters` |
| `increment` | Counter owner only (`has_one = user`) | +1, blocked when `config.paused` |

## Key Constraints

```rust
// In Increment struct:
// Global rule — reads config.paused, rejects before handler runs
constraint = !config.paused @ CounterError::Paused,

// Per-row rule — counter.user must equal the signer
has_one = user,

// Admin guard on set_paused — config.admin must equal the signer
has_one = admin,
```

## ✅ Test Results

```
yarn run v1.22.22
$ ts-mocha -p ./tsconfig.json -t 1000000 'tests/**/*.ts'

  counter with config
  count: 1 | counterPda: 6ujZdNRyztUDeEUmigDM2tDkoSX3mpUsMcy73t5nrDDk
    ✔ initializes config and a counter, then increments (1928ms)
  Increment correctly blocked while paused ✓
    ✔ refuses to increment when paused (860ms)

  2 passing (3s)

Done in 6.93s.
```

## The Three Constraint Jobs

| Constraint | Job | Example |
|---|---|---|
| `seeds + bump` | Proves the account is the canonical PDA, not a lookalike | `seeds = [b"config"], bump = config.bump` |
| `has_one` | Foreign-key check between two accounts | `has_one = user` binds Counter to its wallet |
| `constraint` | Arbitrary boolean against loaded state | `!config.paused` for global pause guard |

## Key Takeaways

- Singleton PDAs seeded with a fixed string (`"config"`) are the standard pattern for program-level admin state
- All three constraint types (`seeds`, `has_one`, `constraint`) run **before** handler code — failures are cheap
- `has_one = admin` on `SetPaused` means a non-admin call fails at deserialization, not inside the function
- Storing `bump` on the account itself (not recomputing it) is the canonical Anchor pattern for efficiency
- The Config's `total_counters` field demonstrates cross-PDA state mutation in a single instruction

## How to Run

```bash
cd day-66-config-pda
anchor build
anchor test --validator legacy
```

## Program ID

`DodFVa4BFYGnMB49Z274dBDWiBAz7wTpaaWnWeeU7KJq`
