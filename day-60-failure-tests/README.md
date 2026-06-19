# Day 60 — Add Failure Tests So Green Checks Actually Mean Something

## What this is

A Reinforce day. No new program logic — just two new **failure (sad-path) tests** added to the Day 59 counter program to prove that the `has_one = authority` constraint and the `init` constraint are actually doing their jobs.

## Project structure

```
day-60-failure-tests/
├── Anchor.toml
├── Cargo.toml
├── rust-toolchain.toml
└── programs/
    └── counter/
        ├── Cargo.toml
        └── src/
            └── lib.rs          ← same counter program from Day 59
        └── tests/
            └── counter.rs      ← 3 tests: 1 happy-path + 2 failure tests
```

## The 3 tests

| Test | Type | What it proves |
|---|---|---|
| `initialize_then_increment` | Happy path | Counter initializes and increments correctly |
| `increment_fails_when_wrong_authority_signs` | Failure | `has_one = authority` blocks a different wallet |
| `initialize_fails_when_counter_already_exists` | Failure | `init` constraint blocks double-initialization |

## Key concepts

- **`has_one = authority`** — Anchor compares the `authority` field stored in the Counter account with the `authority` account passed in the instruction. If they don't match → `ConstraintHasOne` error (code 2001).
- **`svm.expire_blockhash()`** — Without this, the second initialize tx is byte-for-byte identical to the first (same blockhash = same signature), and LiteSVM rejects it as a duplicate before the program even runs. Expiring the blockhash forces a genuinely new transaction so the failure comes from the `init` constraint, not the duplicate-signature check.
- **Sad-path tests** — On Solana, the program is a public endpoint anyone can call with any signer. The sad path is half of production traffic.

## How to run

```bash
cd day-60-failure-tests
anchor keys sync
anchor build
cargo test -p counter -- --nocapture
```

Expected output:
```
test initialize_then_increment ... ok
test increment_fails_when_wrong_authority_signs ... ok
test initialize_fails_when_counter_already_exists ... ok

test result: ok. 3 passed; 0 failed
```
