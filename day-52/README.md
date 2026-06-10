# Day 52 — Stack Interest Accrual on Top of Your Fee-Bearing Token

> **Challenge:** Stack transfer fees and interest on one Token-2022 mint to see how Solana lets a token charge when it moves AND grow while it sits still. One mint, one `create-token` command, two behaviors.

---

## Multi-Extension Mint

| Field | Value |
|-------|-------|
| **Mint Address** | `A6TAeNgxBVwYna8NqQVmBpQzjVYKoZA3e68yMvoVVUva` |
| **Program** | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` (Token-2022) |
| **Decimals** | 6 |
| **Transfer Fee** | 100 bps (1%) |
| **Interest Rate** | 5000 bps (50% APR) |
| **My Token Account** | `2JkpruXbHZt9nCiS6wfnZJqrfVc3iEFkjw1jPpvt1Urn` |
| **Recipient Wallet** | `4acX6DLYJRTsL7AzfH7giwcC6UYd3thkxwYbCvrvV8wY` |
| **Recipient Token Account** | `7vKBaoQDJp914UBSRNBVm8a3aoPkRVwfs6vvaeyDR6Kx` |
| **Explorer** | [View Mint](https://explorer.solana.com/address/A6TAeNgxBVwYna8NqQVmBpQzjVYKoZA3e68yMvoVVUva?cluster=devnet) |

---

## Commands Run

### Step 1 — Create multi-extension mint (fees + interest in one command)

```bash
spl-token create-token \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --decimals 6 \
  --transfer-fee-basis-points 100 \
  --transfer-fee-maximum-fee 1000000 \
  --interest-rate 5000
```

**Mint:** `A6TAeNgxBVwYna8NqQVmBpQzjVYKoZA3e68yMvoVVUva`
**Signature:** [5udMXZ...vBw](https://explorer.solana.com/tx/5udMXZczkSp3avz8bUxPpWUFVK3dtsm2qXfAZ87xQGyaxn6nGYba7YVHJH9dkzLZP94y4Ma9RNQVf8LYqCYXuvBw?cluster=devnet) ✅

---

### Step 2 — Verify both extensions on the mint

```bash
spl-token display $MINT
```

**Output:**
```
SPL Token Mint
  Address: A6TAeNgxBVwYna8NqQVmBpQzjVYKoZA3e68yMvoVVUva
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 0
  Decimals: 6
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: (not set)
Extensions
  Interest-bearing:
    Current rate: 5000bps          ← 50% APR ✅
    Average rate: 5000bps
    Rate authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Transfer fees:
    Current fee: 100bps            ← 1% fee ✅
    Current maximum: 1000000000000
    Config authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withdrawal authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withheld fees: 0
```

> **Both TLV entries confirmed on the same mint account** ✅

---

### Step 3 — Create token account + mint 1,000,000 supply

```bash
spl-token create-account $MINT   # → 2JkpruXbHZt9nCiS6wfnZJqrfVc3iEFkjw1jPpvt1Urn
spl-token mint $MINT 1000000
```

**Signature (mint):** [2wsAt1...Yv4m](https://explorer.solana.com/tx/2wsAt1JUrzmVv4G2Q1vDcGh5h6nD3CgJjbs5GpAUd3nAHAH2VEgDsc1B2tafKYmbspBJBN3caonmUWgkRsT3Yv4m?cluster=devnet) ✅

---

### Step 4 — Snapshot UI amount twice (30 seconds apart) 📸

```bash
spl-token accounts $MINT --verbose | awk 'NR==3'
sleep 30
spl-token accounts $MINT --verbose | awk 'NR==3'
```

**Result — no transaction ran between these two reads:**
```
T=0s:   1000002.170696
T=30s:  1000002.661876
                  ↑
          +0.491180 tokens gained in 30 seconds
          (50% APR ÷ 365 days ÷ 86400 seconds × 30s × 1,000,000 ≈ 0.475)
```

> **Interest is a VIEW, not a balance update.** The raw amount in storage never changed. Token-2022 computes the UI amount on the fly from the network clock and the rate stored on the mint. ✅

---

### Step 5 — Create recipient + fund + transfer 1000 tokens

```bash
solana-keygen new --no-bip39-passphrase --outfile ~/recipient.json
RECIPIENT=$(solana-keygen pubkey ~/recipient.json)
solana transfer $RECIPIENT 0.01 --allow-unfunded-recipient
spl-token create-account $MINT --owner $RECIPIENT --fee-payer ~/.config/solana/id.json
spl-token transfer $MINT 1000 $RECIPIENT --expected-fee 10
```

**Recipient:** `4acX6DLYJRTsL7AzfH7giwcC6UYd3thkxwYbCvrvV8wY`
**Recipient Token Account:** `7vKBaoQDJp914UBSRNBVm8a3aoPkRVwfs6vvaeyDR6Kx`

| Tx | Signature | Status |
|----|-----------|--------|
| Fund recipient | [4XZ2ew...hDF](https://explorer.solana.com/tx/4XZ2ewp4QE6frcFEAiTcrgdgQw7kDxLLAW4vgq5TvepURWtUWk5aR3wmTSh6GCoUpHXAfnTFYgX3cawv2xSDnhDF?cluster=devnet) | ✅ |
| Create recipient TA | [3z72cV...zWW](https://explorer.solana.com/tx/3z72cVjxSxHqfW4DMDw3EzJagaVrmvrawhXx5Xt3zBdaVNhL6Hkhq1evon4mG6PPL6sZivm6pZ6F1N1cNUT9pzWW?cluster=devnet) | ✅ |
| Transfer 1000 tokens | [3JyyAj...bwq6](https://explorer.solana.com/tx/3JyyAjhzGSVaWY8mb74i1QfAast4bDW3HK8pUNP9QSwoUxgSssE6fwnT1NQ6pCcQqaDgVrCJGLSYwZy1R5twbwq6?cluster=devnet) | ✅ |

---

### Step 6 — Display recipient account (fee withheld + interest both active)

```bash
spl-token display $RECIPIENT_TA
```

**Output:**
```
SPL Token Account
  Address: 7vKBaoQDJp914UBSRNBVm8a3aoPkRVwfs6vvaeyDR6Kx
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Balance: 990
  Decimals: 6
  Mint: A6TAeNgxBVwYna8NqQVmBpQzjVYKoZA3e68yMvoVVUva
  Owner: 4acX6DLYJRTsL7AzfH7giwcC6UYd3thkxwYbCvrvV8wY
  State: Initialized
  Delegation: (not set)
  Close authority: (not set)
