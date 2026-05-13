# Day 23 — Build an Account Explorer

> **100 Days of Solana** | Arc Theme: Accounts & Programs (Week 4)

## What I Built

A Node.js CLI tool that acts as a mini Solscan — give it any Solana address and it prints a clean summary of all 5 core account fields.

---

## Usage

```bash
npm install
node explorer.mjs <SOLANA_ADDRESS>
```

### Examples

```bash
# Your own wallet
node explorer.mjs AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y

# SPL Token Program
node explorer.mjs TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA

# System Program
node explorer.mjs 11111111111111111111111111111111
```

---

## ✅ Live Output

### Wallet Account
```
╭─────────────────────────────────────────────────────────╮
│  💰 Balance     : 6.137925000 SOL
│  ⚡ Lamports    : 6,137,925,000
│  👑 Owner       : 11111111111111111111111111111111
│  📛 Owner Name  : System Program
│  🚀 Executable  : false
│  📦 Data Size   : 0 bytes
│  🔢 Rent Epoch  : 18446744073709551615
│  🏷️  Type        : 🔵 Data Account (Wallet / State)
├─────────────────────────────────────────────────────────┤
│  🗂️  Data Preview: (empty — wallet account)
╰─────────────────────────────────────────────────────────╯
```

### SPL Token Program
```
│  💰 Balance     : 11.973563357 SOL
│  👑 Owner       : BPFLoaderUpgradeab1e11111111111111111111111
│  📛 Owner Name  : BPF Loader (Upgradeable)
│  🚀 Executable  : true
│  📦 Data Size   : 36 bytes
│  🏷️  Type        : 🟢 Program (Executable)
│  🗂️  Data Preview: 0200000027f190b1d3af98b8ce714c44e8cadff9f8fc45cb8e5fac4202eff811...
```

### System Program
```
│  💰 Balance     : 0.000000001 SOL
│  👑 Owner       : NativeLoader1111111111111111111111111111111
│  📛 Owner Name  : Native Loader
│  🚀 Executable  : true
│  📦 Data Size   : 14 bytes
│  🗂️  Data Preview: 73797374656d5f70726f6772616d  (→ "system_program")
```

---

## How It Works

1. Takes any Solana address as CLI argument
2. Calls `getBalance` via `@solana/kit` RPC
3. Calls `getAccountInfo` with `base64` encoding
4. Maps known program addresses to friendly names
5. Formats all 5 account fields into a clean display
6. Shows hex data preview (truncated to 32 bytes)

---

## Account Types Compared

| Account | Executable | Owner | Data |
|---------|-----------|-------|------|
| Wallet | `false` 🔵 | System Program | 0 bytes |
| SPL Token Program | `true` 🟢 | BPF Loader | 36 bytes |
| System Program | `true` 🟢 | Native Loader | 14 bytes |

---

## Key Insight

The `executable` flag + `owner` field together tell you everything about what an account is:
- `executable=false` + `owner=System Program` → regular wallet
- `executable=true` + `owner=BPFLoader` → deployed program
- `executable=true` + `owner=NativeLoader` → built-in Solana program

---

## Tech Stack
- `@solana/kit` — Official Solana JS SDK
- `Node.js v24` — ES Modules
- Solana Devnet RPC
