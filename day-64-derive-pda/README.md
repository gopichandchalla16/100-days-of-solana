# Day 64 — Derive Your First PDA from Seeds

## Challenge
Derive a Program Derived Address (PDA) from seeds using `PublicKey.findProgramAddressSync`,
run it 4 times with different seeds, and prove determinism holds.

## Program ID
`4yXwSNTTQNAArrvxfwTB3fE2WPiePZbADzDqHQSsPttz`
(same counter program from Day 57–63)

## How to Run

```bash
cd day-60-failure-tests   # or any Anchor project with @solana/web3.js installed
mkdir -p scripts
cp ../day-64-derive-pda/scripts/derive-pda.ts scripts/derive-pda.ts
npx ts-node --transpile-only scripts/derive-pda.ts
```

## What the 4 Runs Prove

| Run | Seeds | Expected Result |
|-----|-------|----------------|
| 1 | `["counter"]` | PDA-A, bump-A |
| 2 | `["counter", "alice"]` | Different PDA |
| 3 | `["counter", "bob"]` | Different PDA again |
| 4 | `["counter"]` | Identical to Run 1 ✅ |

## Key Insight

A PDA is a SHA-256 hash of `seeds + programId + bump` that lands **off the ed25519 curve**.
No private key produces it. The program that derived it is the only thing that can sign for it.
Determinism is the whole point — same inputs always produce the same address.

This is the foundation for per-user accounts, vaults, and any on-chain state
where the address should be derivable from known inputs rather than a random keypair.

## Resources
- [Official Solana PDA Docs](https://solana.com/docs/core/pda)
- [Anchor PDA Reference](https://www.anchor-lang.com/docs/basics/pda)
