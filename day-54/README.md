# Day 54 — Make a Token That Refuses to Move

> **Challenge:** Build a Token-2022 soul-bound badge. Mint it to yourself, then try to transfer it and watch the runtime reject you. The rejection is the feature.

---

## Mint Details

| Field | Value |
|-------|-------|
| **Mint Address** | `BQzJeZVZgkSvAYPj9f1M1apv56P7kggAgPNc9uSq7T5m` |
| **Program** | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` (Token-2022) |
| **Decimals** | 9 |
| **Extension** | `Non-transferable` |
| **My Token Account** | `CHJkEqo4g7CPoq5qfUKRWeoLRrQ1yLd8zGZEWuYqmnYB` |
| **Throwaway Recipient** | `2Mk3SUZAPVfTPFHriDzQRgvFepwiN6LcgfykZfNr1Cyc` |
| **Recipient Token Account** | `5v1M24vPnhrgQUnqtX2ZKe6hgrbGeZ8Q6tK1DSGLKPHi` |
| **Explorer** | [View Mint](https://explorer.solana.com/address/BQzJeZVZgkSvAYPj9f1M1apv56P7kggAgPNc9uSq7T5m?cluster=devnet) |

---

## Commands Run

### Step 1 — Confirm devnet

```bash
solana config set --url https://api.devnet.solana.com
solana balance
# 6.02308244 SOL ✅
```

### Step 2 — Create non-transferable mint

```bash
spl-token create-token --program-2022 --enable-non-transferable
```

**Output:**
```
Creating token BQzJeZVZgkSvAYPj9f1M1apv56P7kggAgPNc9uSq7T5m under program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
Address:  BQzJeZVZgkSvAYPj9f1M1apv56P7kggAgPNc9uSq7T5m
Decimals:  9
Signature: 29h9sXvEtFAsikXKngodXkogDwX5pcNWGnhbvTRrdZRa3uAYFzELQz3L4ryh371wzt25kXzCGgtbiPzCuARTAyXE
```
[View tx](https://explorer.solana.com/tx/29h9sXvEtFAsikXKngodXkogDwX5pcNWGnhbvTRrdZRa3uAYFzELQz3L4ryh371wzt25kXzCGgtbiPzCuARTAyXE?cluster=devnet) ✅

### Step 3 — Create my token account

```bash
spl-token create-account $MINT
```

**Account:** `CHJkEqo4g7CPoq5qfUKRWeoLRrQ1yLd8zGZEWuYqmnYB`
[View tx](https://explorer.solana.com/tx/2LBKzDE4oxsUHv77w6qtX6Ea1BhfgTRhacy52x9aT3W2B8pZ7CfteHfNgP7bDzMLirMg4W4JU5kVkeqTgu3egj5D?cluster=devnet) ✅

### Step 4 — Mint 1 badge token to myself

```bash
spl-token mint $MINT 1
```

**Output:**
```
Minting 1 tokens
  Token: BQzJeZVZgkSvAYPj9f1M1apv56P7kggAgPNc9uSq7T5m
  Recipient: CHJkEqo4g7CPoq5qfUKRWeoLRrQ1yLd8zGZEWuYqmnYB
```
[View tx](https://explorer.solana.com/tx/3yqy1Ut2H3oMBCfGvWV5nxEkY5xaycX5Zu699AkvhGUPKWnmhzMXbCrbXerBZ1pJCdZD2Yh4B8eyPQS6qLKS8Cyc?cluster=devnet) ✅

### Step 5 — Generate throwaway recipient

```bash
solana-keygen new --no-bip39-passphrase --outfile /tmp/recipient.json --force
export RECIPIENT=$(solana-keygen pubkey /tmp/recipient.json)
# Recipient: 2Mk3SUZAPVfTPFHriDzQRgvFepwiN6LcgfykZfNr1Cyc
```

### Step 6 — Create recipient token account, then attempt transfer

```bash
spl-token create-account $MINT --owner $RECIPIENT --fee-payer ~/.config/solana/id.json
spl-token transfer $MINT 1 $RECIPIENT --allow-unfunded-recipient
```

**Recipient token account created:** `5v1M24vPnhrgQUnqtX2ZKe6hgrbGeZ8Q6tK1DSGLKPHi`
[View tx](https://explorer.solana.com/tx/4SidURqqA1DXKCdB9N9dwE1XE22GE8UgPkZdXyyR44ZrA3sXqdsybNCwfPxSTd2rzw9k4UK5gaVDFACL3s1rGi2i?cluster=devnet) ✅

---

## 🚫 The Rejection — This IS the Feature

```
Transfer 1 tokens
  Sender: CHJkEqo4g7CPoq5qfUKRWeoLRrQ1yLd8zGZEWuYqmnYB
  Recipient: 2Mk3SUZAPVfTPFHriDzQRgvFepwiN6LcgfykZfNr1Cyc
  Recipient associated token account: 5v1M24vPnhrgQUnqtX2ZKe6hgrbGeZ8Q6tK1DSGLKPHi

