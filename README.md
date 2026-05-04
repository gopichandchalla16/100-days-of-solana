# 100 Days of Solana

> **by Gopichand Challa** — Building in public daily 🚀

My public build log and code for the [100 Days of Solana](https://mlh.link/solana-100) challenge by MLH.
Daily Solana, Web3, and on-chain development — from keypairs to smart contracts.

---

## Progress

![Progress](https://img.shields.io/badge/Progress-12%20%2F%20100%20Days-9945FF?style=for-the-badge&logo=solana&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active%20🔥-success?style=for-the-badge)
![Chain](https://img.shields.io/badge/Chain-Devnet%20%26%20Mainnet-14f195?style=for-the-badge)

```
Day  1  ████████████████████████████████████████  ✅
Day  2  ████████████████████████████████████████  ✅
Day  3  ████████████████████████████████████████  ✅
Day  4  ████████████████████████████████████████  ✅
Day  5  ████████████████████████████████████████  ✅
Day  6  ████████████████████████████████████████  ✅
Day  7  ████████████████████████████████████████  ✅
Day  8  ████████████████████████████████████████  ✅
Day  9  ████████████████████████████████████████  ✅
Day 10  ████████████████████████████████████████  ✅
Day 11  ████████████████████████████████████████  ✅
Day 12  ████████████████████████████████████████  ✅
Day 13  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ⏳
...
Day100  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ⏳

[████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 12%
```

---

## Challenge Log

### 📅 Week 1 — Identity & Wallets

| Day | Challenge | Key Concept | Status |
|-----|-----------|-------------|--------|
| [Day 1](./day-01-keypair-devnet-sol/) | Generate a keypair & get devnet SOL | Public/private keypair, airdrop | ✅ Done |
| [Day 2](./day-02-persistent-wallet/) | Create a persistent wallet & check balance | Saving keypair to file, reusing identity | ✅ Done |
| [Day 3](./day-03-sol-and-lamports/) | Understand SOL and Lamports | 1 SOL = 1,000,000,000 lamports | ✅ Done |
| [Day 4](./day-04-browser-wallet/) | Connect a browser wallet — live address & balance | Wallet Standard, browser integration | ✅ Done |
| [Day 5](./day-05-wallet-types/) | Explore wallet types — CLI, browser, mobile | Wallet ecosystem overview | ✅ Done |
| Day 6 | [DEV blog post](https://dev.to/gopichand_dev/your-public-key-is-your-identity-what-web2-devs-need-to-know-about-solana-4lpm) — On-chain identity | Public key = identity, no account needed | ✅ Done |
| Day 7 | [Amplify Day](https://x.com/GopichandAI/status/2049175042584445308) — Week 1 recap on X | Building in public, community | ✅ Done |

### 📅 Week 2 — Reading the Blockchain

| Day | Challenge | Key Concept | Status |
|-----|-----------|-------------|--------|
| [Day 8](./day-08-read-solana/) | Read your first on-chain data — SOL balance | RPC, `getBalance`, lamports → SOL | ✅ Done |
| [Day 9](./day-09-fetch-transactions/) | Fetch & display recent transactions | `getSignaturesForAddress`, slots, blockTime | ✅ Done |
| [Day 10](./day-10-dashboard/) | Browser dashboard — balance + transactions UI | Vite, `@solana/kit` in browser, DOM rendering | ✅ Done |
| [Day 11](./day-11-accounts-vs-databases/) | Compare accounts vs databases | Account model, rent, PDAs, ownership rules | ✅ Done |
| [Day 12](./day-12-compare-networks/) | Compare devnet vs mainnet — same address, different data | `devnet()` & `mainnet()` helpers, network isolation | ✅ Done |
| Day 13 | Coming soon | — | ⏳ |
| Day 14 | Coming soon | — | ⏳ |

---

## Live CLI Outputs So Far

**Day 8 — Balance Reader**
```
Address: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
Balance: 0.001159846 SOL
```

**Day 11 — Account Inspection**
```
Wallet  → Owner: System Program | Executable: false | 2.5 SOL | 0 bytes
Token Program → Owner: BPF Loader | Executable: true  | 6.45 SOL | 36 bytes
Rent: 0 bytes=0.00089088 SOL | 1000 bytes=0.00785088 SOL
```

**Day 12 — Network Comparison**
```
==================================================
  DEVNET  (test network — free SOL, test data)
==================================================
  Address : TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Balance : [devnet balance]
  Recent Transactions: [devnet-specific signatures]

==================================================
  MAINNET (live network — real SOL, real data)
==================================================
  Address : TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Balance : [mainnet balance — different from devnet]
  Recent Transactions: [mainnet-specific signatures]

Same address. Same code. Only the URL changed.
```

---

## Tech Stack
![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

- `@solana/kit` — Official Solana TypeScript SDK
- `Node.js` — Runtime for scripts
- `Vite` — Browser apps bundler (Days 4, 10)
- `Solana CLI` — Account inspection, rent calculation
- Solana Devnet + Mainnet — Both networks

---

## Connect with Me
| Platform | Link |
|----------|------|
| 🐦 Twitter/X | [@GopichandAI](https://twitter.com/GopichandAI) |
| 💼 GitHub | [gopichandchalla16](https://github.com/gopichandchalla16) |
| 🔗 LinkedIn | [gopichandchalla](https://linkedin.com/in/gopichandchalla) |
| ✍️ DEV.to | [gopichand_dev](https://dev.to/gopichand_dev) |

---

> *"Same address. Same code. Same RPC calls. Only the URL changed — but the data is totally different."*
> — 100 Days of Solana, Day 12
