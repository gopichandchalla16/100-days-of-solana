# Day 15 — Understand Transaction Anatomy

> **100 Days of Solana** | Arc Theme: Transactions and State Changes

## What I learned
Dissected a real Solana transaction to understand its raw components.
Every state change on Solana flows through a transaction — a signed message
with a header, account keys, a recent blockhash, and compiled instructions.

---

## CLI Commands Run

### Step 1: Set up devnet + generate temp wallet
```bash
solana config set --url devnet
solana-keygen new --no-bip39-passphrase -o /tmp/temp-wallet.json
```

### Step 2: Send a transfer (your first SOL send!)
```bash
solana transfer --allow-unfunded-recipient $(solana address -k /tmp/temp-wallet.json) 0.001 --url devnet
```

### Output — Transaction Signature
```
Signature: <YOUR_TX_SIGNATURE_HERE>
```
> The signature IS the transaction ID — it's the first Ed25519 signature
> and doubles as the unique identifier for this transaction.

### Step 3: Inspect transaction with verbose CLI
```bash
solana confirm -v <YOUR_TX_SIGNATURE_HERE>
```

### ✅ Live Output — Transaction Details
```
Transaction executed in slot <SLOT>:
  Block Time: <TIMESTAMP>
  Recent Blockhash: <BLOCKHASH>
  Fee: 5000 lamports
  Account 0: <YOUR_WALLET>  (signer, writable, fee payer)
  Account 1: <TEMP_WALLET> (writable)
  Account 2: 11111111111111111111111111111111 (System Program)

  Instruction 0:
    Program: System Program (11111111111111111111111111111111)
    Transfer: 0.001 SOL
    From: <YOUR_WALLET>
    To:   <TEMP_WALLET>

Status: Ok
```

---

## Transaction Structure Map

```
Transaction
├── Signatures []
│    └── [0] 64-byte Ed25519 signature (also the Transaction ID!)
└── Message
     ├── Header
     │    ├── num_required_signatures: 1
     │    ├── num_readonly_signed_accounts: 0
     │    └── num_readonly_unsigned_accounts: 1
     ├── Account Keys []
     │    ├── [0] Your wallet    (signer + writable, fee payer)
     │    ├── [1] Temp wallet   (writable)
     │    └── [2] System Program (read-only, the program)
     ├── Recent Blockhash: <32-byte hash>
     └── Instructions []
          └── [0] Compiled Instruction
               ├── program_id_index: 2  (points to System Program)
               ├── accounts: [0, 1]    (indexes into Account Keys)
               └── data: [2,0,0,0, ...] (Transfer command + lamports)
```

---

## 📊 Transaction vs HTTP Request

| HTTP Request | Solana Transaction |
|---|---|
| HTTP Headers | Message Header (permission groups) |
| URL / Query Params | Account Keys (resources involved) |
| Request Body | Instructions (operations to perform) |
| Auth Token / JWT | Signatures (Ed25519 proof of authorization) |
| CSRF Token | Recent Blockhash (replay protection + freshness) |
| Single server processes | All validators validate simultaneously |
| Partial success possible | Atomic: all succeed or all fail |
| No fee on failure | Fee charged even on failure |

---

## Key Facts

- **Max transaction size:** 1,232 bytes (IPv6 MTU 1,280 − 48 bytes network headers)
- **Blockhash expiry:** ~150 slots (~60–90 seconds) — prevents replay attacks
- **Signature = Transaction ID:** The first signature IS the unique identifier
- **Account ordering matters:** Header's 3 numbers partition the account keys array into permission groups
- **Atomic execution:** If any instruction fails, ALL changes are rolled back
- **Fee on failure:** Base fee (5000 lamports) charged regardless of success
- **Address Lookup Tables:** Used for complex txns needing more than ~35 accounts

---

## Solana Explorer
View my transaction on Solana Explorer (devnet):
[https://explorer.solana.com/?cluster=devnet](https://explorer.solana.com/?cluster=devnet)

Paste the transaction signature in the search bar to see the full breakdown.

---

## Resources
- [Solana Docs: Transactions](https://solana.com/docs/core/transactions)
- [Solana Docs: Transaction Structure](https://solana.com/docs/core/transactions/transaction-structure)
- [Solana Guide: Address Lookup Tables](https://solana.com/developers/guides/advanced/lookup-tables)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
