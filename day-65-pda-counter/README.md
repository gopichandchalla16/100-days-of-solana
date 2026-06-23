# Day 65 — Per-User Counter with PDA State

**Challenge:** Build a counter program where each wallet gets its own isolated state account, derived deterministically from the user's public key — no keypair tracking needed.

---

## What Was Built

An Anchor program with two instructions:

| Instruction | What it does |
|-------------|-------------|
| `init_counter` | Creates a PDA account seeded with `["counter", user.pubkey]`, sets `count = 0` |
| `increment` | Increments the caller's own counter by 1 using `checked_add` |

### Key Program Design

```rust
// seeds = [b"counter", user.key().as_ref()]
// Each wallet → its own unique PDA address
// No has_one needed — seed constraint IS the auth
```

- `seeds = [b"counter", user.key().as_ref()]` — address derived from who is calling
- `bump` stored in account for CPI and re-derivation
- `8 + Counter::INIT_SPACE` — discriminator (8) + auto-computed struct size
- `checked_add(1)` — overflow-safe increment

---

## Test Results

```
counter
  ✅ Alice PDA: <derived>  count = 2
  ✅ Bob   PDA: <derived>  count = 1

  🎯 Per-user PDA mapping proven — Alice and Bob counters are fully independent!

  1 passing
```

### What the test proved

| User | init_counter | increments | final count |
|------|-------------|------------|-------------|
| Alice (wallet) | ✅ | 2× | **2** |
| Bob (generated keypair) | ✅ | 1× | **1** |

Two different users, two different PDA addresses, zero keypair tracking.

---

## The Big Insight

The `seeds` constraint replaces all manual authorization logic:

- **No `has_one`** — because the PDA address itself is derived from `user.pubkey`
- **No explicit owner check** — wrong signer → different PDA → constraint fails before handler runs
- **Scales to unbounded users** — each wallet always maps to exactly one counter, deterministically

This is the on-chain equivalent of a Postgres row keyed by `user_id`. The key falls out of who is asking.

---

## Project Structure

```
day-65-pda-counter/
├── programs/counter/src/lib.rs   ← Anchor program
├── tests/counter.ts              ← Per-user independence test
└── README.md
```

---

## Resources

- [Anchor Docs: PDA](https://www.anchor-lang.com/docs/basics/pda)
- [Anchor Docs: Account Constraints](https://www.anchor-lang.com/docs/references/account-constraints)
- [Anchor Docs: InitSpace](https://www.anchor-lang.com/docs/space)
- [Solana Docs: PDAs](https://solana.com/docs/core/pda)
