# Day 44 — Give Your NFT a Name, Image, and On-Chain Metadata

> **Challenge:** Turn yesterday's empty 1-of-1 token into a real, viewable NFT by adding on-chain metadata, an image, attributes, and a locked supply using Token-2022 extensions.

---

## NFT Details

| Field | Value |
|-------|-------|
| **Mint Address** | `nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF` |
| **Token Name** | First Light |
| **Symbol** | LIGHT |
| **Program** | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` (Token-2022) |
| **Decimals** | 0 |
| **Supply** | 1 (fixed forever) |
| **Mint Authority** | (not set) — disabled 🔒 |
| **Token Account** | `DuM41B2NrArnA91WAWyhgAEYjqT35ev1N8HBh6QEjrSC` |
| **Owner** | `AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y` |
| **Extensions** | `metadataPointer` + `tokenMetadata` |
| **Explorer** | [View on Devnet](https://explorer.solana.com/address/nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF?cluster=devnet) |

---

## Off-Chain Metadata (GitHub Gist)

**Metadata URI:**
```
https://gist.githubusercontent.com/gopichandchalla16/632b0b6ea10fc27fd5a1bc8be34bae2d/raw/12e47e1b7c51dacb235b29d083288392d5821dda/metadata.json
```

**metadata.json:**
```json
{
  "name": "First Light",
  "symbol": "LIGHT",
  "description": "My first real NFT, minted on Solana devnet during 100 Days of Solana.",
  "image": "https://upload.wikimedia.org/wikipedia/commons/4/49/Dichroic_filters.jpg",
  "attributes": [
    { "trait_type": "Day", "value": "44" },
    { "trait_type": "Challenge", "value": "100DaysOfSolana" },
    { "trait_type": "Network", "value": "Devnet" },
    { "trait_type": "Builder", "value": "GopichandAI" }
  ]
}
```

---

## Commands Run

### Step 1 — Confirm devnet
```bash
solana config set --url https://api.devnet.solana.com
solana balance
# Balance: 6.07405824 SOL
```

### Step 2 — Generate vanity mint keypair
```bash
solana-keygen grind --starts-with nft:1
# Wrote keypair to nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF.json
```

### Step 3 — Create mint with metadata extension
```bash
spl-token create-token \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --enable-metadata \
  --decimals 0 \
  ./nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF.json
# Mint: nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF
# Sig: 3iXwaWfk8YfVMQRvPGHdzAMKEZ2xK45EXciYt8mDc47QGGptkqpBEca2LxAup4wUHKZ1NjhWTy6RJpU6rpbjzXtz
```

### Step 4 — Initialize on-chain metadata
```bash
spl-token initialize-metadata \
  nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF \
  "First Light" \
  "LIGHT" \
  "https://gist.githubusercontent.com/gopichandchalla16/632b0b6ea10fc27fd5a1bc8be34bae2d/raw/12e47e1b7c51dacb235b29d083288392d5821dda/metadata.json"
# Sig: 45PYGZMbBXBP3S1Fuo6jqNi4Uv8gq2qbQ4GFnaPEVRoY5durKMK5SiY3UHW3rESjGptPPShGWfKA37YgBuXKv2D4
```

### Step 5 — Create token account
```bash
spl-token create-account nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF
# Account: DuM41B2NrArnA91WAWyhgAEYjqT35ev1N8HBh6QEjrSC
# Sig: gWLGogf4iCfWu62iw4mVLnaEQQ3zv7pebvP4tMKGmL1UA5xttqPQnwjWHxebPpyV6L3GBPboaLXo3EGuNoYmmgj
```

### Step 6 — Mint exactly 1 token
```bash
spl-token mint nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF 1
# Sig: 3B8MS16hQ4itmB3pr76SfGZUkhzvMFtmtGggCGzpTbeUjLDqh7n37qMb8aWugnKAFFaNKhqsFJZAHtxZYfTwrQoP
```

### Step 7 — Disable mint authority forever
```bash
spl-token authorize nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF mint --disable
# Sig: 3YhopR7CCQwGkShGYcTx2Rnibg8oYgQXd1HiYi8DqcpQiZre4QUHk5pBrHSdzXwkk2TVRdXyEcfVpeMuwX3kckqo
```

### Step 8 — Verify with spl-token display
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
    URI: https://gist.githubusercontent.com/gopichandchalla16/...
```

---

## Transaction History

| Transaction | Instruction | Block | Status |
|-------------|-------------|-------|--------|
| [3iXwa...jzXtz](https://explorer.solana.com/tx/3iXwaWfk8YfVMQRvPGHdzAMKEZ2xK45EXciYt8mDc47QGGptkqpBEca2LxAup4wUHKZ1NjhWTy6RJpU6rpbjzXtz?cluster=devnet) | Init Mint + Metadata Pointer | 466,812,713 | ✅ |
| [45PYG...Kv2D4](https://explorer.solana.com/tx/45PYGZMbBXBP3S1Fuo6jqNi4Uv8gq2qbQ4GFnaPEVRoY5durKMK5SiY3UHW3rESjGptPPShGWfKA37YgBuXKv2D4?cluster=devnet) | Initialize Token Metadata | 466,812,881 | ✅ |
| [gWLGo...Ymmgj](https://explorer.solana.com/tx/gWLGogf4iCfWu62iw4mVLnaEQQ3zv7pebvP4tMKGmL1UA5xttqPQnwjWHxebPpyV6L3GBPboaLXo3EGuNoYmmgj?cluster=devnet) | Create Token Account | 466,812,885 | ✅ |
| [3B8MS...wrQoP](https://explorer.solana.com/tx/3B8MS16hQ4itmB3pr76SfGZUkhzvMFtmtGggCGzpTbeUjLDqh7n37qMb8aWugnKAFFaNKhqsFJZAHtxZYfTwrQoP?cluster=devnet) | Mint To Checked | 466,812,890 | ✅ |
| [3Yhop...kckqo](https://explorer.solana.com/tx/3YhopR7CCQwGkShGYcTx2Rnibg8oYgQXd1HiYi8DqcpQiZre4QUHk5pBrHSdzXwkk2TVRdXyEcfVpeMuwX3kckqo?cluster=devnet) | Set Authority (Disabled) | 466,812,894 | ✅ |

---

## Two Layers of an NFT

| Layer | What it is | Where it lives |
|-------|-----------|----------------|
| On-chain | Mint account: name, symbol, URI pointer | Solana blockchain |
| Off-chain | Full metadata: image URL, attributes, description | GitHub Gist (JSON) |

Wallets and explorers follow the pattern: read on-chain metadata → follow the URI → fetch JSON → render image. Every NFT in every marketplace works on this same two-layer pattern.

---

## vs Day 43

| Day 43 | Day 44 |
|--------|--------|
| Original SPL Token program | Token-2022 program |
| No metadata | `metadataPointer` + `tokenMetadata` extensions |
| "Unknown Token" on Explorer | **"First Light"** on Explorer |
| Supply 1, locked | Supply 1, locked |
| Foundation | Foundation + Identity |

---

*Part of [#100DaysOfSolana](https://github.com/gopichandchalla16/100-days-of-solana) — building in public daily.*
