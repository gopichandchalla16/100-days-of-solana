# Day 57 — First Anchor Program: Counter Smart Contract ⚓

> **100 Days of Solana** by Gopichand Challa

## What I Built

My **first Anchor smart contract** — a fully on-chain counter with `initialize`, `increment`, `decrement`, and `reset` instructions, all written in Rust using the Anchor framework.

## Key Concepts Learned

- **Anchor framework** — declarative macros (`#[program]`, `#[derive(Accounts)]`, `#[account]`) that eliminate boilerplate
- **Account validation** — Anchor's `init`, `payer`, `space`, and `has_one` constraints vs hand-rolled Solana checks
- **IDL (Interface Definition Language)** — auto-generated JSON that TypeScript clients use to call the program
- **PDA-ready structure** — `CounterAccount` stores `authority: Pubkey` for signer-gated mutations
- **Checked arithmetic** — `checked_add` / `checked_sub` to prevent u64 overflow

## Program Layout

```
day-57-anchor-counter/
├── Anchor.toml                  ← cluster config (Devnet)
├── Cargo.toml                   ← workspace manifest
├── package.json                 ← JS/TS dependencies
├── tsconfig.json
├── programs/
│   └── counter/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs           ← smart contract
└── tests/
    └── counter.ts               ← 5 Mocha/Chai tests
```

## Instructions

| Instruction | Accounts | What it does |
|---|---|---|
| `initialize` | `counter` (init), `user` (payer), `system_program` | Creates counter account, sets count = 0 |
| `increment` | `counter` (mut), `authority` (signer) | count += 1 |
| `decrement` | `counter` (mut), `authority` (signer) | count -= 1 (floor 0) |
| `reset` | `counter` (mut), `authority` (signer) | count = 0 |

## Account Structure

```rust
#[account]
pub struct CounterAccount {
    pub count: u64,       // 8 bytes
    pub authority: Pubkey // 32 bytes
}                         // total: 40 + 8 (discriminator) = 48 bytes
```

## How to Run Locally

```bash
# 1. Install Anchor version manager (if not already done)
cargo install --git https://github.com/solana-foundation/anchor avm --force
avm install latest
avm use latest

# 2. Clone and enter the directory
git clone https://github.com/gopichandchalla16/100-days-of-solana
cd 100-days-of-solana/day-57-anchor-counter

# 3. Install JS dependencies
yarn install

# 4. Build the program
anchor build

# 5. Run tests (requires local validator OR devnet wallet)
anchor test
```

## Why Anchor?

Without Anchor, every Solana program requires manually:
- Deserializing account data with Borsh
- Verifying signer keys by hand
- Calculating rent-exempt lamports
- Writing boilerplate entrypoint code

Anchor does all of this via macros — you just describe **what** the accounts should look like, and the framework enforces it at runtime.

## Tools Used

| Tool | Version |
|------|---------|
| Solana CLI | 3.1.13 |
| Rust | 1.95.0 |
| Anchor (avm) | 1.0.2 → latest |
| Node.js | v24.10.0 |

---

> *"Anchor is to Solana what Hardhat is to Ethereum — but with Rust superpowers."*
> — Day 57 reflection
