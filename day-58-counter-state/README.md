# Day 58 — Add State to Your Program & Write Your First LiteSVM Test

## What This Does

Upgrades the counter program from stateless → stateful:
- Creates an on-chain `Counter` account with `authority` (Pubkey) and `count` (u64)
- Uses Anchor's `#[account]`, `#[derive(InitSpace)]`, and `init` constraint
- Tests the `initialize` instruction with **LiteSVM** (in-process SVM, no devnet needed)

## Project Structure

```
day-58-counter-state/
├── Anchor.toml
├── Cargo.toml
├── rust-toolchain.toml
└── programs/counter/
    ├── Cargo.toml
    ├── src/lib.rs          ← stateful counter program
    └── tests/counter.rs    ← LiteSVM integration test
```

## Run

```bash
# 1. Build the program (produces target/deploy/counter.so)
anchor build

# 2. Run the LiteSVM test
cargo test -p counter --test counter -- --nocapture
```

## Expected Output

```
running 1 test
test initialize_sets_count_to_zero ... ok

test result: ok. 1 passed; 0 failed
```

## Tools
- anchor-cli 1.0.2
- anchor-lang 1.0.2
- litesvm 0.10.0
- Rust stable
