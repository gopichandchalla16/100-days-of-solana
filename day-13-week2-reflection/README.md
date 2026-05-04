# Day 13 — Write About Your Second Week

> **100 Days of Solana** | Arc Theme: Reading the Blockchain

## What I did
Wrote a DEV.to blog post reflecting on Week 2 of the 100 Days of Solana challenge.
Covered the key mental model shifts, real CLI outputs, and what's still confusing.

## 📝 Published Post

**[Week 2 on Solana: When the "Public Database" Finally Clicked](https://dev.to/gopichand_dev/week-2-on-solana-when-the-public-database-finally-clicked-273a)**

---

## What the post covers

- **What I expected vs what I got** — No API key, no login, just `getBalance`. Anyone can read any account.
- **The moment it clicked** — `solana account` on my wallet vs the Token Program: same command, completely different accounts, same model.
- **Devnet vs mainnet surprise** — Same address, same RPC calls, completely different balances and transaction histories.
- **What's still confusing** — PDAs. I understand them conceptually but haven't used one yet.
- **What I'd tell Week-1-me** — Stop thinking in tables and rows. Think in accounts and owners.

---

## Key outputs referenced in the post

### Wallet account (devnet)
```
Public Key: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
Balance: 2.5 SOL
Owner: 11111111111111111111111111111111
Executable: false
```

### Token Program account
```
Owner: BPFLoaderUpgradeab1e11111111111111111111111
Executable: true
Length: 36 bytes
```

### Devnet vs Mainnet comparison
```
DEVNET  → 0.001159846 SOL  |  Slot: 459,981,397
MAINNET → 0.069875097 SOL  |  Slot: 417,486,413
```

---

## Tags used
`#100DaysOfSolana` `#solana` `#web3` `#blockchain`
