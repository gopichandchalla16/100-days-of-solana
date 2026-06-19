# Day 60 — Add Failure Tests So Green Checks Actually Mean Something

> **MLH 100 Days of Solana** · Gopichand Challa · June 19, 2026

---

## What this is

A **Reinforce** day. No new program instructions, no new accounts, no new constraints.
The `has_one = authority` guard from Day 59 is already protecting `increment`.
Today's job: write two **sad-path (failure) tests** that prove the guard is real —
not just declared.

The analogy from the challenge: *a backend PR ships a permission check on an admin
endpoint. The reviewer asks — "show me the test where a non-admin gets a 403."
Without that test, the next refactor could silently drop the auth check and the
suite would still be all green.* Today's two tests are that 403-test, written
twice for two different constraints.

---

## Project structure

```
day-60-failure-tests/
├── Anchor.toml
├── Cargo.toml
├── rust-toolchain.toml
└── programs/
    └── counter/
        ├── Cargo.toml          ← litesvm + solana crates added here
        └── src/
            └── lib.rs          ← same counter program from Day 59 (unchanged)
        └── tests/
            └── counter.rs      ← 3 tests: 1 happy-path + 2 failure tests
```

---

## The 3 tests

| # | Test name | Type | Constraint exercised | Expected result |
|---|-----------|------|---------------------|-----------------|
| 1 | `initialize_then_increment` | ✅ Happy path | — | count == 1 |
| 2 | `increment_fails_when_wrong_authority_signs` | ❌ Failure | `has_one = authority` | `ConstraintHasOne` error 2001 |
| 3 | `initialize_fails_when_counter_already_exists` | ❌ Failure | `init` constraint | Account already in use error |

---

## Terminal output (all 3 passing)

```
running 3 tests

Err(FailedTransactionMetadata { err: InstructionError(0, Custom(0)), meta: TransactionMetadata {
  logs: ["... Allocate: account already in use",
         "Program ... failed: custom program error: 0x0"] } })

Err(FailedTransactionMetadata { err: InstructionError(0, Custom(2001)), meta: TransactionMetadata {
  logs: ["Program log: AnchorError caused by account: counter.",
         "Error Code: ConstraintHasOne. Error Number: 2001.",
         "Error Message: A has one constraint was violated.",
         "Program log: Left:  7NnbwmwWHDi88PJiWnpnacG2NNsYqzCAFC5v66Nh3xUE",
         "Program log: Right: AcwgW1qCySRGEMviteL5royzQK2pZhrU1tnEh5vnu8fw"] } })

test initialize_fails_when_counter_already_exists ... ok
test increment_fails_when_wrong_authority_signs    ... ok
test initialize_then_increment                    ... ok

test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; finished in 0.55s
```

---

## Key concepts learned

### `has_one = authority`
Anchor compares the `authority` field **stored inside the Counter account** with
the `authority` account **passed in the transaction**. If the two pubkeys don't
match, the runtime returns `ConstraintHasOne` (Anchor error code 2001) before
your instruction handler even runs.

### `init` constraint
Anchor's `#[account(init, ...)]` calls the system program's `Allocate`
instruction internally. If the account address already exists on-chain, the
system program rejects the allocation with *"account already in use"* —
anchor surfaces this as `Custom(0)` in the transaction error.

### `svm.expire_blockhash()`
Without this call between the two initialize transactions, both transactions
have the **same blockhash → same signature**. LiteSVM (like a real cluster)
rejects the second as a duplicate signature before the program runs. The test
would still see an error, but it would be the wrong error and the `init`
constraint would go untested. Expiring the blockhash forces a genuinely new
transaction so the failure comes from the account check.

### Why failure tests matter on Solana
A Solana program is a **public endpoint** — anyone on earth can construct a
transaction with any signer and submit it. The sad path is not a corner case;
it is half of production traffic. A test suite that only covers the happy path
leaves the auth gate unaudited.

---

## Three test helpers

```rust
fn setup_svm_with_program() -> (LiteSVM, Pubkey)
fn build_initialize_tx(svm, program_id, authority, counter_kp) -> Transaction
fn build_increment_tx(svm, program_id, authority, counter) -> Transaction
```

The helpers extract all transaction-construction boilerplate so each test only
describes *intent* — who the wrong wallet is, what call should be rejected, and
what assertion proves it.

---

## How to run

```bash
cd day-60-failure-tests

# Build the .so first (only needed once, or after changing lib.rs)
cargo build-sbf \
  --manifest-path programs/counter/Cargo.toml \
  --sbf-out-dir target/deploy

# Run all 3 tests
cargo test -p counter -- --nocapture
```

---

## What's next — Day 61

Delete `has_one = authority` on purpose. Watch these two failure tests scream.
That's mutation testing: deliberately weaken the constraint, confirm the suite
catches the regression, restore it. The constraint stops being "a line I trust"
and becomes "a line I can audit by running `cargo test`."

---

> *"has_one = authority stopped being a line of code you trusted and became a
> line of code you can audit by running cargo test."*
> — MLH 100 Days of Solana, Day 60
