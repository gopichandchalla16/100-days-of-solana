# Day 24 — Decode Account Data

> **100 Days of Solana** | Arc Theme: Accounts & Programs (Week 4)

## What I Built

Decoded raw Solana account bytes into structured, human-readable data using three methods:
1. **Codec decode** — `getMintDecoder()` from `@solana-program/token`
2. **Manual decode** — byte-by-byte with `DataView` (little-endian)
3. **RPC jsonParsed** — server-side decode for cross-validation

Target account: **Wrapped SOL (WSOL)** mint on Solana mainnet.

---

## Usage

```bash
npm install
node decode.mjs
```

---

## ✅ Live Output

```
====== RAW ACCOUNT INFO ======

Address: So11111111111111111111111111111111111111112
Owner  : TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
Bytes  : 82
Hex    : 0000000000000000000000000000000000000000000000000000000000000000...

====== 1. CODEC DECODE (getMintDecoder) ======

Mint Authority  : (none)
Supply          : 0
Decimals        : 9
Is Initialized  : true
Freeze Authority: (none)

====== 2. MANUAL DECODE (DataView byte-by-byte) ======

mintAuthorityOption: 0 (none)
Mint Authority     : (none)
Supply (u64 LE)    : 0
Decimals (u8)      : 9
Is Initialized     : true
freezeAuthorityOpt : 0 (none)
Freeze Authority   : (none)

====== 3. RPC jsonParsed COMPARISON ======

Mint Authority  : (none)
Supply          : 0
Decimals        : 9
Is Initialized  : true
Freeze Authority: (none)

====== MATCH CHECK ======

Supply match   (codec vs manual): true
Decimals match (codec vs manual): true
```

---

## Mint Account Byte Layout (82 bytes)

| Bytes | Field | Type | Value |
|-------|-------|------|-------|
| 0–3 | mintAuthorityOption | u32 LE | `0` (none) |
| 4–35 | mintAuthority | 32-byte pubkey | `(none)` |
| 36–43 | supply | u64 LE | `0` |
| 44 | decimals | u8 | `9` |
| 45 | isInitialized | bool | `true` |
| 46–49 | freezeAuthorityOption | u32 LE | `0` (none) |
| 50–81 | freezeAuthority | 32-byte pubkey | `(none)` |

---

## Key Concepts

- **Borsh** — Binary Object Representation Serializer for Hashing. Fields stored contiguously, little-endian, no schema embedded in data
- **DataView** — Standard JS API for reading multi-byte values from binary buffers. `getUint32(0, true)` reads 4 bytes little-endian
- **Little-endian flag** — The `true` second argument is critical. `[0x05, 0x00, 0x00, 0x00]` = `5` in Solana, not `83886080`
- **Base58** — How Solana addresses are encoded. Same 32 bytes, different spelling. `getBase58Encoder().encode(bytes)` = address you see on Explorer
- **`__option` discriminator** — How `@solana/kit` represents Rust's `Option<T>`: either `{ __option: 'Some', value: ... }` or `{ __option: 'None' }`
- **jsonParsed encoding** — RPC convenience for known programs. For custom programs, you bring your own decoder

---

## Three Encodings to Know

| Encoding | Use Case | Example |
|----------|----------|---------|
| Base64 | RPC sends account data | `AAAAAAAAAA==` |
| Base16 (hex) | Debugging, byte counting | `00000000...` |
| Base58 | Solana addresses | `So111...112` |

---

## Tech Stack
- `@solana/kit` — Official Solana JS SDK
- `@solana-program/token` — Pre-built Mint codec
- `Node.js v24` — ES Modules, DataView, Buffer
- Solana Mainnet RPC
