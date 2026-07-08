# Day 78 - Audit your own code like an attacker

## Arc theme
Advanced Testing and Security

## What this challenge is about
Audit your Anchor program like a production API. Find which accounts prove ownership, which prove authority, and which ones an attacker could slip past you.

## Questions to ask on every account
1. **Owner question**: If this account's data matters to my logic, does the program guarantee which program owns it?
2. **Signer question**: If this account authorizes the action, does the program require it to actually sign the transaction?

## Audit notes

### Clean checks you should expect in a well-typed Anchor program
- `Signer<'info>` satisfies the signer question.
- `Account<'info, T>` satisfies the owner question.
- `Program<'info, T>` verifies the expected executable program.
- `has_one = authority` is valid only when the authority account itself is a real signer.

### Flagged example from the challenge prompt
```rust
#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(mut, has_one = authority)]
    pub profile: Account<'info, Profile>,

    /// CHECK: compared to profile.authority via has_one
    pub authority: UncheckedAccount<'info>,
}
```

### Why this is a finding
- `authority` is an `UncheckedAccount`, so it fails the signer question.
- The program only compares a public key, which does not prove the caller signed the transaction.
- Consequence: an attacker could pass a matching public key without providing the private-key signature.

## Repo scan command
Run this from the repository root:
```bash
grep -rn "UncheckedAccount\|AccountInfo\|/// CHECK" programs/*/src
```

If the output is empty, your Anchor program is not using unchecked escape hatches.

## Submission checklist
- Add this folder to the repo.
- Include a screenshot showing the challenge notes and the grep output.
- Keep the folder naming consistent with earlier days.
