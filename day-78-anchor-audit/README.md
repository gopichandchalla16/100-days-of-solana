# Day 78 — Audit Your Own Code Like an Attacker

**Arc theme:** Advanced Testing and Security
**Program audited:** [`day-67-close-pda/programs/counter/src/lib.rs`](../day-67-close-pda/programs/counter/src/lib.rs) — the PDA-backed counter with `set_paused` and `close_counter`, gated behind an authority account.

## The two questions

1. **Owner question** — if this account's data matters to my logic, does the program guarantee which program owns it?
2. **Signer question** — if this account authorizes the action, does the program require it to actually sign the transaction?

## Inventory + classification

| Instruction | Account | Type | Owner check? | Signer check? |
|---|---|---|---|---|
| `InitConfig` | `config` | `Account<'info, Config>` | ✅ | — |
| `InitConfig` | `admin` | `Signer<'info>` | — | ✅ |
| `InitConfig` | `system_program` | `Program<'info, System>` | ✅ | — |
| `SetPaused` | `config` | `Account<'info, Config>`, `has_one = admin` | ✅ | ✅ (has_one + Signer) |
| `SetPaused` | `admin` | `Signer<'info>` | — | ✅ |
| `InitCounter` | `counter` | `Account<'info, Counter>` (init, PDA seeds) | ✅ | — |
| `InitCounter` | `config` | `Account<'info, Config>` (seeds-checked) | ✅ | — |
| `InitCounter` | `user` | `Signer<'info>` | — | ✅ |
| `InitCounter` | `system_program` | `Program<'info, System>` | ✅ | — |
| `Increment` | `counter` | `Account<'info, Counter>`, `has_one = user` | ✅ | ✅ (has_one + Signer) |
| `Increment` | `config` | `Account<'info, Config>` (seeds-checked) | ✅ | — |
| `Increment` | `user` | `Signer<'info>` | — | ✅ |
| `CloseCounter` | `counter` | `Account<'info, Counter>`, `close = user`, `has_one = user` | ✅ | ✅ (has_one + Signer) |
| `CloseCounter` | `user` | `Signer<'info>` | — | ✅ |

## Terminal confirmation                                                                                                      
$ rg -n "UncheckedAccount|AccountInfo|/// CHECK" day-67-close-pda/programs/counter/src
(no output - clean sweep)

See `screenshots/audit_scan.txt` — empty file confirms no escape hatches anywhere in the program.

## Findings

**Clean bill of health — 0 findings** on my own code:

- `config` is never trusted blind — re-derived from `seeds = [b"config"]` with `bump = config.bump` in every instruction that reads it, so an attacker can't substitute a look-alike account at a different address.
- `admin` (in `SetPaused`) passes the signer question twice over: typed `Signer<'info>` (must actually sign) **and** `config` enforces `has_one = admin` (must match the pubkey stored on-chain). Neither check alone is sufficient — `has_one` alone only proves a matching pubkey was *named*, not that its key holder approved the tx; `Signer` alone would let any signer act, not just the real admin.
- `user` in `Increment` and `CloseCounter` gets identical treatment via `has_one = user` + `Signer<'info>`.
- `CloseCounter`'s `close = user` sends reclaimed rent back to the same signer-verified `user`, so there's no dangling account for a later re-init attack.

**One flagged specimen (from the challenge's own example, not my code):**

```rust
#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(mut, has_one = authority)]
    pub profile: Account<'info, Profile>,

    /// CHECK: compared to profile.authority via has_one
    pub authority: UncheckedAccount<'info>,
}
```

- **Account:** `authority`
- **Type:** `UncheckedAccount<'info>`
- **Fails:** the signer question
- **Consequence:** `has_one = authority` only proves the caller *named* the correct pubkey — it never proves the tx was signed by that key's holder. Since `authority` isn't `Signer<'info>`, anyone who merely knows the real authority's public key (public keys are public) can pass it in as a non-signing account and edit any profile.
- **Fix (not applied — today is reconnaissance only):** change to `pub authority: Signer<'info>`.

## What this confirmed

Every privileged action in my counter (`set_paused`, `close_counter`) is gated behind an account that's simultaneously owner-checked (`Account<'info, T>`) and signer-checked (`Signer<'info>` cross-referenced via `has_one`). No `UncheckedAccount`/`AccountInfo` escape hatches anywhere.

## Resources referenced

- Solana Program Security course: Signer Authorization
- Solana Program Security course: Owner Checks
- Anchor Account Constraints reference
- *A Hitchhiker's Guide to Solana Program Security*
