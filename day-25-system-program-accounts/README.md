# Day 25 — Explore System Program Accounts

> **100 Days of Solana** | Arc Theme: Accounts & Programs (Week 4)

## What I Did

Inspected 6 different Solana account types using the CLI on devnet:
- My wallet (system-owned)
- System Program (native, executable)
- Stake Program (BPF-deployed, executable)
- Vote Program (native, executable)
- Clock Sysvar (cluster state, not executable)
- Rent Sysvar (cluster state, not executable)

---

## Commands Run

```bash
solana config set --url devnet
solana address
solana balance
solana account $(solana address)
solana account 11111111111111111111111111111111
solana account Stake11111111111111111111111111111111111111
solana account Vote111111111111111111111111111111111111111
solana account SysvarC1ock11111111111111111111111111111111
solana account SysvarRent111111111111111111111111111111111
solana account $(solana address) --output json
solana account 11111111111111111111111111111111 --output json
```

---

## ✅ Live Output

### My Wallet (System Account)
```
Public Key: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
Balance:    6.137925 SOL
Owner:      11111111111111111111111111111111  ← System Program owns it
Executable: false
Rent Epoch: 18446744073709551615
Data:       0 bytes  ← wallets store no custom data
```

### System Program
```
Public Key: 11111111111111111111111111111111
Balance:    0.000000001 SOL
Owner:      NativeLoader1111111111111111111111111111111
Executable: true  ← contains program code
Length:     14 bytes
Data:       system_program  ← literally the name!
```

### Stake Program
```
Public Key: Stake11111111111111111111111111111111111111
Balance:    0.00114144 SOL
Owner:      BPFLoaderUpgradeab1e11111111111111111111111
Executable: true
Length:     36 bytes  ← pointer to program data account
```

### Vote Program
```
Public Key: Vote111111111111111111111111111111111111111
Balance:    0.000000001 SOL
Owner:      NativeLoader1111111111111111111111111111111
Executable: true
Length:     12 bytes
Data:       vote_program
```

### Clock Sysvar
```
Public Key: SysvarC1ock11111111111111111111111111111111
Balance:    0.00116928 SOL
Owner:      Sysvar1111111111111111111111111111111111111
Executable: false  ← holds data, not code
Length:     40 bytes  ← slot, epoch, unix timestamp
```

### Rent Sysvar
```
Public Key: SysvarRent111111111111111111111111111111111
Balance:    0.0010092 SOL
Owner:      Sysvar1111111111111111111111111111111111111
Executable: false
Length:     17 bytes  ← lamports-per-byte-year rate
```

### JSON Comparison
```json
// Wallet
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

// System Program
{
  "pubkey": "11111111111111111111111111111111",
  "account": {
    "lamports": 1,
    "data": ["c3lzdGVtX3Byb2dyYW0=", "base64"],
    "owner": "NativeLoader1111111111111111111111111111111",
    "executable": true,
    "rentEpoch": 18446744073709551615,
    "space": 14
  }
}
```

---

## Account Type Comparison Table

| Account | Owner | Executable | Data | Type |
|---------|-------|------------|------|------|
| My Wallet | System Program | `false` | 0 bytes | User wallet |
| System Program | NativeLoader | `true` | `system_program` | Native built-in |
| Stake Program | BPFLoaderUpgradeable | `true` | 36 bytes (pointer) | Deployed program |
| Vote Program | NativeLoader | `true` | `vote_program` | Native built-in |
| Clock Sysvar | Sysvar Program | `false` | 40 bytes (slot/epoch/time) | Cluster state |
| Rent Sysvar | Sysvar Program | `false` | 17 bytes (rate) | Cluster state |

---

## Key Insights

- **System Program = OS kernel** — controls account creation and SOL transfers
- **Sysvars = `/proc` in Linux** — read-only cluster-wide environment variables
- **Your wallet = user-space process** — exists within rules the kernel enforces
- **Native vs BPF programs**: Native programs (`NativeLoader` owner) have name bytes as data. BPF programs (`BPFLoaderUpgradeable` owner) store a 36-byte pointer to a separate program data account
- **`executable=false` + `owner=Sysvar`** = cluster state, not code
- **`executable=true` + `owner=NativeLoader`** = built-in runtime program
- **Rent Epoch = 18446744073709551615** = max u64 = rent-exempt forever
- **`c3lzdGVtX3Byb2dyYW0=`** in base64 decodes to `system_program` — the raw bytes of the System Program name

---

## Resources
- [Solana Accounts Overview](https://solana.com/docs/core/accounts)
- [Solana Built-in Programs](https://solana.com/docs/core/programs/builtin-programs)
- [Sysvar Accounts (Agave Docs)](https://docs.anza.xyz/runtime/sysvars)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
