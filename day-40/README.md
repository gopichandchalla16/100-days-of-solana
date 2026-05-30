# Day 40 — Revocable Credential Token
### Non-Transferable + Permanent Delegate + Metadata Extensions

> **Challenge:** Build a soulbound credential token that cannot be transferred between wallets, but can be silently revoked by the issuing authority at any time using the permanent delegate extension.

---

## Token Details

| Field | Value |
|-------|-------|
| **Mint Address** | `BArQDYofmfB5Z8B3LeaAVSVHPtkPygVHCpKoHzS1rcPf` |
| **Program** | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` (Token-2022) |
| **Decimals** | 0 (whole units — you either have the credential or you don't) |
| **Extensions** | Non-Transferable + Permanent Delegate + Metadata |
| **Token Name** | Solana Dev Credential |
| **Symbol** | CRED |
| **Recipient Wallet** | `Brfj7ehXYsbcZcv8Rt349FovQGzorBzyvm8uzSrQGMrb` |
| **Recipient Token Account** | `HznADuoAqHR4w7CTopajoKc9QSrdU2r2y1ueKk4T3Bhz` |
| **Mint / Permanent Delegate Authority** | `AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y` |

---

## Steps Executed

### Step 1 — Create Mint with 3 Extensions
```bash
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token \
  --decimals 0 \
  --enable-non-transferable \
  --enable-permanent-delegate \
  --enable-metadata

# Mint: BArQDYofmfB5Z8B3LeaAVSVHPtkPygVHCpKoHzS1rcPf
# Sig:  4V72n1oQt6EtRpPFaLSpH1gSMeYKvhPFYR7sQH7UgDpLFA8RBXiuvMFuPhoCuNUmXquotWAQhuU5kx1iRCVghYMq
```

> `--decimals 0` = credentials are whole units. `--enable-metadata` requires running `initialize-metadata` next.

### Step 2 — Initialize Metadata
```bash
spl-token initialize-metadata BArQDYofmfB5Z8B3LeaAVSVHPtkPygVHCpKoHzS1rcPf \
  "Solana Dev Credential" \
  "CRED" \
  "https://example.com/credential.json"

# Sig: 3n6NcXW3XnGygSgTrc2aPSYKi3QUZz8sjM7BzmaKWuKD2haEyu97WE5558Wx7Q3MPHrSo9tDemiP3xH1Dx4MgjrK
```

### Step 3 — Create Recipient + Mint 1 Credential
```bash
solana-keygen new --outfile ~/recipient-wallet.json --no-bip39-passphrase --force
# Recipient wallet: Brfj7ehXYsbcZcv8Rt349FovQGzorBzyvm8uzSrQGMrb

RECIPIENT=$(solana-keygen pubkey ~/recipient-wallet.json)

spl-token create-account BArQDYofmfB5Z8B3LeaAVSVHPtkPygVHCpKoHzS1rcPf \
  --owner $RECIPIENT \
  --fee-payer ~/.config/solana/id.json \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
# Token account: HznADuoAqHR4w7CTopajoKc9QSrdU2r2y1ueKk4T3Bhz
# Sig: 5rLuDVepdsGxYQEejJdHgETWmb8s1SaJdfReegRBjJwmgorBEgPom9vVtvAWTK655mWKGbhyGiAcgJnYeQBeZGvQ

spl-token mint BArQDYofmfB5Z8B3LeaAVSVHPtkPygVHCpKoHzS1rcPf 1 \
  --recipient-owner $RECIPIENT \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
# Sig: 2JD5iysSJm7FFR93v1xuDMgJQhzminwYASqZqv7aZW89YFMuem8XWhHaNSMhSqYSsnjFSSQdbDixsiSNzuR5FVYg
```

### Step 4 — Try to Transfer → FAILS ❌ (Non-Transferable)
```bash
solana-keygen new --outfile ~/third-party.json --no-bip39-passphrase --force
# Third party: 63gHWe6eRrLa6ZxsCnGWpw9z2RtueyW3Ew2iNpPR74Bh

