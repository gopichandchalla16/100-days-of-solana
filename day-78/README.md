# Day 78 - Audit your own code like an attacker

## Challenge notes

This folder contains the Day 78 audit notes for the 100 Days of Solana challenge.

### Questions used during the audit

1. **Owner question**: If this account's data matters to my logic, does the program guarantee which program owns it?
2. **Signer question**: If this account authorizes the action, does the program require it to actually sign the transaction?

### Findings

- `UpdateProfile.authority` is an `UncheckedAccount`, so it fails the signer question.
- The account is only compared by public key, which does not prove the caller signed the transaction.
- Consequence: an attacker could pass a matching public key without providing the authority's signature.

### Clean bill of health for well-typed accounts

- `Signer<'info>` satisfies the signer question.
- `Account<'info, T>` satisfies the owner question.
- `Program<'info, T>` verifies the expected executable program.

### Verification command

```bash
grep -rn "UncheckedAccount\|AccountInfo\|/// CHECK" programs/*/src
```

If this returns nothing, your program does not use unchecked escape hatches.