Extensions:
  Immutable owner
  Transfer fees withheld: 10000000   ← 10 tokens withheld (fee) ✅
                                        ↑ AND interest clock already ticking on the 990 ✅
```

---

### Step 7 — Withdraw withheld fees

```bash
spl-token withdraw-withheld-tokens $MY_TA $RECIPIENT_TA
```

**Signature:** [41jfmc...osj](https://explorer.solana.com/tx/41jfmcTdkDDjhqNnbseV3CbWknnAApXSJ6gE7TUABPQ2hQm2py7PCVy729vzBksCJdd9wQWN1rSMvNhoxcMowosj?cluster=devnet) ✅

---

## The Key Insight — Two Extensions, Zero Conflict

```
TRANSFER EXTENSION operates on RAW AMOUNT:
  Send 1000 raw tokens
  → Protocol withholds 10 raw tokens (100bps fee)
  → Recipient gets 990 raw tokens in spendable balance
  → 10 raw tokens sit in withheld_amount

INTEREST EXTENSION operates on UI DISPLAY:
  Raw amount stored: 990 (never changes without a tx)
  UI amount shown:   990.xxx (grows every second from network clock)
  Formula: raw_amount × e^(rate × time_elapsed)
  No transaction. No row update. Just math on query.

RESULT: Two extensions, two completely different mechanics, zero conflict.
```

---

## What I Learned

- Token-2022 extensions are **composable TLV entries** in the same byte buffer. Two flags in one `create-token` = two entries in one mint account.
- **Interest is a view, not a balance change.** The raw storage never updated between the two `awk 'NR==3'` calls. The UI amount changed because the CLI re-computes it from the network clock every time you ask.
- The transfer fee operates on the **raw amount**; interest scales the **displayed amount**. They are orthogonal, which is why they compose cleanly.
- Web2 equivalent: microservice for interest + webhook for fees + cron for sweeping + DB reconciliation table. Solana equivalent: two flags at mint creation time.
- `--expected-fee 10` is a **safety assertion**, not just documentation — the instruction aborts if the fee math doesn’t match.

---

## Transaction Summary

| Step | Action | Signature | Status |
|------|--------|-----------|--------|
| 1 | Create multi-extension mint | [5udMXZ...vBw](https://explorer.solana.com/tx/5udMXZczkSp3avz8bUxPpWUFVK3dtsm2qXfAZ87xQGyaxn6nGYba7YVHJH9dkzLZP94y4Ma9RNQVf8LYqCYXuvBw?cluster=devnet) | ✅ |
| 2 | Create my token account | [2eyYq9...hJMu](https://explorer.solana.com/tx/2eyYq9eoYiA7JaWsNFqkAcgHx5SRfzYUgWx8dpnA7zWUp6WoCEGxgFvUmiyZ9uAMKBX7ugR5AcM3etjKbG5whJMu?cluster=devnet) | ✅ |
| 3 | Mint 1,000,000 tokens | [2wsAt1...Yv4m](https://explorer.solana.com/tx/2wsAt1JUrzmVv4G2Q1vDcGh5h6nD3CgJjbs5GpAUd3nAHAH2VEgDsc1B2tafKYmbspBJBN3caonmUWgkRsT3Yv4m?cluster=devnet) | ✅ |
| 4 | Fund recipient wallet | [4XZ2ew...hDF](https://explorer.solana.com/tx/4XZ2ewp4QE6frcFEAiTcrgdgQw7kDxLLAW4vgq5TvepURWtUWk5aR3wmTSh6GCoUpHXAfnTFYgX3cawv2xSDnhDF?cluster=devnet) | ✅ |
| 5 | Create recipient token account | [3z72cV...zWW](https://explorer.solana.com/tx/3z72cVjxSxHqfW4DMDw3EzJagaVrmvrawhXx5Xt3zBdaVNhL6Hkhq1evon4mG6PPL6sZivm6pZ6F1N1cNUT9pzWW?cluster=devnet) | ✅ |
| 6 | Transfer 1000 tokens (990 + 10 withheld) | [3JyyAj...bwq6](https://explorer.solana.com/tx/3JyyAjhzGSVaWY8mb74i1QfAast4bDW3HK8pUNP9QSwoUxgSssE6fwnT1NQ6pCcQqaDgVrCJGLSYwZy1R5twbwq6?cluster=devnet) | ✅ |
| 7 | Withdraw withheld fees | [41jfmc...osj](https://explorer.solana.com/tx/41jfmcTdkDDjhqNnbseV3CbWknnAApXSJ6gE7TUABPQ2hQm2py7PCVy729vzBksCJdd9wQWN1rSMvNhoxcMowosj?cluster=devnet) | ✅ |

---

> *"Two extensions, two completely different mechanics, zero conflict. The mint is the system of record."*
> — 100 Days of Solana, Day 52
