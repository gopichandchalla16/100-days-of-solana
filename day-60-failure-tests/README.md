# Day 60 — Add Failure Tests So Green Checks Actually Mean Something

## What I Built
Added two **negative/sad-path tests** to the existing Anchor counter suite, proving the `has_one = authority` constraint and the `init` constraint both fire correctly when someone tries to break them.

## Key Concepts

### Why failure tests matter
A passing suite that only covers the happy path can’t catch a broken auth check. If someone removes `has_one = authority` from the struct, only a test that *expects rejection* will catch the regression. This is the Solana equivalent of a backend “403 test”.

### `has_one = authority`
Anchor compares `counter.authority` (stored on-chain) with the `authority` account passed in. If they don’t match, the transaction is **rejected before the handler runs** with `ConstraintHasOne`.

### `init` constraint
Anchor refuses to call `system_program::create_account` for an address that already holds lamports. Second init → `AccountAlreadyInitialized` error.

### `svm.expire_blockhash()`
Without this, two identical transactions share the same signature and LiteSVM rejects the second as a **duplicate** — giving you the wrong error. Expiring the blockhash makes the second tx genuinely new so the failure comes from the program constraint, not the duplicate check.

## Test Suite (3 tests, all must pass)

| Test | Scenario | Expected result |
|------|----------|-----------------|
| `initialize_then_increment` | Happy path | count == 1, authority matches ✅ |
| `increment_fails_when_wrong_authority_signs` | Wrong wallet calls increment | `is_err()` → ConstraintHasOne in logs ✅ |
| `initialize_fails_when_counter_already_exists` | Same account init’d twice | `is_err()` → AccountAlreadyInitialized in logs ✅ |

## How to Run
```bash
cd ~/100-days-of-solana/day-58-counter-state
anchor build
cargo test -p counter -- --nocapture
```

Expected output:
```
running 3 tests
test initialize_then_increment ... ok
test increment_fails_when_wrong_authority_signs ... ok
test initialize_fails_when_counter_already_exists ... ok
test result: ok. 3 passed; 0 failed
```

## Files Changed
- `day-58-counter-state/programs/counter/src/lib.rs` — added `increment` handler + `Increment` accounts struct + `has_one = authority`
- `day-58-counter-state/programs/counter/tests/counter.rs` — 3 tests + 3 helper functions

## Tomorrow (Day 61)
Deliberately **delete** `has_one = authority` from `lib.rs`, run tests, and watch `increment_fails_when_wrong_authority_signs` scream — proving the constraint was doing real work.
