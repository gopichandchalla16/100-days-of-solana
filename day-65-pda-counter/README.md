# Day 65 — Per-User PDA Counter

> **100 Days of Solana** · Week 10 · PDA State

## What I Built

An Anchor program that creates a **separate on-chain counter for every user** using a PDA derived from `["counter", user.pubkey]`. Each user's counter is fully independent — Alice incrementing doesn't affect Bob.

## Key Concept

A **Program Derived Address (PDA)** is a deterministic account address generated from seeds + program ID. No private key exists — only the program can sign for it. This makes PDAs the standard pattern for per-user or per-resource on-chain state.

```
PDA = findProgramAddress(["counter", user.pubkey], programId)
```

## Program: `src/lib.rs`

```rust
#[derive(Accounts)]
pub struct InitCounter<'info> {
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
```

## Test Results

```
  counter
  ✔ Alice PDA: E8wpeaMX8Tis4pyKowXQTowytVVGEBRRvv2nknXW4GKZ | count: 2
  ✔ Bob   PDA: 5GGpVzMbQt6RevoWGDHLJsCr76DSohFA7gSfZkNJ13Va | count: 1
    ✔ creates a counter per user and increments independently (1264ms)

  1 passing (1s)
```

- Alice called `increment` twice → count = **2**
- Bob called `increment` once → count = **1**
- PDAs are **completely isolated** — different addresses, different state

## ESM / ts-node Fix

The tests were failing with `ReferenceError: require is not defined in ES module scope`. Root cause: `ts-node` was detecting ESM from the `tsconfig.json` `module` field at runtime.

**Fix**: Added a `ts-node` override block directly in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  },
  "ts-node": {
    "transpileOnly": true,
    "compilerOptions": {
      "module": "commonjs"
    }
  }
}
```

This forces `ts-node` to use CJS at runtime regardless of the outer `module` setting.

## Program ID

`DodFVa4BFYGnMB49Z274dBDWiBAz7wTpaaWnWeeU7KJq`

## Key Takeaways

- PDAs give every user their own on-chain state — no shared mutable global
- `seeds + bump` pattern is the backbone of all Anchor account derivation
- `ts-node` ESM conflicts are solved by the `"ts-node"` block in `tsconfig.json`, not by changing `package.json`
- Always pass `signers([bob])` when a non-wallet keypair pays or owns an instruction