THIRD_PARTY=$(solana-keygen pubkey ~/third-party.json)

spl-token transfer BArQDYofmfB5Z8B3LeaAVSVHPtkPygVHCpKoHzS1rcPf 1 $THIRD_PARTY \
  --owner ~/recipient-wallet.json \
  --fee-payer ~/.config/solana/id.json \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --fund-recipient --allow-unfunded-recipient
```

```
Error: ...
  Program log: Instruction: TransferChecked
  Program log: Transfer is disabled for this mint    <- error 0x25
  Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0x25
```

> `0x25` = decimal 37 = `NonTransferable` error in Token-2022.

**Also notable in the logs:**
```
Program log: Warning: Mint has a permanent delegate,
so tokens in this account may be seized at any time
```
> The runtime warns new token accounts about the permanent delegate at creation — full transparency for holders.

### Step 5 — Revoke Credential (Burn via Permanent Delegate) ✅
```bash
spl-token burn HznADuoAqHR4w7CTopajoKc9QSrdU2r2y1ueKk4T3Bhz 1 \
  --owner ~/.config/solana/id.json \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
# Sig: Ez16sWXU9zrkfcNubN85g5urzUn5jniJtQwipr5CgpLpAyXnWtosoTKShVVa1h9k8ZePuP5h4ZwT5WZ38DfyZAc

spl-token balance BArQDYofmfB5Z8B3LeaAVSVHPtkPygVHCpKoHzS1rcPf \
  --owner $RECIPIENT \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
# Output: 0  -- credential revoked
```

> The issuer burned the token **without the recipient's signature**.

### Step 6 — Inspect Mint (All 3 Extensions Confirmed) ✅
```
SPL Token Mint
  Address: BArQDYofmfB5Z8B3LeaAVSVHPtkPygVHCpKoHzS1rcPf
  Supply: 0  Decimals: 0
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: (not set)
Extensions
  Permanent delegate: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Non-transferable
  Metadata Pointer:
    Authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Metadata address: BArQDYofmfB5Z8B3LeaAVSVHPtkPygVHCpKoHzS1rcPf
  Metadata:
    Name: Solana Dev Credential
    Symbol: CRED
    URI: https://example.com/credential.json
```

---

## Proof Table

| Action | Result |
|--------|--------|
| Create mint with 3 extensions | ✅ `BArQDYof...` |
| Initialize metadata (CRED) | ✅ On-chain name/symbol/URI |
| Create recipient + mint 1 token | ✅ `HznADuoA...` holds 1 CRED |
| Transfer to third party | ❌ `0x25 Transfer is disabled for this mint` |
| Burn via permanent delegate | ✅ No recipient signature needed |
| Recipient balance after revoke | ✅ `0` |
| `spl-token display` | ✅ All 3 extensions visible |

---

## Key Insights

### Non-Transferable vs Permanent Delegate

| Extension | What it does |
|-----------|--------------|
| `--enable-non-transferable` | Blocks ALL transfers after minting. Token is permanently bound to the receiving wallet. |
| `--enable-permanent-delegate` | Gives the authority the power to burn tokens from ANY account without the holder's signature. |

Together: **revocable soulbound token** — holder cannot move it, issuer can take it back.

### Error Code 0x25
`custom program error: 0x25` = decimal 37 = `NonTransferableError` in Token-2022. Fires on any `TransferChecked` instruction when the non-transferable extension is active.

---

## Web2 Analogy

| Feature | Web2 | Solana Token-2022 |
|---------|------|-------------------|
| Soulbound credential | Certificate tied to identity | `--enable-non-transferable` |
| Issuer revocation | Employer revokes access badge | `--enable-permanent-delegate` + burn |
| Human-readable info | Certificate label | `--enable-metadata` |
| Revoke without holder consent | Admin deletes DB record | Burn via permanent delegate |
| Runtime transparency | ToS disclosure | On-chain warning at account creation |

---

*Part of [#100DaysOfSolana](https://github.com/gopichandchalla16/100-days-of-solana) — building in public daily.*
