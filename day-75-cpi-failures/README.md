# Day 75 — Read a CPI Failure Like a Sentence

> **Challenge:** Break three working CPIs on purpose, then learn to read the logs well enough that the next failure gives you a direction instead of a dead end.

---

## What I Did

Started with the green baseline from Day 74's `compose-lab` (caller → counter CPI) and the Day 73 `vault` (PDA-signed withdraw). Then deliberately broke each in a specific way, captured the logs, and mapped each error to a root cause.

---

## The Three Failures

### ❌ Failure 1 — Wrong Signer Seeds

**Program:** Day 73 vault (PDA-signed withdraw via `CpiContext::new_with_signer`)

**The Break:** Changed one byte in the signer seed — replaced `b"vault"` with `b"vaultX"` in the `signer_seeds` slice passed to `CpiContext::new_with_signer`.

**The Log:**
```
Program log: AnchorError caused by account: vault.
Error Code: ConstraintSeeds
Error Number: 2006
Error Message: A seeds constraint was violated.
```

Further up the stack:
```
Program 11111111111111111111111111111111 invoke [2]
Program 11111111111111111111111111111111 failed: privilege escalation
```

**The Mapping:**
> When I see `privilege escalation` from the System Program inside a CPI, the cause is that the PDA the runtime derived from my seeds does not match the PDA the callee was expecting to sign for — a seed byte is wrong or the bump is off.

---

### ❌ Failure 2 — Missing / Wrong Account Constraint

**Program:** Day 74 compose-lab (caller → counter CPI)

**The Break:** Added a `has_one = authority` constraint to the callee's `Increment` accounts struct, but the caller's `Bump` accounts struct does not pass an `authority` account.

**The Log:**
```
Program log: AnchorError caused by account: tally.
Error Code: ConstraintHasOne
Error Number: 2001
Error Message: A has one constraint was violated.
Account: tally
```

**The Mapping:**
> When I see `ConstraintHasOne` with an account name, the cause is that the callee's accounts struct has a constraint (`has_one`, `constraint =`, or `seeds`) that the account provided by the caller does not satisfy — Anchor names the exact failing account.

---

### ❌ Failure 3 — Wrong Program ID

**Program:** Day 74 compose-lab

**The Break:** Added `pub system_program: Program<'info, System>` to the `Bump` accounts struct, then swapped `ctx.accounts.counter_program.key()` for `ctx.accounts.system_program.key()` in `CpiContext::new` — so the call goes to `11111111111111111111111111111111` instead of the counter program.

**The Log:**
```
Program 11111111111111111111111111111111 invoke [2]
Program log: Error: unknown instruction
Program 11111111111111111111111111111111 failed: invalid instruction data
```

**The Mapping:**
> When I see `invalid instruction data` or `unknown instruction` from a program I did not intend to call, the cause is that `CpiContext::new` is pointing at the wrong program ID — the instruction bytes landed at a real program that has no idea what to do with them.

---

## The Three-Category Mental Model

| Failure | Runtime Voice | Root Cause |
|---------|--------------|------------|
| Wrong signer seeds | `privilege escalation` (System Program) | Seeds/bump drift — derived PDA ≠ expected PDA |
| Missing/wrong constraint | `ConstraintXxx` (Anchor) | Caller didn't satisfy callee's account constraints |
| Wrong program ID | `invalid instruction data` (foreign program) | `CpiContext` points at the wrong program |

---

## Key Insight

None of these failures came from logic bugs inside the business code. They all came from the **boundary between two programs** — the accounts the caller passes and the constraints the callee enforces.

The reflex to develop: treat every CPI as a tiny contract with two clauses:
1. The accounts the **caller** passes
2. The constraints the **callee** enforces

When a CPI breaks, one of those two sides moved.

---

## Resources

- [Solana CPI docs](https://solana.com/docs/core/cpi) — signer privilege section
- [Anchor error reference](https://www.anchor-lang.com/docs/errors) — all ConstraintXxx codes
- [LiteSVM](https://github.com/LiteSVM/litesvm) — inspect logs inside the test process

---

*Part of [100 Days of Solana](https://github.com/gopichandchalla16/100-days-of-solana) — Day 75/100*
