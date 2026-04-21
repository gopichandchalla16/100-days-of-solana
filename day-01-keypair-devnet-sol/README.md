# Day 1 — Generate a Keypair and Get Devnet SOL

**Challenge:** Generate a new Solana keypair programmatically, fund it with devnet SOL, and verify the balance on Solana Explorer.

---

## What I Did

1. Created a project folder with `@solana/kit` installed
2. Generated a fresh Solana keypair using `generateKeyPairSigner()`
3. Funded the wallet using [faucet.solana.com](https://faucet.solana.com) with devnet SOL
4. Verified the funded balance on [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet)

---

## My Wallet

- **Address:** `HfxgnpDoqzSGfvX9SftvPSdc18TntyYUcAVXxrbsjwMt`
- **Balance:** 3.5 SOL (devnet)
- **Explorer:** [View on Solana Explorer](https://explorer.solana.com/address/HfxgnpDoqzSGfvX9SftvPSdc18TntyYUcAVXxrbsjwMt?cluster=devnet)

---

## What I Learned

- A Solana keypair is like an SSH key pair: public key = your address, private key = your identity proof
- The keypair is generated **entirely on your machine** using the Ed25519 algorithm — no network call needed
- Devnet SOL is free test SOL with no monetary value — used only for development
- The private key lives in memory during script execution; in real apps it must be stored securely
- Web2 analogy: Blockchain = distributed database, Wallet = your account, Smart contract = backend logic

---

## Files

| File | Description |
|------|-------------|
| `create-wallet.mjs` | Generates a new Solana keypair and prints the address |
| `check-balance.mjs` | Checks the SOL balance of a funded wallet address |

---

## Run It

```bash
npm install @solana/kit
node create-wallet.mjs
node check-balance.mjs
```
