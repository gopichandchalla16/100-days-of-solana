# Day 48 — Publish Your Solana NFT Journey on DEV

> **Challenge:** Take the arc of Days 44–47 — minting, grouping, auditing, and mutating a Solana NFT — and turn it into a short technical post that helps the next Web2 developer landing on Solana.

---

## Published Article

**Title:** Solana NFTs Without Metaplex: What I Learned Building with Token Extensions

**URL:** [https://dev.to/gopichand_dev/solana-nfts-without-metaplex-what-i-learned-building-with-token-extensionspublished-true-1070](https://dev.to/gopichand_dev/solana-nfts-without-metaplex-what-i-learned-building-with-token-extensionspublished-true-1070)

**Platform:** DEV (dev.to)

**Tags:** `solana` `nft` `webdev` `tutorial`

---

## What the Article Covers

The post walks through the full arc of Days 44–47 in plain language aimed at a Web2 developer who has never touched Solana NFTs:

| Section | What it covers |
|---------|----------------|
| The Mental Model | NFT = mint with supply 1, decimals 0, mint authority disabled, metadata extension |
| Day 44 | Minting First Light with `--enable-metadata` and `initialize-metadata` |
| Day 45 | Creating Solana Sketchbook collection using Group + Member extensions |
| Day 46 | Auditing every byte with `spl-token display` and verifying the foreign key |
| Day 47 | Mutating metadata live — rename, custom field, remove, URI swap |
| The Surprising Part | On-chain vs off-chain layer speed; open schema; no separate NFT program |
| What’s Next | Permanent image hosting on Arweave, dynamic NFTs, Metaplex comparison |

---

## Key Addresses Referenced

| Mint | Name | Explorer |
|------|------|----------|
| `nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF` | Field Notes (First Light) | [View](https://explorer.solana.com/address/nftTnVuyNU1kwTgv7edG6BPmHCtp2NMrawbw94kwZTF?cluster=devnet) |
| `AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx` | Solana Sketchbook | [View](https://explorer.solana.com/address/AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx?cluster=devnet) |
| `LYq1EabcswuJUUUBVKaGnp7gkyrXdVMmmLLNqGhrEvv` | Sketch #1 | [View](https://explorer.solana.com/address/LYq1EabcswuJUUUBVKaGnp7gkyrXdVMmmLLNqGhrEvv?cluster=devnet) |
| `6n3MSLH7tU3a9b6f841K3bmVNLUpi42PVMEjmad9yafq` | Sketch #2 | [View](https://explorer.solana.com/address/6n3MSLH7tU3a9b6f841K3bmVNLUpi42PVMEjmad9yafq?cluster=devnet) |

---

## Resources Linked in Article

- [Token Extensions overview](https://solana.com/docs/tokens/extensions)
- [Metadata Pointer and Token Metadata](https://solana.com/docs/tokens/extensions/metadata)
- [Token Groups and Members](https://solana.com/docs/tokens/extensions/group-member)
- [Dynamic Metadata NFTs guide](https://solana.com/developers/guides/token-extensions/dynamic-meta-data-nft)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
- [Metaplex Core](https://developers.metaplex.com/core)

---

## What I Learned Writing This

Writing the "mental model" section forced me to compress everything into one sentence: *An NFT on Solana is a mint with supply 1, decimals 0, a disabled mint authority, and a metadata extension pointing to a JSON file.* That compression is the actual test of understanding.

The most important insight from this week: the on-chain layer (name, symbol, URI) updates instantly. The off-chain layer (the image the URI points at) is cached aggressively by wallets and can lag for hours. That asymmetry is why permanent storage like Arweave or IPFS matters.

---

> *"By publishing, you put your name on the search results for 'Solana Token Extensions NFT' for the next developer who lands on this question. That is the network."*
> — 100 Days of Solana, Day 48
