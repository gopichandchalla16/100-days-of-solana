# Day 38 — Compliance-Gated Token with Default Frozen Accounts

> **Challenge:** Create a Token-2022 mint where every account starts frozen. Selectively thaw accounts to simulate KYC/compliance approval, and prove that both sender AND recipient must be thawed for any transfer to succeed.

---

## What I Built

A **Compliance-Gated Token** using the `--default-account-state frozen` extension:
- ✅ Every new token account starts **frozen by default**
- ✅ Minting to frozen account **fails** (error `0x11`)
- ✅ Thaw = "compliance approval" — only then can tokens flow
- ✅ Transfer to still-frozen recipient **fails** even if sender is approved
- ✅ Both sides thawed → transfer **succeeds**

---

## Token Details

| Field | Value |
|-------|-------|
| **Mint Address** | `HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY` |
| **Program** | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` (Token-2022) |
| **Extension** | Default Account State (frozen) |
| **Decimals** | 9 |
| **My Token Account** | `2iiYUuxJUXEYKRZQ9e6LsQA63kAY1ofTcYMnVBL82zFk` |
| **Second Wallet** | `BM1PJw7JuYvo5iWDnfW4WeTUJnw1tNPg886rSouFH7VV` |
| **Second Token Account** | `6CTVZNpotkUWSLQWknqxSLekgbgEx2mKds9BLyLZGgwc` |

---

## Steps Executed

### Step 1 — Create Mint with Default Frozen State
```bash
spl-token create-token \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --enable-freeze \
  --default-account-state frozen

# Mint: HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY
# Sig:  JuDmN678g7jquUzDbiXHTVks2aUcvR1tQm9Tnvt3xZm67TEyziWcmLBfTyV1ko3Xnu5R7wusy7DpTAyyLwJeRUj
```

`--enable-freeze` gives us a freeze authority. `--default-account-state frozen` tells the runtime: every new token account for this mint starts locked.

### Step 2 — Create Two Token Accounts (both start frozen)
```bash
spl-token create-account HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY
# My account: 2iiYUuxJUXEYKRZQ9e6LsQA63kAY1ofTcYMnVBL82zFk
# Sig: 2AbYJz5BwhTVEqZi9PwRmMsCeHuYX8ffXCzNrRwKwMrq3NYKW8BzsfmAK6e9hbrLeTPw8QzxjwLD5rDbb23imupe

solana-keygen new --outfile ~/second-wallet.json --no-bip39-passphrase --force
# Second wallet: BM1PJw7JuYvo5iWDnfW4WeTUJnw1tNPg886rSouFH7VV

spl-token create-account HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY \
  --owner ~/second-wallet.json --fee-payer ~/.config/solana/id.json
# Second account: 6CTVZNpotkUWSLQWknqxSLekgbgEx2mKds9BLyLZGgwc
# Sig: 4pav1PAw9YAEQ5QZN3x65M1RF6PEtCj5TLyBoaQoWvqjWzRAWdv3wWLfESzx9BK9u64DZmkZ9cga4o9P1ZEbqaab
```

### Step 3 — Mint to Frozen Account → FAILS ❌
```bash
spl-token mint HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY 100
```

```
Error: ...
  Program log: Instruction: MintToChecked
  Program log: Error: Account is frozen      ⬅ custom program error: 0x11
  Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed
```

> `0x11` = decimal 17 = `AccountFrozen` error code in Token-2022.

### Step 4 — Thaw My Account (simulate KYC approval)
```bash
spl-token thaw 2iiYUuxJUXEYKRZQ9e6LsQA63kAY1ofTcYMnVBL82zFk
# Sig: kiYGWhFX2JAbERNQLf2VXYA6wr9EALTwn42xEGH4uR5wu6zZ1zw3Ep33JwUHcBCVpLzBuXqBABhtnEoavgjg7Fn
```

> `spl-token thaw` takes the **token account address**, NOT the wallet address.

### Step 5 — Mint After Thaw → SUCCEEDS ✅
```bash
spl-token mint HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY 100
# Minting 100 tokens to 2iiYUuxJUXEYKRZQ9e6LsQA63kAY1ofTcYMnVBL82zFk
# Sig: 2kHaat1kXPQv2nMQWbu53vxdBFzwZgsmTmRymadcKHzYSWjPwEFfELNcBadvjUAzN5q59A6PiaPyumY26KaSRiQW
```

### Step 6 — Transfer to Frozen Recipient → FAILS ❌
```bash
spl-token transfer HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY 50 \
  BM1PJw7JuYvo5iWDnfW4WeTUJnw1tNPg886rSouFH7VV --allow-unfunded-recipient
