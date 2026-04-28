# Day 5 — Explore Different Wallet Types

## Challenge
Compare three wallet types hands-on: CLI wallet, browser extension wallet, and mobile wallet. Understand the tradeoffs each makes between convenience, security, and programmability.

---

## Wallet Comparison

| Wallet Type | Key Storage | Hot/Cold | Setup Speed | Security Level | Best Use Case |
|-------------|-------------|----------|-------------|----------------|---------------|
| CLI (`id.json`) | Plaintext file on disk | Hot | Fastest | Low | Devnet scripting & testing |
| Browser (Phantom) | Encrypted in browser storage | Hot | Fast | Medium | dApp interactions |
| Mobile (Phantom) | Hardware-backed secure storage | Hot | Medium | High | Personal daily use |
| Hardware (Ledger) | Never leaves the device | Cold | Slow | Highest | Long-term value storage |
| Multisig (Squads) | Distributed across signers | Hot | Slowest | Highest | DAO / team treasury |

---

## My Reflection

### CLI Wallet — Most Convenient
My CLI wallet lives at `~/.config/solana/id.json` as a plaintext JSON file. No password, no confirmation popup — just instant signing. This is perfect for devnet work, testing scripts, and running 500 automated transactions. But it is the least secure: anyone who reads that file can sign as me. I would never store real SOL here.

```bash
solana address
solana balance
```

### Browser Wallet (Phantom) — Best Balance
Setting up Phantom on Day 4 showed me what real security layers look like:
- A password encrypts the key at rest in browser storage
- A 12-word seed phrase enables recovery from any device
- Every transaction triggers an approval popup — you see exactly what you are signing

This is my go-to for connecting to dApps. The private key never leaves the wallet extension.

### Mobile Wallet (Phantom Mobile) — Most Secure for Personal Use
The mobile experience adds biometric auth (fingerprint / Face ID) on top of everything the browser wallet does. The seed phrase backup flow is identical — same standard across all non-custodial wallets.

I sent **0.01 devnet SOL** from my mobile wallet to my CLI wallet address and verified with:
```bash
solana balance
```
This was my first cross-wallet transfer — same network, different keypairs, different security models.

---

## Key Questions Answered

**Which was fastest to set up?** CLI — one command, done.

**Which felt safest?** Mobile wallet — biometric auth + hardware-backed storage.

**Where is the private key stored?**
- CLI: `~/.config/solana/id.json` (plaintext)
- Browser: Encrypted in Chrome/Firefox extension storage
- Mobile: OS secure enclave / hardware-backed storage

**If my laptop caught fire, which could I recover?**
- Browser wallet ✅ — seed phrase recovery from any device
- Mobile wallet ✅ — seed phrase recovery
- CLI ❌ — gone unless I backed up the JSON file

**For 500 automated test transactions?** CLI wallet — no popups, fully scriptable.

**For $10,000 in SOL?** Hardware wallet (Ledger) — key never leaves the device.

---

## What I Learned
All wallets manage the same underlying concept — a keypair. What differs is **where and how they store the private key**. The best wallet depends entirely on the threat model and the use case. Most Solana developers use at least two: CLI for development, and browser/hardware for real value.

---

## Part of
[100 Days of Solana — MLH Challenge](https://www.mlh.com/events/100-days-of-solana/challenges)
