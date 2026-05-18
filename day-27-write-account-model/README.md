# Day 27 — Write About the Account Model

> **100 Days of Solana** | Arc Theme: Accounts & Programs (Week 4)
> **Also counts toward the $500 Epoch 1 Writing Challenge (May 15–22)**

## What I Did

Wrote and published a DEV.to article explaining Solana's account model to Web2 developers who have never worked with blockchain before.

## 📝 Published Article

**[Solana's Account Model Explained for Web2 Developers (No Blockchain Experience Needed)](https://dev.to/gopichand_dev/solanas-account-model-explained-for-web2-developers-no-blockchain-experience-needed-4acg)**

Tags: `solana` `blockchain` `web3` `beginners` `100daysofsolana`

---

## Article Summary

Covers the following concepts in plain language:

1. **The Filesystem Analogy** — accounts are files, programs are executables, System Program is the OS kernel
2. **Everything is an account** — wallets, programs, sysvars, tokens — all the same 5-field structure
3. **The five fields** — lamports, data, owner, executable, rent_epoch with real CLI output
4. **Programs don’t store their own state** — stateless programs + separate data accounts = parallelism
5. **Ownership rules** — only the owner can modify data or debit lamports, anyone can credit
6. **Rent exemption** — minimum balance proportional to data size, `solana rent` command

---

## Real CLI Output Used in Article

```bash
# Wallet account
solana account $(solana address)
# Public Key: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
# Balance:    6.137925 SOL
# Owner:      11111111111111111111111111111111
# Executable: false
# Rent Epoch: 18446744073709551615

# System Program
solana account 11111111111111111111111111111111
# Owner:      NativeLoader1111111111111111111111111111111
# Executable: true
# Data:       system_program

# Clock Sysvar
solana account SysvarC1ock11111111111111111111111111111111
# Owner:      Sysvar1111111111111111111111111111111111111
# Executable: false
# Length:     40 bytes
```

---

## Web2 → Solana Mental Model Table

| Web2 | Solana |
|------|--------|
| Web server | Program account (executable=true) |
| Database | Data account (executable=false) |
| Database row | Individual account’s `data` field |
| HTTP request | Transaction instruction |
| Request body | Instruction data + account list |

---

## Resources
- [Solana Accounts Documentation](https://solana.com/docs/core/accounts)
- [Solana Account Structure](https://solana.com/docs/core/accounts/account-structure)
- [QuickNode: Solana Account Model](https://www.quicknode.com/guides/solana-development/an-introduction-to-the-solana-account-model)