```

```
Error: ...
  Program log: Instruction: TransferChecked
  Program log: Error: Account is frozen      ⬅ recipient still frozen!
  Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0x11
```

> Key insight: **sender being thawed is not enough**. The recipient must also be approved.

### Step 7 — Thaw Second Account, Retry Transfer → SUCCEEDS ✅
```bash
spl-token thaw 6CTVZNpotkUWSLQWknqxSLekgbgEx2mKds9BLyLZGgwc
# Sig: 4CbrURmguLq1LWTXNV854YhEa8TaAokhWVx9QtGyGfPUMoG4GjgryhJdXamg7j4LYY5JjTnXWHnTQvdxVH6Da44

spl-token transfer HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY 50 \
  BM1PJw7JuYvo5iWDnfW4WeTUJnw1tNPg886rSouFH7VV --allow-unfunded-recipient
# Sig: 4SE1oBYYDDK8MoMoyjNBTSSFPUXPBAMJrcWfrNt5mJaJr48fnG25UhZSMA6VYQKU3QTpdzEiHA7N7vV1sxjM1iEG

spl-token accounts --owner BM1PJw7JuYvo5iWDnfW4WeTUJnw1tNPg886rSouFH7VV
# Token: HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY  Balance: 50 ✅
```

---

## Proof Table

| Action | Account State | Result |
|--------|--------------|--------|
| Mint to my account (frozen) | ❄️ Frozen | ❌ `0x11 Account is frozen` |
| Thaw my account | ✅ Thawed | ✅ Approved |
| Mint to my account | ✅ Thawed | ✅ 100 tokens |
| Transfer to second (frozen) | ❄️ Frozen recipient | ❌ `0x11 Account is frozen` |
| Thaw second account | ✅ Thawed | ✅ Approved |
| Transfer to second | ✅ Both thawed | ✅ 50 tokens received |

---

## Key Insight — Both Sides Must Be Approved

This is the critical rule of the Default Account State extension:

> It is not enough for the **sender** to be approved. The **recipient** must also be thawed to receive tokens. This creates a closed system — every participant must pass through the freeze authority's approval before any value can move.

In **Web2** terms, this is like a brokerage where **both** the sender and the receiver must have completed KYC before a wire transfer is allowed — not just the sender.

---

## Web2 vs Solana

| Feature | Web2 | Solana Token-2022 |
|---------|------|-------------------|
| Lock new accounts | App-layer DB flag | `--default-account-state frozen` |
| Unlock (approve) | Backend API call | `spl-token thaw [TOKEN_ACCOUNT]` |
| Enforcement | Your server code | Token Extensions runtime |
| Bypassable by frontend bug? | ✅ Yes | ❌ No — protocol level |
| Composable with other extensions? | ❌ Custom integration | ✅ Works with fees, metadata, interest |

---

## Transactions on Devnet

| Action | Signature |
|--------|-----------|
| Create frozen-default mint | `JuDmN678...` |
| Create my token account | `2AbYJz5B...` |
| Create second token account | `4pav1PAw...` |
| Thaw my account | `kiYGWhFX...` |
| Mint 100 tokens | `2kHaat1k...` |
| Thaw second account | `4CbrURmg...` |
| Transfer 50 to second | `4SE1oBYY...` |

---

*Part of [#100DaysOfSolana](https://github.com/gopichandchalla16/100-days-of-solana) — building in public daily.*
