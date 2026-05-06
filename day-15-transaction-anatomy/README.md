# Day 15 — Understand Transaction Anatomy

> **100 Days of Solana** | Arc Theme: Transactions and State Changes

## What I learned
Dissected a real Solana transaction down to its raw components.
Every state change on Solana flows through a transaction — a signed message
with a header, account keys, a recent blockhash, and compiled instructions.

---

## CLI Commands Run

### Step 1: Configure devnet + generate temp wallet
```bash
solana config set --url devnet
solana-keygen new --no-bip39-passphrase -o /tmp/temp-wallet.json
```

### ✅ Output — Temp Wallet Generated
```
pubkey: CUHUuC7JAJjRja2Ve4nN1wCdMgRY1sM5bAq8rn75F1uK
```

---

### Step 2: Send 0.001 SOL transfer
```bash
solana transfer --allow-unfunded-recipient $(solana address -k /tmp/temp-wallet.json) 0.001 --url devnet
```

### ✅ Output — Transaction Signature
```
Signature: 4k7Q8AsES8WDyhMMdbaFdURDEY5wrEn8r1wqZ9E6asGMA8jztCMRSeNSZVWoEjuboxAge5eit6my7exYDj1jN27V
```
> This signature IS the Transaction ID — the first 64-byte Ed25519 signature
> doubles as the unique identifier for the entire transaction.

---

### Step 3: Inspect with verbose CLI
```bash
solana confirm -v 4k7Q8AsES8WDyhMMdbaFdURDEY5wrEn8r1wqZ9E6asGMA8jztCMRSeNSZVWoEjuboxAge5eit6my7exYDj1jN27V
```

### ✅ Real Live Output
```
Transaction executed in slot 460450085:
  Block Time:       2026-05-06T08:54:16+00:00
  Version:          legacy
  Recent Blockhash: 6D2Qb1LCiqrPHmFRhhnewBsPcoQa2RPQGq7De2VbX6ux

  Signature 0: 4k7Q8AsES8WDyhMMdbaFdURDEY5wrEn8r1wqZ9E6asGMA8jztCMRSeNSZVWoEjuboxAge5eit6my7exYDj1jN27V

  Account 0: srw- AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y  (fee payer)
  Account 1: -rw- CUHUuC7JAJjRja2Ve4nN1wCdMgRY1sM5bAq8rn75F1uK  (destination)
  Account 2: -r-x 11111111111111111111111111111111               (System Program)

  Instruction 0:
    Program:   11111111111111111111111111111111 (index 2)
    Account 0: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y (index 0)
    Account 1: CUHUuC7JAJjRja2Ve4nN1wCdMgRY1sM5bAq8rn75F1uK (index 1)
    Transfer { lamports: 1000000 }

  Status: Ok
    Fee:                   ◎0.000005 SOL (5000 lamports)
    Account 0 balance:     ◎2.5 → ◎2.498995
    Account 1 balance:     ◎0   → ◎0.001
    Account 2 balance:     ◎0.000000001 (System Program unchanged)
  Compute Units Consumed: 150

  Log Messages:
    Program 11111111111111111111111111111111 invoke [1]
    Program 11111111111111111111111111111111 success

Finalized
```

---

## 🔍 Anatomy Breakdown (from real output)

```
Transaction
├── Signatures
│    └── [0] 4k7Q8AsES8WDyhMMdbaFdURDEY5wr...  ← 64-byte Ed25519 = TX ID
└── Message
     ├── Header
     │    ├── srw-  = signer + read + write  (Account 0: fee payer)
     │    ├── -rw-  = writable, not signer   (Account 1: destination)
     │    └── -r-x  = read-only + executable  (Account 2: System Program)
     ├── Account Keys
     │    ├── [0] AWKYsCGB... (your wallet, fee payer)
     │    ├── [1] CUHUuC7J... (temp wallet, destination)
     │    └── [2] 11111111... (System Program)
     ├── Recent Blockhash: 6D2Qb1LCiqrPHmFRhhnewBsPcoQa2RPQGq7De2VbX6ux
     └── Instructions
          └── [0] program_id_index=2, accounts=[0,1]
               data: Transfer { lamports: 1000000 }  (= 0.001 SOL)
```

---

## 📊 Transaction vs HTTP Request

| HTTP Request | Solana Transaction | Real value from this tx |
|---|---|---|
| HTTP Headers | Message Header | `srw-`, `-rw-`, `-r-x` permission flags |
| URL / Query Params | Account Keys | `[AWKYs..., CUHUu..., 11111...]` |
| Request Body | Instructions | `Transfer { lamports: 1000000 }` |
| Auth Token / JWT | Signatures | `4k7Q8AsES8WD...` (64 bytes) |
| CSRF Token | Recent Blockhash | `6D2Qb1LCiqr...` (expires ~150 slots) |
| Single server | All validators | Finalized across devnet |
| Partial success | Atomic execution | All or nothing |
| No fee on failure | Fee on failure | 5000 lamports charged regardless |

---

## Key Facts

- **Max transaction size:** 1,232 bytes (IPv6 MTU 1,280 − 48 bytes network headers)
- **Blockhash expiry:** ~150 slots (~60–90 seconds) — prevents replay attacks
- **Signature = TX ID:** `4k7Q8AsES8WDyhMMdbaFdURDEY5wrEn8r1...`
- **Compute units used:** 150 (very cheap — max is 1.4M per tx)
- **Fee:** 5000 lamports (◎0.000005 SOL)
- **Atomic:** If any instruction fails, ALL changes roll back
- **Account flags:** `s`=signer, `r`=readable, `w`=writable, `x`=executable

---

## Solana Explorer
[View this transaction on Solana Explorer (devnet)](https://explorer.solana.com/tx/4k7Q8AsES8WDyhMMdbaFdURDEY5wrEn8r1wqZ9E6asGMA8jztCMRSeNSZVWoEjuboxAge5eit6my7exYDj1jN27V?cluster=devnet)

---

## Resources
- [Solana Docs: Transactions](https://solana.com/docs/core/transactions)
- [Solana Docs: Transaction Structure](https://solana.com/docs/core/transactions/transaction-structure)
- [Solana Guide: Address Lookup Tables](https://solana.com/developers/guides/advanced/lookup-tables)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
