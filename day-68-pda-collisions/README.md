# Day 68 — PDA Collision Explorer

> **Challenge:** Try to make two PDAs share an address

## What I Built

A TypeScript script that explores how PDA seeds control address derivation — comparing per-user vs global PDAs, testing near-miss seed variants, and watching Anchor reject a spoofed account.

## Output

```
=== Day 68 — PDA Collision Explorer ===

Program ID: DkbqKfL8weP6MzGSxJT2ZThJJYPoJifvv4CTYQtoRf9G
Wallet A:   AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
Wallet B:   AiPTLANZ8nSumkXEXtjgWFZy1fAv8fgpjDvUp9boaF3s

Config initialized: 6Pov3BDMHC2K8fQmXPVueLaXRziWvrXAAAYMw1i7jgpX
Wallet A counter initialized
Wallet B counter initialized

──────────────────────────────────────────────
1. Per-user counter PDAs
──────────────────────────────────────────────
  Wallet A PDA: 6khGZheFP1Yn61p7VJmwQtPd5gc5S2BHru8nugJFBHXy
  Wallet B PDA: EEwiF4AFLd5nEFgYJA6SN6bRQPEaH9kHj4a8GtkdkyJx
  Same address? false

──────────────────────────────────────────────
2. Global counter PDA (no wallet in seeds)
──────────────────────────────────────────────
  Derived from A perspective: 4f9BPE2BaRMG7SH339sw6dTigKqGJdeSKrtfaiZJXhmc
  Derived from B perspective: 4f9BPE2BaRMG7SH339sw6dTigKqGJdeSKrtfaiZJXhmc
  Same address? true

──────────────────────────────────────────────
3. Near-miss seed variants (all different)
──────────────────────────────────────────────
  ["counter",  walletA]            -> 6khGZheFP1Yn61p7VJmwQtPd5gc5S2BHru8nugJFBHXy
  ["counters", walletA]            -> A2EKGjtfrPaHWjfoBLaMVtMu7drnAnhUgRZAKh4PmRBa
  ["counter\0", walletA]           -> FfcErcB7U2FkY3YJNiC5UbejQZ7wH8uUEasK6DBxUkkd
  ["Counter",  walletA]            -> FuR4MUZVwDK5qrKA8dpxHH6PY5Xo4uhGSXQLbEeTLS64

──────────────────────────────────────────────
4. Spoof attempt: Wallet A passes Wallet B's PDA
──────────────────────────────────────────────
  Spoof rejected ✓: AnchorError caused by account: counter.
  Error Code: ConstraintSeeds. Error Number: 2006.
  Error Message: A seeds constraint was violated.

=== Day 68 Complete! ===
```

## Key Learnings

| Experiment | Result | Insight |
|---|---|---|
| Per-user PDAs `["counter", walletA/B]` | Different addresses ✅ | Including the wallet pubkey creates a unique row per user — like a compound DB key |
| Global PDA `["counter"]` only | Same address from both wallets ✅ | Omitting user from seeds means one shared address — first caller wins, everyone else fails |
| Near-miss variants (`counters`, `counter\0`, `Counter`) | All different ✅ | One byte difference → completely different address. No "close enough" in PDA space |
| Spoof: Wallet A passes Wallet B's PDA | `ConstraintSeeds` error ✅ | Anchor re-derives the expected address from the signer and verifies — it's a runtime guard, not just derivation |

## How the Spoof Rejection Works

Anchor's `seeds` constraint is **both a deriver and a verifier**. When `increment` received `pdaB` as the counter account but `walletA` as the signer, Anchor re-derived `[b"counter", walletA.key()]` and got `pdaA`. Since `pdaA ≠ pdaB`, it threw `ConstraintSeeds` (error 2006) before any business logic ran.

## Files

- `scripts/explore-collisions.ts` — Main Day 68 script
- `scripts/init-config.ts` — One-time config singleton initializer
- `programs/counter/src/lib.rs` — Anchor counter program (from Day 67)

## Program ID

`DkbqKfL8weP6MzGSxJT2ZThJJYPoJifvv4CTYQtoRf9G` (localnet)
