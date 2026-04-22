# Day 2 — Create a Persistent Wallet and Check Its Balance

**Challenge:** Build a script that generates a Solana keypair, saves it to `wallet.json`, reloads the same wallet on subsequent runs, and checks its devnet SOL balance.

---

## What I Did

1. Created `persistent-wallet.mjs` using `@solana/kit`
2. Used `generateKeyPairSigner(true)` to generate an extractable keypair
3. Exported private key using `pkcs8` format (taking last 32 bytes)
4. Saved the 64-byte keypair to `wallet.json`
5. On subsequent runs, loaded the same wallet with `createKeyPairSignerFromBytes`
6. Checked devnet balance via RPC on each run

---

## My Wallet

- **Address:** `9uE8d5qFwLngVGgRjUcAPe1KAUranHZaBDQVusAjVi53`
- **Balance:** 1 SOL (devnet)
- **Explorer:** [View on Solana Explorer](https://explorer.solana.com/address/9uE8d5qFwLngVGgRjUcAPe1KAUranHZaBDQVusAjVi53?cluster=devnet)

---

## Two Run Proof

**Run 1 (First time):**
```
Created new wallet: 9uE8d5qFwLngVGgRjUcAPe1KAUranHZaBDQVusAjVi53
Saved to wallet.json

Address: 9uE8d5qFwLngVGgRjUcAPe1KAUranHZaBDQVusAjVi53
Balance: 0 SOL
```

**Run 2 (After airdrop):**
```
Loaded existing wallet: 9uE8d5qFwLngVGgRjUcAPe1KAUranHZaBDQVusAjVi53

Address: 9uE8d5qFwLngVGgRjUcAPe1KAUranHZaBDQVusAjVi53
Balance: 1 SOL
```

---

## What I Learned

- `generateKeyPairSigner(true)` makes the keypair extractable — required for saving to a file
- Ed25519 private keys cannot be exported as `raw` in Node.js — use `pkcs8` and take the last 32 bytes
- The PKCS#8 format adds a 16-byte header; the actual key material is in the final 32 bytes
- `wallet.json` holds your private key — **never commit it to GitHub** (added to `.gitignore`)
- `createKeyPairSignerFromBytes` reconstructs the same signer from saved bytes across runs
- Web2 analogy: Day 1 was manually creating a user in a DB admin tool; Day 2 is building the signup API

---

## Run It

```bash
npm install
node persistent-wallet.mjs
```

> ⚠️ `wallet.json` contains your private key. It is in `.gitignore` and must never be committed.

---

## Resources

- [Solana Kit Keypairs Guide](https://solanakit.com/docs/concepts/keypairs)
- [Solana Kit Signers Guide](https://solanakit.com/docs/concepts/signers)
- [Solana Faucet](https://faucet.solana.com/)
