# Day 64 — Derive Your First PDA from Seeds

> **Arc theme:** PDAs and State  
> **Web2 bridge:** PDAs are like deterministic database keys derived from your program logic

## What I Built

A Node.js script that derives Program Derived Addresses (PDAs) using `@solana/web3.js` — proving that the same seeds always produce the same address, and different seeds always produce different addresses.

## The Script

**File:** [`scripts/derive-pda.js`](./scripts/derive-pda.js)  
**Run with:** `node scripts/derive-pda.js`

No TypeScript, no tsconfig conflicts — bypassed ts-node entirely by using plain `require()` in Node.js.

## Output — 4 Runs

```
=== Run 1: seeds = ["counter"] ===
Seeds:          ["counter"]
Program ID:     4yXwSNTTQNAArrvxfwTB3fE2WPiePZbADzDqHQSsPttz
PDA:            JRCDNd9Ztf35PhmB1JgZymTQYNFRhErhMaGUf8MGKnE
Canonical bump: 255

=== Run 2: seeds = ["counter", "alice"] ===
Seeds:          ["counter", "alice"]
Program ID:     4yXwSNTTQNAArrvxfwTB3fE2WPiePZbADzDqHQSsPttz
PDA:            2Xoz6sL9Zj9ESi4aunXZRRwxtUXnZYng4kJGqtd77jZo
Canonical bump: 253

=== Run 3: seeds = ["counter", "bob"] ===
Seeds:          ["counter", "bob"]
Program ID:     4yXwSNTTQNAArrvxfwTB3fE2WPiePZbADzDqHQSsPttz
PDA:            9Ag6JvFJGbUVSSPF2iUd7QdXEBhLZXggvZKu2guv3cdF
Canonical bump: 255

=== Run 4: seeds = ["counter"] (restored) ===
Seeds:          ["counter"]
Program ID:     4yXwSNTTQNAArrvxfwTB3fE2WPiePZbADzDqHQSsPttz
PDA:            JRCDNd9Ztf35PhmB1JgZymTQYNFRhErhMaGUf8MGKnE
Canonical bump: 255

Run 1 === Run 4 (determinism check): ✅ MATCH
```

## Key Takeaways

| Seeds | PDA | Bump |
|-------|-----|------|
| `["counter"]` | `JRCDNd9...MGKnE` | 255 |
| `["counter", "alice"]` | `2Xoz6sL...77jZo` | 253 |
| `["counter", "bob"]` | `9Ag6JvF...3cdF` | 255 |
| `["counter"]` restored | `JRCDNd9...MGKnE` ✅ | 255 |

- **Different seeds → different PDA.** Changing `"alice"` to `"bob"` produces a completely different address — this is how per-user accounts work on Solana.
- **Same seeds → same PDA always.** Run 1 and Run 4 match byte-for-byte: determinism proven.
- **No private key exists** for any of these addresses — they are off the ed25519 curve by design.
- **The canonical bump** is the first bump (starting from 255, counting down) that lands off-curve.

## Why This Matters

A PDA derived from `["counter", user_pubkey]` gives every user their own counter account — derived from inputs the program already knows, without the client needing to generate or pass a keypair. Tomorrow this address becomes the account your Anchor program initializes and owns.

## Resources

- [Solana PDA Docs](https://solana.com/docs/core/pda)
- [Anchor PDA Reference](https://www.anchor-lang.com/docs/basics/pda)
