# Day 46 — Audit Your NFT Collection On-Chain

> **Challenge:** Read your NFT and collection back from devnet, inspect every extension, and confirm that the member-to-collection foreign key resolves correctly — the Solana equivalent of a senior engineer reviewing their own work before shipping.

---

## Addresses Audited

| Mint | Name | Role |
|------|------|------|
| `nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF` | First Light (LIGHT) | Day 44 NFT |
| `AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx` | Solana Sketchbook (SKTCH) | Collection (Group) |
| `LYq1EabcswuJUUUBVKaGnp7gkyrXdVMmmLLNqGhrEvv` | Sketch #1 (SK1) | Member #1 |
| `6n3MSLH7tU3a9b6f841K3bmVNLUpi42PVMEjmad9yafq` | Sketch #2 (SK2) | Member #2 |
| `2M6t3SbJMz95mZ8nzF8MLq364v2ZQQ235BkxhE93g7hq` | (old fungible) | Comparison |

---

## Commands Run

```bash
solana config set --url https://api.devnet.solana.com
solana config get
spl-token display nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF
spl-token display AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx
spl-token display LYq1EabcswuJUUUBVKaGnp7gkyrXdVMmmLLNqGhrEvv
spl-token display 6n3MSLH7tU3a9b6f841K3bmVNLUpi42PVMEjmad9yafq
spl-token accounts
```

---

## Audit Output

### 1. First Light — Day 44 NFT (nftTnVuy...)

```
SPL Token Mint
  Address: nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 1
  Decimals: 0
  Mint authority: (not set)
  Freeze authority: (not set)
Extensions
  Metadata Pointer:
    Authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Metadata address: nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF
  Metadata:
    Update Authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Mint: nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF
    Name: First Light
    Symbol: LIGHT
    URI: https://gist.githubusercontent.com/gopichandchalla16/632b0b6ea10fc27fd5a1bc8be34bae2d/raw/...
```

---

### 2. Solana Sketchbook — Collection Mint (AC3peC3...)

```
SPL Token Mint
  Address: AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 0
  Decimals: 0
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: (not set)
Extensions
  Metadata Pointer:
    Authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Metadata address: AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx
  Group Pointer:
    Authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Group address: AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx
  Metadata:
    Name: Solana Sketchbook
    Symbol: SKTCH
    URI: https://gist.githubusercontent.com/janvinsha/b477ebe4dda46b0ef03895c4ea930a46/raw/.../collection.json
  Token Group:
    Update Authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Mint: AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx
    Size: 2
    Max Size: 3
```

---

### 3. Sketch #1 — Member NFT #1 (LYq1Eab...)

```
SPL Token Mint
  Address: LYq1EabcswuJUUUBVKaGnp7gkyrXdVMmmLLNqGhrEvv
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 1
  Decimals: 0
  Mint authority: (not set)
  Freeze authority: (not set)
Extensions
  Metadata Pointer:
    Metadata address: LYq1EabcswuJUUUBVKaGnp7gkyrXdVMmmLLNqGhrEvv
  Group Member Pointer:
    Member address: LYq1EabcswuJUUUBVKaGnp7gkyrXdVMmmLLNqGhrEvv
  Metadata:
    Name: Sketch #1
    Symbol: SK1
    URI: https://gist.githubusercontent.com/janvinsha/3412c5d4e92b6de9a2ed82337ecafc44/raw/.../nft.json
  Token Group Member:
    Mint: LYq1EabcswuJUUUBVKaGnp7gkyrXdVMmmLLNqGhrEvv
    Group: AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx  ✅ FOREIGN KEY MATCH
    Member Number: 1
```

---

### 4. Sketch #2 — Member NFT #2 (6n3MSLH...)