Error: Client(Error { request: Some(SendTransaction), kind: RpcError(
  RpcResponseError {
    code: -32002,
    message: "Transaction simulation failed: Error processing Instruction 0: custom program error: 0x25",
    ...
    logs: [
      "Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb invoke [1]",
      "Program log: Instruction: TransferChecked",
      "Program log: Transfer is disabled for this mint",   ← THE PROOF
      "Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0x25"
    ]
  }
})
```

| Error field | Value | Meaning |
|-------------|-------|---------|
| **Program** | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` | Token-2022 itself rejected it |
| **Instruction** | `TransferChecked` | The transfer instruction hit the extension check |
| **Log message** | `Transfer is disabled for this mint` | Non-transferable extension fired |
| **Error code** | `0x25` (decimal 37) | `NonTransferable` error in Token-2022 |
| **Compute units** | 1570 / 1570 | Rejected immediately, full budget consumed |

---

## Step 8 — Mint Audit (spl-token display)

```
SPL Token Mint
  Address: BQzJeZVZgkSvAYPj9f1M1apv56P7kggAgPNc9uSq7T5m
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 1000000000
  Decimals: 9
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: (not set)
Extensions
  Non-transferable          ← confirmed on-chain ✅
```

---

## Transaction Summary

| Step | Action | Signature | Status |
|------|--------|-----------|--------|
| 1 | Create non-transferable mint | [29h9sX...yXE](https://explorer.solana.com/tx/29h9sXvEtFAsikXKngodXkogDwX5pcNWGnhbvTRrdZRa3uAYFzELQz3L4ryh371wzt25kXzCGgtbiPzCuARTAyXE?cluster=devnet) | ✅ |
| 2 | Create my token account | [2LBKzD...gj5D](https://explorer.solana.com/tx/2LBKzDE4oxsUHv77w6qtX6Ea1BhfgTRhacy52x9aT3W2B8pZ7CfteHfNgP7bDzMLirMg4W4JU5kVkeqTgu3egj5D?cluster=devnet) | ✅ |
| 3 | Mint 1 badge token | [3yqy1U...Cyc](https://explorer.solana.com/tx/3yqy1Ut2H3oMBCfGvWV5nxEkY5xaycX5Zu699AkvhGUPKWnmhzMXbCrbXerBZ1pJCdZD2Yh4B8eyPQS6qLKS8Cyc?cluster=devnet) | ✅ |
| 4 | Create recipient token account | [4SidUR...i2i](https://explorer.solana.com/tx/4SidURqqA1DXKCdB9N9dwE1XE22GE8UgPkZdXyyR44ZrA3sXqdsybNCwfPxSTd2rzw9k4UK5gaVDFACL3s1rGi2i?cluster=devnet) | ✅ |
| 5 | Attempt transfer → **REJECTED** | — | 🚫 `0x25` |

---

## What I Learned

- `--enable-non-transferable` is a **one-shot flag** at mint creation. It cannot be added later and cannot be removed. The rule is baked into the mint account forever.
- The error came from **`Program log: Transfer is disabled for this mint`** — not from the CLI, not from the RPC, but from the Token-2022 program itself running inside the validator. There is no way around it.
- Error code `0x25` = decimal 37 = `NonTransferable` in the Token-2022 error enum. Reading error codes is part of on-chain debugging.
- This is the first Token-2022 extension that is **not about money**. Fees and interest are quantitative. Non-transferable is qualitative — it turns a fungible primitive into an identity object (soul-bound token / on-chain badge).
- Web2 equivalent: a `NOT UPDATABLE` constraint enforced at the application layer. The difference: on Solana, the rule lives on the asset inside the program inside the validator. There is no way to talk to the database "around" the application.

---

> *"The failed transfer is not a bug. It is the entire product."*
> — 100 Days of Solana, Day 54
