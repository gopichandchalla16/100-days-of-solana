# Day 62 — Write the Post That Proves You Understand Your First Anchor Program

## Challenge
Publish a DEV.to article explaining the counter program built across Days 57–61: the accounts struct, handlers, test suite (happy + failure paths), and the mutation testing experiment from Day 61.

## Published Article

📖 **[How I Built a Counter Program in Anchor and Learned to Trust My Tests](https://dev.to/gopichand_dev/how-i-built-a-counter-program-in-anchor-and-learned-to-trust-my-tests-4afi)**

## What This Post Covers

### 1. The Accounts Struct — Where Anchor Earns Its Name
- `Initialize` struct: `counter` (init + space), `authority` (Signer + mut), `system_program`
- Why Anchor validates all accounts **before** the handler runs — the Web2 vs Web3 mental model shift

### 2. The Handlers — Short by Design
- `initialize`: sets `count = 0` and stores `authority.key()` on-chain
- `increment`: `checked_add(1)` with overflow guard
- `has_one = authority` constraint — a pre-condition, not a runtime check

### 3. The Tests — Two Paths That Matter
| Test | What it guards |
|------|----------------|
| `initialize_then_increment` | Arithmetic correctness; write-back; serialization |
| `increment_fails_when_wrong_authority_signs` | `has_one` constraint is present and enforced |

### 4. Day 61 Mutation Testing — Bug 2 Deep Dive
- Changed `checked_add(1)` → `checked_add(2)`
- Test output: `assertion left == right failed: left: 2, right: 1`
- Result: test caught it immediately → `git restore` → all green

### 5. What Writing This Revealed
- The `has_one` constraint took 3 drafts to explain precisely
- Key insight: constraint runs **before** the handler, not inside it
- This distinction — constraint vs. runtime check — is what a code review would expose

## Key Learnings

```
has_one = authority
  → compares counter.authority (stored at init)
    with authority.key() (passed at increment time)
  → runs BEFORE the handler
  → reverts with ConstraintHasOne (Error 2001) on mismatch
```

## Tags Used
`#100DaysOfSolana` `#solana` `#rust` `#anchor` `#testing`

## MLH Challenge
[Day 62 — Write the post that proves you understand your first Anchor program](https://www.mlh.com/events/100-days-of-solana/challenges/019ed046-5f60-0285-0ccc-f4417061a2a3)
