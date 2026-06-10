# Day 51 — Send Your Fee-Bearing Token and Harvest the Withheld Fees

> **Challenge:** Transfer your fee-bearing Token-2022 mint, watch the protocol withhold its fee on-chain, then withdraw those fees back with a single CLI command. No middleware. No webhook. The mint did the work.

---

## Token Used

| Field | Value |
|-------|-------|
| **Mint Address** | `HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr` |
| **Transfer Fee** | 100 bps (1%) |
| **Sender Token Account** | `75Wzc54YESWxxfWTCWFcLkR4sZ8DJhHh4fmLzGv1FBzs` |
| **Recipient Wallet** | `Gjxi79WuX8DwR4A3VtXUZ9FyA9H4HWm2JtdqM6zuLdGs` |
| **Recipient Token Account** | `DwxEvr91pxqKguMJuVmfMugn6J7AMmukctBiAt2rADxc` |
| **Explorer** | [View Mint](https://explorer.solana.com/address/HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr?cluster=devnet) |

---

## Commands Run

### Step 1 — Mint 1,000,000 fresh tokens
```bash
spl-token mint $MINT 1000000
```
**Signature:** [24ahsa...EGQ3i](https://explorer.solana.com/tx/24ahsaJG4wJzdd4iPeW5GeTbAgeKPK2dgkGnUJQB77sEHrAFjZWBKcBCmrrXkmdczF7hAxX4MrMRyQeoSfZEGQ3i?cluster=devnet) ✅

---

### Step 2 — Generate recipient keypair
```bash
solana-keygen new --no-bip39-passphrase --outfile recipient.json
export RECIPIENT=$(solana address -k recipient.json)
```
**Recipient:** `Gjxi79WuX8DwR4A3VtXUZ9FyA9H4HWm2JtdqM6zuLdGs`

---

### Step 3 — Create recipient’s token account (fee-payer: us)
```bash
spl-token create-account $MINT \
  --owner $RECIPIENT \
  --fee-payer ~/.config/solana/id.json
```
**Account:** `DwxEvr91pxqKguMJuVmfMugn6J7AMmukctBiAt2rADxc`
**Signature:** [3NE1Gy...zBay](https://explorer.solana.com/tx/3NE1GybbzZ325kLtga5GDfy1AKPzZKaW3eNyWzHcTpaybUSDosBBDX39DBd4NiokfpHwLp6oUvQiQaundtU7zBay?cluster=devnet) ✅

---

### Step 4 — Transfer 1000 tokens (1% fee expected = 10 tokens)
```bash
spl-token transfer \
  --expected-fee 10 \
  $MINT 1000 $RECIPIENT \
  --allow-unfunded-recipient
```
**Signature:** [4qLV1a...nG8F](https://explorer.solana.com/tx/4qLV1ahnk7Y7WNMuZSmTJphed2udpQbEdBzf83KCkYQJMeXsWAWGHZ7iXq9pegeNPBt6DPYddDUrr6opp3WbnG8F?cluster=devnet) ✅

**Result:**
- Recipient spendable balance: **990 tokens**
- Protocol withheld: **10 tokens** (sitting in `withheld_amount` on recipient’s account)

---

### Step 5 — Display recipient’s token account (fee withheld confirmed)
```bash
spl-token display DwxEvr91pxqKguMJuVmfMugn6J7AMmukctBiAt2rADxc
```

**Output:**
```
SPL Token Account
  Address: DwxEvr91pxqKguMJuVmfMugn6J7AMmukctBiAt2rADxc
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Balance: 990
  Decimals: 6
  Mint: HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr
  Owner: Gjxi79WuX8DwR4A3VtXUZ9FyA9H4HWm2JtdqM6zuLdGs
  State: Initialized
  Delegation: (not set)
  Close authority: (not set)
Extensions:
  Immutable owner
  Transfer fees withheld: 10000000   ← 10 tokens withheld by protocol ✅
```

---

### Step 6 — Withdraw withheld fees to our account
```bash
spl-token withdraw-withheld-tokens $MY_TA $RECIPIENT_TA
```
**Signature:** [4XMtzG...ENBi](https://explorer.solana.com/tx/4XMtzGaz2ZosuSRTsoF78FfSaFReTCWqzV2YoqSZit31ZqtjNDX4evdBnzKpoc4Dowdv1YctMTpKgD8c4Z2EXNBi?cluster=devnet) ✅

---

### Step 7 — Confirm loop closed
```bash
spl-token display $RECIPIENT_TA
spl-token balance $MINT
```

**Output:**
```
Extensions:
  Immutable owner
  Transfer fees withheld: 0          ← fees withdrawn ✅

1000010                              ← our balance: +10 reclaimed ✅
```

---

## Transaction History

| Step | Action | Signature | Status |
|------|--------|-----------|--------|
| 1 | Mint 1,000,000 tokens | [24ahsa...EGQ3i](https://explorer.solana.com/tx/24ahsaJG4wJzdd4iPeW5GeTbAgeKPK2dgkGnUJQB77sEHrAFjZWBKcBCmrrXkmdczF7hAxX4MrMRyQeoSfZEGQ3i?cluster=devnet) | ✅ |
| 2 | Create recipient token account | [3NE1Gy...zBay](https://explorer.solana.com/tx/3NE1GybbzZ325kLtga5GDfy1AKPzZKaW3eNyWzHcTpaybUSDosBBDX39DBd4NiokfpHwLp6oUvQiQaundtU7zBay?cluster=devnet) | ✅ |
| 3 | Transfer 1000 (990 received, 10 withheld) | [4qLV1a...nG8F](https://explorer.solana.com/tx/4qLV1ahnk7Y7WNMuZSmTJphed2udpQbEdBzf83KCkYQJMeXsWAWGHZ7iXq9pegeNPBt6DPYddDUrr6opp3WbnG8F?cluster=devnet) | ✅ |
| 4 | Withdraw withheld fees | [4XMtzG...ENBi](https://explorer.solana.com/tx/4XMtzGaz2ZosuSRTsoF78FfSaFReTCWqzV2YoqSZit31ZqtjNDX4evdBnzKpoc4Dowdv1YctMTpKgD8c4Z2EXNBi?cluster=devnet) | ✅ |

---

## The Full Fee Lifecycle

```
1. TRANSFER
   Sender: 75Wzc5...  sends 1000 tokens
   ↓
   Token-2022 checks TransferFeeConfig on mint
   Fee = 1000 × 100bps / 10000 = 10 tokens
   ↓
2. WITHHOLD
   Recipient: DwxEvr...  receives 990 tokens (spendable)
   withheld_amount = 10 tokens (locked, untouchable by recipient)
   ↓
3. WITHDRAW
   Withdrawal authority (AWKYsC...) runs withdraw-withheld-tokens
   10 tokens move from withheld_amount → our token account
   withheld_amount = 0
   Our balance: 1000000 → 1000010 ✅
```

---

## What I Learned

- The `withheld_amount` field lives on the **recipient’s token account** — not on the sender’s, not on the mint. The fee sits there, locked, untouchable by the recipient.
- `--expected-fee 10` acts as a safety check — the transfer aborts if the fee math doesn’t match. This is a runtime guard, not just documentation.
- `withdraw-withheld-tokens` is a single command that drains the withheld balance from one or many accounts into a treasury account. At scale you’d pass dozens of accounts at once.
- The Web2 equivalent: cron job + payments table + treasury transfer. On Solana: one CLI command. The protocol did all the accounting automatically at transfer time.
- `--allow-unfunded-recipient` is required when the recipient wallet has no SOL but their token account already exists — because the CLI defaults to funding the recipient, but there’s nothing to fund here.

---

> *"You configured a mint, and the runtime did the rest — every time, for every transfer, forever."*
> — 100 Days of Solana, Day 51
