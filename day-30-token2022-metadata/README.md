# Day 30 — Design Sustainable Token Incentive Systems

> **100 Days of Solana** · Arc: Token Fundamentals

## What I Did

Created a branded Token-2022 token with on-chain metadata, minted 1000 tokens, and transferred 250 to a second wallet.

## Token Details

| Field | Value |
|-------|-------|
| **Mint Address** | `3zX5oyL9skYKWo2ZoUHgBwLpG9BzLe1ViuXLgH8joqFt` |
| **Program** | Token Extensions (Token-2022) `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` |
| **Token Name** | `100DaysCoin` |
| **Symbol** | `HUNDO` |
| **Decimals** | `6` |
| **Metadata URI** | https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json |
| **My Token Account** | `GuE6wQVVkexefxbx4YLFcbd5YvYhxSxkvUhdtWi4L52h` |
| **My Balance** | `750 HUNDO` |
| **Second Wallet** | `GLyRe2CitW4xErgvn1AE17nzG3ZCVRrxQ7vx8BM9Eats` |
| **Recipient Token Account** | `Bt2sojmdLvz9jykrpCnfkJ5wCGwhQh1474nEt3v5ZAnT` |
| **Recipient Balance** | `250 HUNDO` |

## Commands Run

```bash
# Step 1: Create Token-2022 mint with metadata enabled
spl-token create-token \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --enable-metadata \
  --decimals 6
# → 3zX5oyL9skYKWo2ZoUHgBwLpG9BzLe1ViuXLgH8joqFt

# Step 2: Initialize on-chain metadata
spl-token initialize-metadata 3zX5oyL9skYKWo2ZoUHgBwLpG9BzLe1ViuXLgH8joqFt \
  "100DaysCoin" "HUNDO" \
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json"

# Step 3: Create associated token account
spl-token create-account 3zX5oyL9skYKWo2ZoUHgBwLpG9BzLe1ViuXLgH8joqFt
# → GuE6wQVVkexefxbx4YLFcbd5YvYhxSxkvUhdtWi4L52h

# Step 4: Mint 1000 tokens
spl-token mint 3zX5oyL9skYKWo2ZoUHgBwLpG9BzLe1ViuXLgH8joqFt 1000

# Step 5: Check balance
spl-token balance 3zX5oyL9skYKWo2ZoUHgBwLpG9BzLe1ViuXLgH8joqFt
# → 1000

# Step 6: Generate second wallet
solana-keygen new --outfile ~/second-wallet.json --no-bip39-passphrase
# → GLyRe2CitW4xErgvn1AE17nzG3ZCVRrxQ7vx8BM9Eats

# Step 7: Transfer 250 tokens to second wallet
spl-token transfer 3zX5oyL9skYKWo2ZoUHgBwLpG9BzLe1ViuXLgH8joqFt 250 \
  $(solana-keygen pubkey ~/second-wallet.json) \
  --fund-recipient --allow-unfunded-recipient
# Recipient ATA: Bt2sojmdLvz9jykrpCnfkJ5wCGwhQh1474nEt3v5ZAnT

# Step 8: Verify both balances
spl-token balance 3zX5oyL9skYKWo2ZoUHgBwLpG9BzLe1ViuXLgH8joqFt
# → 750
spl-token balance --owner $(solana-keygen pubkey ~/second-wallet.json) 3zX5oyL9skYKWo2ZoUHgBwLpG9BzLe1ViuXLgH8joqFt
# → 250
```

## Transaction Signatures

| Action | Signature |
|--------|----------|
| Create Token-2022 Mint | `4L9VjvpqKZN671BpzHjQXHSoCi8GRuxr3muDvS2weccbwNBhj7m9fDJR41RDbwwjcna4nuJmH7RL598SYnbRSrHR` |
| Initialize Metadata | `3qWRfZiCtnszfH7Jx35sjunZkwJ2wviyCmvwsE5wmTiKM1UpQQPsxjqfCXpVMmJLDfMcrXLZZNNTXiqbH3zvXuex` |
| Create Token Account | `PFRBev1yDoW2u7vFbABjrTzuB7GkJCDvpgPhZQ59R3mM4MutFrmgFxmxyC9DNwXaQJuszKJqtDdkoKv6763rdPE` |
| Mint 1000 | `5nPt9pD9sqPH3T3MhxJw1AmJpPtMqxPz7u7uzJ7iUmB3xUUGi5dWjD1ss2JDH8aTQjm9rhyb9HvY8R8qJiqUo7xV` |
| Transfer 250 | `5YD162KK9ps4gb6x3a41FWv6JNYRVcdrLEMGsBUQVWUxNA4G6AndoQ1GiDR7LRyZ4mkKaK4BhbDhRCo2YKWRpQuC` |

## Key Learnings

- **Token-2022 vs SPL Token**: Token Extensions Program embeds metadata directly in the mint account — no separate Metaplex account needed
- **`--enable-metadata` flag**: Activates the metadata extension at mint creation time
- **`initialize-metadata`**: Writes name, symbol, and URI on-chain in a single tx
- **6 decimals**: Common choice for fungible tokens (vs 9 for Day 29's basic SPL token)
- **`--fund-recipient`**: Automatically creates recipient's ATA and covers rent from sender's wallet
- **Associated Token Accounts (ATA)**: Deterministic address derived from wallet + mint — no need to share custom addresses

## Web2 Analogy

| Web2 Concept | Solana Equivalent |
|---|---|
| Reward program definition | Mint account |
| User balance record | Associated Token Account |
| Transfer API endpoint | `spl-token transfer` instruction |
| Branding / display name | On-chain metadata (name, symbol, URI) |

## Devnet Explorer

[View Mint on Solana Explorer](https://explorer.solana.com/address/3zX5oyL9skYKWo2ZoUHgBwLpG9BzLe1ViuXLgH8joqFt?cluster=devnet)

---

*Day 30 of 100 — #100DaysOfSolana by [@GopichandAI](https://twitter.com/GopichandAI)*
