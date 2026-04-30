# 100 Days of Solana

> **by Gopichand Challa** — Building in public daily 🚀

My public build log and code for the [100 Days of Solana](https://mlh.link/solana-100) challenge by MLH.
Daily Solana, Web3, and on-chain development — from keypairs to smart contracts.

---

## Progress

![Progress](https://img.shields.io/badge/Progress-9%20%2F%20100%20Days-01696f?style=for-the-badge&logo=solana&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active%20🔥-success?style=for-the-badge)
![Chain](https://img.shields.io/badge/Chain-Solana%20Devnet-9945FF?style=for-the-badge)

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
Day 10  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ⏳
...
Day100  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ⏳

[█████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 9%
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
| Day 10 | Coming soon | — | ⏳ |
| Day 11 | Coming soon | — | ⏳ |
| Day 12 | Coming soon | — | ⏳ |
| Day 13 | Coming soon | — | ⏳ |
| Day 14 | Coming soon | — | ⏳ |

---

## Live Outputs So Far

**Day 8 — Balance Reader**
```
Address: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
Balance: 0.001159846 SOL
```

**Day 9 — Transaction Fetcher**
```
Last 5 transactions for TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb:

Signature : 5wJa1Pz83czCHuKb4eQsRoUXfL9GdPQfKgVDrGowiesFh2KEuoDamA6BTZ7svckxBJQMToPLfuwakUq3xn6Q7TKA
Slot      : 459179358
Time      : 1/5/2026, 12:24:18 am
Status    : Success
---
Signature : 5MSFcXCr21ePqgBH9PKeQw46KW215Ym4mthvu7EXCgu1S7vC8feDU1oqtXv75UnQjFo5xHS5yzxDKCph9aWHQ7Yy
Slot      : 459179356
Time      : 1/5/2026, 12:24:17 am
Status    : Success
---
```

---

## Tech Stack
![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

- `@solana/kit` — Official Solana TypeScript SDK
- `Node.js` — Runtime for scripts
- `Vite` — Browser apps (from Day 4)
- `Wallet Standard` — Browser wallet integration
- Solana Devnet — Test network

---

## Connect with Me
| Platform | Link |
|----------|------|
| 🐦 Twitter/X | [@GopichandAI](https://twitter.com/GopichandAI) |
| 💼 GitHub | [gopichandchalla16](https://github.com/gopichandchalla16) |
| 🔗 LinkedIn | [gopichandchalla](https://linkedin.com/in/gopichandchalla) |
| ✍️ DEV.to | [gopichand_dev](https://dev.to/gopichand_dev) |

---

> *"Solana is a massive database where every table is public and every query is free."*
> — 100 Days of Solana, Day 8
