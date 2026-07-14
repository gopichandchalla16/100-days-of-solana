# Day 78 — Audit Your Own Code Like an Attacker

## Challenge
Audit your Anchor program like a production API: find which accounts prove ownership, which prove authority, and which ones an attacker could slip past you.

**Arc theme:** Advanced Testing and Security  
**Web2 bridge:** Security auditing

## What I Audited
I audited the PDA-backed counter program from earlier days (e.g., day-65-pda-counter, day-66-config-pda, day-67-close-pda).

## Audit Questions
For every account in every instruction:
1. **Owner question**: If this account’s data matters, does the program guarantee which program owns it?
2. **Signer question**: If this account authorizes the action, does the program require it to actually sign the transaction?

## Findings

### Clean Bill of Health
Most accounts in the counter program use proper Anchor types:
- `Account<'info, Counter>`: Provides automatic owner checks (program-owned).
- `Signer<'info>`: Ensures the authority signs the transaction.
- `has_one` constraints for authorization.

No `UncheckedAccount` or `AccountInfo` without explicit checks found in core instructions.

### Example Flagged Account (from specimen)
In a hypothetical `UpdateProfile`:
```rust
#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(mut, has_one = authority)]
    pub profile: Account<'info, Profile>,
    /// CHECK: compared to profile.authority via has_one
    pub authority: UncheckedAccount<'info>,  // ← Fails signer question
}
```
**Finding**: `authority` is `UncheckedAccount`, fails signer question. Anyone can pass a different account; only `has_one` comparison (public key match) — does not prove private key approval.

### Terminal Check
```bash
grep -rn "UncheckedAccount\|AccountInfo\|/// CHECK" programs/*/src
```
Result: Clean (no matches in well-built counter).

## Key Learnings
- `Account<'info, T>` and `Signer<'info>` do the heavy lifting.
- Unchecked accounts require manual validation.
- Account-validation bugs are the #1 cause of Solana exploits.

## Submission
Audit complete - clean program with one specimen flagged.

## Resources
- Solana Program Security course
- Anchor Account Constraints

**Repo:** https://github.com/gopichandchalla16/100-days-of-solana