```
SPL Token Mint
  Address: 6n3MSLH7tU3a9b6f841K3bmVNLUpi42PVMEjmad9yafq
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 1
  Decimals: 0
  Mint authority: (not set)
  Freeze authority: (not set)
Extensions
  Metadata Pointer:
    Metadata address: 6n3MSLH7tU3a9b6f841K3bmVNLUpi42PVMEjmad9yafq
  Group Member Pointer:
    Member address: 6n3MSLH7tU3a9b6f841K3bmVNLUpi42PVMEjmad9yafq
  Metadata:
    Name: Sketch #2
    Symbol: SK2
    URI: https://gist.githubusercontent.com/janvinsha/3412c5d4e92b6de9a2ed82337ecafc44/raw/.../nft.json
  Token Group Member:
    Mint: 6n3MSLH7tU3a9b6f841K3bmVNLUpi42PVMEjmad9yafq
    Group: AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx  ✅ FOREIGN KEY MATCH
    Member Number: 2
```

---

## ✅ Foreign Key Verification

This is the most important check of Day 46. Both member NFTs carry a `Group` field that resolves **byte-for-byte** to the collection mint address:

```
Member 1 → Group: AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx ✅
Member 2 → Group: AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx ✅
```

This is the Solana equivalent of a foreign key JOIN resolving correctly between two database rows — except there is no central database. Anyone in the world, including Phantom and every NFT marketplace, can verify this membership without trusting any off-chain index. That is what "verifiable provenance" actually means.

---

## NFT vs Fungible Token — The Contrast

Running `spl-token accounts` revealed old fungible mints (supply 100, 750, 901, etc.) vs NFTs (supply exactly 1). Here is the full contrast:

| Property | Old Fungible Token | NFT (Token-2022) |
|----------|-------------------|------------------|
| Supply | 100 / 750 / 901+ | **1** |
| Decimals | > 0 | **0** |
| Mint authority | Set (can mint more) | **(not set) — burned** |
| Extensions block | ❌ None | ✅ MetadataPointer + TokenMetadata |
| Metadata | ❌ None | ✅ Name, Symbol, URI on-chain |
| Group/Member link | ❌ None | ✅ Collection foreign key |
| Program | Token (legacy) | **Token-2022** |

There is no separate "NFT program" on Solana. The same SPL Token primitives you used since Week 1, combined with a small set of carefully chosen extensions, are everything that makes a collectible possible.

---

## On-Chain Explorer Links

- [First Light (Day 44 NFT)](https://explorer.solana.com/address/nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF?cluster=devnet)
- [Solana Sketchbook (Collection)](https://explorer.solana.com/address/AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx?cluster=devnet)
- [Sketch #1 (Member 1)](https://explorer.solana.com/address/LYq1EabcswuJUUUBVKaGnp7gkyrXdVMmmLLNqGhrEvv?cluster=devnet)
- [Sketch #2 (Member 2)](https://explorer.solana.com/address/6n3MSLH7tU3a9b6f841K3bmVNLUpi42PVMEjmad9yafq?cluster=devnet)

---

## What I Learned

- `spl-token display` parses the raw bytes of a mint account and walks the Type-Length-Value (TLV) list of extensions stored on it — every line of output comes from real data on devnet validators, not a JSON file on my laptop
- The `Group` field on a member NFT is the Solana equivalent of a foreign key — when it equals the collection mint address byte-for-byte, membership is cryptographically proven
- Wallets and marketplaces like Phantom verify NFT collection membership by reading this field directly — no off-chain index, no trust required
- The contrast with old fungible mints makes it concrete: an NFT is just a mint with `decimals: 0`, `supply: 1`, a locked mint authority, and metadata extensions — no magic, no separate program
- "Verifiable provenance" is not a marketing phrase — it is two byte arrays comparing equal on a public ledger

---

> *"The parent reference check is the most important moment of the exercise. When you confirmed that the Group field on your member NFT equals your collection mint address, you proved that anyone in the world can verify membership without trusting you or any off-chain index."*
> — 100 Days of Solana, Day 46
