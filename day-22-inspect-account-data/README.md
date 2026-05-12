# Day 22 — Inspect Account Data

> **100 Days of Solana** | Arc Theme: Accounts and Programs

## What I Did

Inspected raw on-chain account data using the Solana CLI on devnet. Compared a wallet account, the SPL Token Program, the System Program, and viewed JSON output.

---

## Commands Run

```bash
solana config set --url https://api.devnet.solana.com
solana address
solana balance
solana account $(solana address)
solana account TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
solana account 11111111111111111111111111111111
solana account $(solana address) --output json
```

---

## ✅ Output

### Wallet Account
```
Public Key: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
Balance:    6.137925 SOL
Owner:      11111111111111111111111111111111  (System Program)
Executable: false
Rent Epoch: 18446744073709551615
Length:     0 bytes  ← wallets store no custom data
```

### SPL Token Program
```
Public Key: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
Balance:    11.973563357 SOL
Owner:      BPFLoaderUpgradeab1e11111111111111111111111
Executable: true   ← this is a program!
Rent Epoch: 18446744073709551615
Length:     36 bytes (pointer to program data account)
```

### System Program
```
Public Key: 11111111111111111111111111111111
Balance:    0.000000001 SOL
Owner:      NativeLoader1111111111111111111111111111111
Executable: true
Rent Epoch: 18446744073709551615
Length:     14 bytes
Data:       system_program  ← literally the text!
```

### Wallet Account (JSON)
```json
{
  "pubkey": "AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y",
  "account": {
    "lamports": 6137925000,
    "data": ["", "base64"],
    "owner": "11111111111111111111111111111111",
    "executable": false,
    "rentEpoch": 18446744073709551615,
    "space": 0
  }
}
```

---

## Account Comparison Table

| Field | Wallet | SPL Token Program | System Program |
|-------|--------|-------------------|----------------|
| **Owner** | `11111111...` (System) | `BPFLoaderUpgradeable...` | `NativeLoader...` |
| **Executable** | `false` | `true` | `true` |
| **Data length** | 0 bytes | 36 bytes | 14 bytes |
| **Data content** | none | program data pointer | `system_program` |
| **Balance** | 6.137925 SOL | 11.973 SOL | 0.000000001 SOL |
| **Type** | User wallet | Deployed program | Native built-in |

---

## Key Insights

- **Everything on Solana is an account** — wallets, programs, tokens, NFTs, all follow the same 5-field structure
- **`executable: false`** = data account (wallet, token balance, game state)
- **`executable: true`** = program account (SPL Token, System Program, your own programs)
- **Owner controls everything** — only the owning program can modify an account’s data or deduct lamports
- **Wallet owner = System Program** — that’s why System Program handles SOL transfers
- **Token account owner = Token Program** — that’s why only Token Program can move tokens
- **`rentEpoch: 18446744073709551615`** = max uint64, means rent-exempt (legacy field)
- **System Program data = literally `system_program`** — native programs are built into the validator

---

## The 5 Account Fields

| Field | Type | Description |
|-------|------|-------------|
| `lamports` | u64 | Balance in lamports (1 SOL = 1,000,000,000 lamports) |
| `data` | byte array | Arbitrary data stored by the owning program |
| `owner` | Pubkey | Program that owns and can modify this account |
| `executable` | bool | Whether this account contains a program |
| `rentEpoch` | u64 | Legacy field — max value means rent-exempt |

---

## Resources
- [Solana Accounts Overview](https://solana.com/docs/core/accounts)
- [Solana CLI Reference](https://docs.anza.xyz/cli/usage)
- [Solana Explorer](https://explorer.solana.com/)
