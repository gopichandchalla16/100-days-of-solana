# Day 67 — Close a PDA Account and Reclaim Rent

## What I Built

Added a `close_counter` instruction to the Day 66 counter program. The instruction drains all lamports from the counter PDA back to its owner and zeroes the account, removing it from chain state entirely.

## Key Concept: `close = user`

Anchor's `close` constraint does three things atomically:
1. Transfers all lamports from the PDA to the target account (`user`)
2. Writes a sentinel discriminator over the account data so it cannot be replayed
3. After the transaction, the runtime removes the zero-lamport account from state

```rust
#[derive(Accounts)]
pub struct CloseCounter<'info> {
    #[account(
        mut,
        close = user,           // ← drains lamports → user, zeroes data
        seeds = [b"counter", user.key().as_ref()],
        bump = counter.bump,
        has_one = user,         // ← only the counter's owner can close it
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
}
```

## Test Results

```
  counter
  config initialized
    ✔ initializes config (2864ms)
  count: 1 | counterPda: 7SRYWc9Wj2e6JJ31S6FaH5YmJoH2Ffw62up6LUpmDVoi
    ✔ initializes a counter and increments (1748ms)
  rent refunded (lamports): 1231920
  net wallet change (lamports): 1226944
    ✔ closes the counter and refunds rent (395ms)

  3 passing (5s)
```

## Numbers

| Metric | Value |
|--------|-------|
| Rent refunded | 1,231,920 lamports (~0.00123 SOL) |
| Net wallet change | 1,226,944 lamports |
| Tx fee burned | ~4,976 lamports |
| Account after close | `null` (swept by runtime) |

## Security

The `has_one = user` constraint ensures only the wallet whose pubkey is stored on the counter can close it — no one else can drain your rent deposit.

## Run It

```bash
anchor build
anchor test --validator legacy
```
