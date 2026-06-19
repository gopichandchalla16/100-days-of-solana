# Day 61 — Break Your Program on Purpose and Watch the Tests Catch It

> **MLH 100 Days of Solana** · Gopichand Challa · June 19, 2026

---

## What this is

An **Experiment** day. No new instructions, no new accounts. Instead, three
bug are planted into the Day 60 counter program **one at a time**, the test
suite is run after each break, the failure is observed and understood, and
then the code is **restored** to green.

This is **mutation testing done by hand** — the practice of intentionally
introducing a known bug to verify that a specific test catches it. Every
assertion in the suite is now a proven load-bearing assertion.

---

## The three experiments

### Experiment 1 — Remove `has_one = authority` (missing access control)

**The bug:**
```rust
// Before (correct)
#[account(mut, has_one = authority)]
pub counter: Account<'info, Counter>,

// After planting the bug
#[account(mut)]
pub counter: Account<'info, Counter>,
```

**What happened:** The program now accepts ANY signer for increment. Anyone
can increment anyone else's counter with no error.

**Test that turned RED:**
```
test increment_fails_when_wrong_authority_signs ... FAILED

thread 'increment_fails_when_wrong_authority_signs' panicked at:
increment must fail when signed by the wrong authority
```

**Why:** `result.is_err()` was false — the wrong authority was happily
accepted because the constraint no longer existed to reject it.

**Restored:** `has_one = authority` added back. Suite: 3 passed.

---

### Experiment 2 — Change `checked_add(1)` to `checked_add(2)` (off-by-one)

**The bug:**
```rust
// Before (correct)
counter.count = counter.count.checked_add(1).ok_or(ProgramError::ArithmeticOverflow)?;

// After planting the bug
counter.count = counter.count.checked_add(2).ok_or(ProgramError::ArithmeticOverflow)?;
```

**What happened:** The transaction still succeeds. No error is thrown. But the
counter now holds `2` instead of `1` after one increment.

**Test that turned RED:**
```
test initialize_then_increment ... FAILED

thread 'initialize_then_increment' panicked:
left: 2
right: 1
```

**Why this bug is dangerous:** The tx succeeds. No logs mention the wrong
value. Without the `assert_eq!(parsed.count, 1)` assertion, this would
silently ship and go undetected until a user noticed their counter was wrong.

**Why `checked_add(2)` not `checked_sub`:** `checked_sub(1)` on a fresh
counter (count = 0) would underflow and abort the tx with `ArithmeticOverflow`
before any assertion runs. That would be the wrong error. `checked_add(2)` lets
the tx succeed but stores a wrong number — exactly the kind of silent bug only
an assertion can catch.

**Restored:** `checked_add(1)`. Suite: 3 passed.

---

### Experiment 3 — Comment out `counter.authority = ctx.accounts.authority.key()` (uninitialized field)

**The bug:**
```rust
// Before (correct)
counter.authority = ctx.accounts.authority.key();
counter.count = 0;

// After planting the bug
// counter.authority = ctx.accounts.authority.key();  ← commented out
counter.count = 0;
```

**What happened:** The `initialize` transaction still **succeeds**. The account
gets created, rent is paid, count is zero. But `authority` was never set, so it
remains `Pubkey::default()` — all zeros (the system program address).

The bug only surfaces when increment is called, because `has_one = authority`
compares the stored authority (all zeros) to the signer (real wallet) and finds
a mismatch:

```
Program log: AnchorError caused by account: counter.
Error Code: ConstraintHasOne. Error Number: 2001.
Error Message: A has one constraint was violated.
Left:  11111111111111111111111111111111   <- stored authority (zeros)
Right: <your real wallet pubkey>          <- actual signer
```

**Test that turned RED:**
```
test initialize_then_increment ... FAILED
(panics at svm.send_transaction(inc_tx).expect("increment should succeed"))
```

**Key lesson — the gap between cause and effect:**
The error is reported at `increment`, but the bug lives in `initialize`.
This is normal in account-model systems: state is written in one transaction
and validated in the next. When debugging real Solana programs, you often need
to work **backwards** from a constraint failure to the instruction that should
have set the field.

**The two failure tests stayed GREEN throughout this experiment** — they only
check that a bad call is rejected, and a zeros-vs-real-pubkey mismatch is still
a mismatch.

**Restored:** uncommented. Suite: 3 passed.

---

## Mutation testing summary

| # | Bug planted | Category | Test that caught it | Failure type |
|---|-------------|----------|--------------------|--------------|
| 1 | Remove `has_one = authority` | Missing access control | `increment_fails_when_wrong_authority_signs` | Wrong authority accepted (result was Ok) |
| 2 | `checked_add(2)` instead of `(1)` | Silent arithmetic bug | `initialize_then_increment` | `assert_eq!` failed: left=2 right=1 |
| 3 | Comment out `counter.authority = ...` | Uninitialized field | `initialize_then_increment` | ConstraintHasOne 2001 at increment step |

---

## What this proves

Every assertion in the three-test suite is **load-bearing**:

- `assert_eq!(parsed.count, 1)` — the only thing catching a silent arithmetic bug
- `assert_eq!(parsed.authority, authority.pubkey())` — the only thing catching an unset field
- `assert!(result.is_err())` in the wrong-authority test — the only thing catching a dropped `has_one`

Remove any one of them and a specific class of bug ships silently.

---

## How to reproduce each experiment

```bash
cd day-61-mutation-testing

# 0. Baseline (must be green)
cargo build-sbf --manifest-path programs/counter/Cargo.toml --sbf-out-dir target/deploy
cargo test -p counter

# --- Experiment 1 ---
# Edit programs/counter/src/lib.rs:
# Change: #[account(mut, has_one = authority)]
# To:     #[account(mut)]
cargo build-sbf --manifest-path programs/counter/Cargo.toml --sbf-out-dir target/deploy
cargo test -p counter
# Expected: increment_fails_when_wrong_authority_signs RED
# Revert the change, re-run, confirm green.

# --- Experiment 2 ---
# Edit programs/counter/src/lib.rs:
# Change: .checked_add(1)
# To:     .checked_add(2)
cargo build-sbf --manifest-path programs/counter/Cargo.toml --sbf-out-dir target/deploy
cargo test -p counter
# Expected: initialize_then_increment RED (left=2 right=1)
# Revert, re-run, confirm green.

# --- Experiment 3 ---
# Edit programs/counter/src/lib.rs:
# Comment out: counter.authority = ctx.accounts.authority.key();
cargo build-sbf --manifest-path programs/counter/Cargo.toml --sbf-out-dir target/deploy
cargo test -p counter
# Expected: initialize_then_increment RED (ConstraintHasOne 2001 at increment)
# Revert, re-run, confirm green.
```

---

## Final result (after all restores)

```
running 3 tests
test initialize_then_increment                    ... ok
test increment_fails_when_wrong_authority_signs   ... ok
test initialize_fails_when_counter_already_exists ... ok

test result: ok. 3 passed; 0 failed; 0 ignored; finished in 0.55s
```

---

## What’s next — Day 62

Publish the Anchor journey as a DEV.to article — explaining Anchor vs raw
Solana, what the IDL is, and how `has_one` auth guards work for a Web2 audience.

---

> *"An untested assertion is also a guess. Today we made every assertion a fact."*
> — MLH 100 Days of Solana, Day 61
