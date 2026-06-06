# Day 47 — Mutate Your NFT's Metadata Live on Devnet

> **Challenge:** Stop treating your NFT like a fragile artifact. Rename it, add a custom field, remove it, and swap the image URI — each change is one CLI call, each change lands on devnet in seconds.

---

## NFT Mutated

| Field | Value |
|-------|-------|
| **Mint Address** | `nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF` |
| **Program** | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` (Token-2022) |
| **Update Authority** | `AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y` |
| **Explorer** | [View on Devnet](https://explorer.solana.com/address/nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF?cluster=devnet) |

---

## Mutations Performed

### 1. Rename — "First Light" → "Field Notes"

```bash
spl-token update-metadata nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF name "Field Notes"
```

**Signature:** `5FL8AkL1W6MichdTQdbrGXu9nhi8WVdVmxi5BTWnqbA5iixXd1bJK4JfdnFqkrntAByoRpZXLNkNWoVswG93mCMx`  
**Explorer:** [View tx](https://explorer.solana.com/tx/5FL8AkL1W6MichdTQdbrGXu9nhi8WVdVmxi5BTWnqbA5iixXd1bJK4JfdnFqkrntAByoRpZXLNkNWoVswG93mCMx?cluster=devnet)

**Before:** `First Light`  
**After:** `Field Notes` ✅

---

### 2. Add Custom Field — rarity: legendary

```bash
spl-token update-metadata nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF rarity legendary
```

**Signature:** `4Cy1TF2PoEbjk2G5d8FSUmtE6N36mPgb7QCFUrXraF85X3MwSFu3EEmZGGXm5XfTxXKmhJpvXSeonQGdFJEkti6N`  
**Explorer:** [View tx](https://explorer.solana.com/tx/4Cy1TF2PoEbjk2G5d8FSUmtE6N36mPgb7QCFUrXraF85X3MwSFu3EEmZGGXm5XfTxXKmhJpvXSeonQGdFJEkti6N?cluster=devnet)

**Result:** `additional_metadata: [rarity: legendary]` visible on Explorer ✅

---

### 3. Remove Custom Field — rarity deleted

```bash
spl-token update-metadata nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF rarity --remove
```

**Signature:** `4oXjGEsKne5HhRkfKwC7uaEtTb5JitVDpjBoH4H15mFigpmNkYWpGC4irEyHtmq94HVPy6vCPZFJ8whYuzLCEHgT`  
**Explorer:** [View tx](https://explorer.solana.com/tx/4oXjGEsKne5HhRkfKwC7uaEtTb5JitVDpjBoH4H15mFigpmNkYWpGC4irEyHtmq94HVPy6vCPZFJ8whYuzLCEHgT?cluster=devnet)

**Result:** `rarity` field removed from additional_metadata ✅

---

### 4. Swap URI — new metadata JSON

```bash
spl-token update-metadata nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF uri https://gist.githubusercontent.com/janvinsha/6f8187a0b15de99c03a1b07e82db36e9/raw/83e33a3529d07df1f4d60bf7d543c5b72b5314e2/metadata.json
```

**Signature:** `J25mQs2kdUNrWmriCExRpnpgFr41xe3yRsUCRT9dDiu5yLfPeNCJmk4SayuCfx7hbUWeXHthBQhsm9kzLwd6DQa`  
**Explorer:** [View tx](https://explorer.solana.com/tx/J25mQs2kdUNrWmriCExRpnpgFr41xe3yRsUCRT9dDiu5yLfPeNCJmk4SayuCfx7hbUWeXHthBQhsm9kzLwd6DQa?cluster=devnet)

**Result:** URI updated on-chain → wallets will fetch new image (may cache old one for hours) ✅

---

## Before vs After

| Field | Before (Day 44) | After (Day 47) |
|-------|----------------|----------------|
| Name | `First Light` | `Field Notes` |
| Symbol | `LIGHT` | `LIGHT` |
| URI | gopichandchalla16 gist | janvinsha gist (new image) |
| additional_metadata | (none) | added `rarity: legendary` → then removed |
| Mint authority | (not set) | (not set) — unchanged |
| Supply | 1 | 1 — unchanged |

---

## Transaction History

| Step | Action | Signature | Status |
|------|--------|-----------|--------|
| 1 | Rename → "Field Notes" | [5FL8Ak...mCMx](https://explorer.solana.com/tx/5FL8AkL1W6MichdTQdbrGXu9nhi8WVdVmxi5BTWnqbA5iixXd1bJK4JfdnFqkrntAByoRpZXLNkNWoVswG93mCMx?cluster=devnet) | ✅ |
| 2 | Add rarity: legendary | [4Cy1TF...ti6N](https://explorer.solana.com/tx/4Cy1TF2PoEbjk2G5d8FSUmtE6N36mPgb7QCFUrXraF85X3MwSFu3EEmZGGXm5XfTxXKmhJpvXSeonQGdFJEkti6N?cluster=devnet) | ✅ |
| 3 | Remove rarity field | [4oXjGE...HgT](https://explorer.solana.com/tx/4oXjGEsKne5HhRkfKwC7uaEtTb5JitVDpjBoH4H15mFigpmNkYWpGC4irEyHtmq94HVPy6vCPZFJ8whYuzLCEHgT?cluster=devnet) | ✅ |
| 4 | Swap URI | [J25mQs...DQa](https://explorer.solana.com/tx/J25mQs2kdUNrWmriCExRpnpgFr41xe3yRsUCRT9dDiu5yLfPeNCJmk4SayuCfx7hbUWeXHthBQhsm9kzLwd6DQa?cluster=devnet) | ✅ |

---

## What I Learned

- `spl-token update-metadata` sends a single transaction to the Token-2022 program — it checks the signer holds the update authority, then rewrites the field in-place on the mint account. No new accounts. No migrations.
- The **on-chain layer** (name, symbol, URI) updates instantly — visible in Explorer within seconds of confirmation.
- The **off-chain layer** (the actual image the URI points at) is cached aggressively by wallets and marketplaces — can take hours or days to refresh. This asymmetry is why serious NFT projects use permanent storage like Arweave or IPFS.
- The `additional_metadata` array is an **open schema** — you can stamp any key/value pair onto a mint account. No migrations, no new programs, just one CLI command.
- Removing a field with `--remove` is as easy as adding it — both are single transactions costing fractions of a cent.
- Every mutation is signed by the update authority and permanently recorded on-chain. Anyone can query the full history via Explorer or any RPC endpoint.

---

## The Two-Layer Mental Model

```
┌─────────────────────────────────────────────┐
│           ON-CHAIN (Solana devnet)          │
│  name: "Field Notes"           ← instant   │
│  symbol: LIGHT                 ← instant   │
│  uri: https://gist.../new.json ← instant   │
│  additional_metadata: []       ← instant   │
└──────────────────┬──────────────────────────┘
                   │ URI pointer
                   ▼
┌─────────────────────────────────────────────┐
│         OFF-CHAIN (HTTP host / Gist)        │
│  { name, image, attributes... }             │
│  ← cached by wallets for hours/days        │
└─────────────────────────────────────────────┘
```

---

> *"You just performed an action a senior on-chain engineer performs every week: patching live state on a deployed program. One line. Real network. Real signatures. That is the muscle."*
> — 100 Days of Solana, Day 47
