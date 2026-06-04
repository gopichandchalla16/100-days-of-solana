# Day 45 — Group Your NFTs Into an On-Chain Collection

> **Challenge:** Build a real Token Extensions NFT collection by creating one group mint, minting two member NFTs, and linking them on-chain.

---

## What I Built

A fully on-chain NFT collection using Token-2022 native group and member extensions — no Metaplex, no JavaScript, just the Solana CLI.

| Mint | Name | Role | Address |
|------|------|------|---------|
| Collection | Solana Sketchbook (SKTCH) | Group | `AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx` |
| Member 1 | Sketch #1 (SK1) | Group Member | `LYq1EabcswuJUUUBVKaGnp7gkyrXdVMmmLLNqGhrEvv` |
| Member 2 | Sketch #2 (SK2) | Group Member | `6n3MSLH7tU3a9b6f841K3bmVNLUpi42PVMEjmad9yafq` |

---

## Key Concept

In Web2 terms this is a `collections` table joined to an `nfts` table by a foreign key — except on Solana there is no central database. The relationship is stamped directly into the mint accounts:

- The **group extension** on the collection mint stores `max_size` and the running `size` (member count)
- The **member extension** on each NFT mint stores a pointer back to the collection and its own member number
- Both extensions must be declared at mint creation — you cannot retrofit them later ("schema decisions are forever")

---

## Commands Run

### 1. Create collection mint
```bash
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token \
  --decimals 0 \
  --enable-metadata \
  --enable-group
```

### 2. Initialize metadata + group
```bash
spl-token initialize-metadata AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx \
  "Solana Sketchbook" "SKTCH" "<URI>"

spl-token initialize-group AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx 3
```

### 3. Create member mints (repeated for each)
```bash
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token \
  --decimals 0 \
  --enable-metadata \
  --enable-member

spl-token initialize-metadata <MEMBER_MINT> "Sketch #1" "SK1" "<URI>"
spl-token initialize-member <MEMBER_MINT> AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx
spl-token create-account <MEMBER_MINT>
spl-token mint <MEMBER_MINT> 1
spl-token authorize <MEMBER_MINT> mint --disable
```

---

## Verification Output

```
SPL Token Mint
  Address: AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 0
  Decimals: 0
Extensions
  Metadata: Solana Sketchbook | SKTCH
  Token Group:
    Size: 2
    Max Size: 3
```

---

## On-Chain Explorer Links

- [Collection — Solana Sketchbook](https://explorer.solana.com/address/AC3peC3tdZUnLY44zGYC7YAuEaPknkMcRqsmAyvXJtMx?cluster=devnet)
- [Member 1 — Sketch #1](https://explorer.solana.com/address/LYq1EabcswuJUUUBVKaGnp7gkyrXdVMmmLLNqGhrEvv?cluster=devnet)
- [Member 2 — Sketch #2](https://explorer.solana.com/address/6n3MSLH7tU3a9b6f841K3bmVNLUpi42PVMEjmad9yafq?cluster=devnet)

---

## Transaction Signatures

| Action | Signature |
|--------|-----------|
| Create Collection Mint | `5Jorrqp4cX1x6wx5KyXcqGaGmW8qMZkpDStY2QA1WNsYxQGd4gdpERKBiGqBXrNSvFLKsdxwRy5zLkWJ3uuXqFPv` |
| Initialize Collection Metadata | `4zftGub7cxPsKKKppwpRt7VbS5gYoBe2rKdY4XBZ4DAh8jwRkHqBJF7C2dnd4d3pXGMv1jdsKhfkRg4u4BbLTjxe` |
| Initialize Group | `64S2eBa1qeYtHobLuEt5ypqH4e6ojxLdLibLCzr2VFYeiE8Dqxqdp6uygBiW8b4cV6bX4yL4Dtw7rMMZRztkdenx` |
| Create Member 1 Mint | `3tvrxAtAzEdL6YoJqyF8aRydKBHikj9SNd4bY3oxbqsmiSWi5g21FrkUMzcdZZNKshwLMF6MnyQgFiYRbWrxdBS9` |
| Initialize Member 1 Metadata | `cZbFnrdz3NMH5z4x2itkNQRg3qoY5ahDfo2XWiz4T9dfcTG7XCMsN1rbFC1sidDqQPPnSg4MxFYF9JX9nnzES7o` |
| Link Member 1 to Collection | `5j1iy1ESB1NPRccJoaNkhv9ggsF81JsvGz7fKeug5ZiijdfCrTiaVrxs1kKFdkVuHEk3E7xxgcZw5yFvBjkBgrPB` |
| Mint 1 Token (Sketch #1) | `2dd5EL2aFx2BiwYTvqnugo8FUCqbmVGWiPoKtPc5or4zxr8KQfjJva58viq9RectNvSRC99TFtn2XQsXzYA4dBTD` |
| Disable Mint Authority (SK1) | `2S4qjfpac47NA5enrx1U7xKjfGWQ1yCBNt4Cmbfzqv3ErAWi3WXVDm5qz2CwCAUAbXsTKjMK1GFR9CSTbwzJJZCu` |
| Create Member 2 Mint | `axV11XJntWNmVGaAZrLe3nQ3RZDctdTX1ED6WU4K7DBW9vrvH2tHo4Js9j4oYXitidUMdPaYMLiLwuCchfdjTdj` |
| Initialize Member 2 Metadata | `UBqojvYJKXJEuiC4svo9CheDTejDXbmjQi34U4EwkJcnJDY2HusYJgtJEm3jJzS7EKk9SA5a6LZ5Mg7RKr4kqvx` |
| Link Member 2 to Collection | `4cWz8ucx2whVxivZ1RsoiMigq3NFXLojes3WttSNPWkden5F1wmcbKREeUwKEi93dAAFxBasWxC3SXwTTMxbLD4x` |
| Mint 1 Token (Sketch #2) | `5auZ8cySZdMiFwvsVLuCMWvDLByZPo8vbmfyLWnRTq99XbmoSRuq9YiryMoLR5ZBfgxdKJopMGfUxmHjf2VWvFFB` |
| Disable Mint Authority (SK2) | `2zFEsFwvrQoZGafecC7DLqjCcZ93Edq7HSX8QviCwkYir7rbw9qMkMteothPrpXvFXZKmn1H1wfyZN1j49p8U4Y9` |

---

## What I Learned

- Token-2022 group/member extensions replace Metaplex's collection field with a **native, program-level relationship**
- Both `--enable-metadata` and `--enable-group` / `--enable-member` must be declared **at mint creation** — you cannot add them later
- The group extension stores `size` (current members) and `max_size`; wallets and explorers read this to group NFTs together
- This is the Solana version of "schema decisions are forever" — restrictive but trustworthy

---

> *"On Solana there is no central database to join against, so the relationship has to be stamped into the mint accounts themselves."*
> — 100 Days of Solana, Day 45
