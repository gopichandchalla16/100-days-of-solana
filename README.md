# 100 Days of Solana

> **by Gopichand Challa** — Building in public daily 🚀

My public build log and code for the [100 Days of Solana](https://mlh.link/solana-100) challenge by MLH.
Daily Solana, Web3, and on-chain development — from keypairs to smart contracts.

---

## Progress

![Progress](https://img.shields.io/badge/Progress-17%20%2F%20100%20Days-9945FF?style=for-the-badge&logo=solana&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active%20🔥-success?style=for-the-badge)
![Chain](https://img.shields.io/badge/Chain-Solana%20Devnet-14f195?style=for-the-badge)

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
Day 13  ████████████████████████████████████████  ✅
Day 14  ████████████████████████████████████████  ✅
Day 15  ████████████████████████████████████████  ✅
Day 16  ████████████████████████████████████████  ✅
Day 17  ████████████████████████████████████████  ✅
Day 18  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ⏳
...
Day100  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ⏳

[█████████████████░░░░░░░░░░░░░░░░░░░░░░░░░] 17%
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
| [Day 13](./day-13-week2-reflection/) | [Week 2 reflection — DEV.to post](https://dev.to/gopichand_dev/week-2-on-solana-when-the-public-database-finally-clicked-273a) | Writing, mental models, public learning | ✅ Done |
| [Day 14](./day-14-amplify-week2/) | [Amplify Week 2 — X post](https://x.com/GopichandAI/status/2051216227356528884) | Social media, building in public | ✅ Done |

### 📅 Week 3 — Transactions & State Changes

| Day | Challenge | Key Concept | Status |
|-----|-----------|-------------|--------|
| [Day 15](./day-15-transaction-anatomy/) | Understand transaction anatomy | Signatures, account keys, blockhash, instructions, 1232-byte limit | ✅ Done |
| [Day 16](./day-16-first-sol-transfer/) | Send first deliberate SOL transfer | `solana transfer`, `--allow-unfunded-recipient`, settlement < 1s | ✅ Done |
| [Day 17](./day-17-transfer-tool/) | Build a reusable Node.js transfer tool | Arg parsing, balance check, signature output, Explorer link | ✅ Done |
| Day 18 | Coming soon | — | ⏳ |
| Day 19 | Coming soon | — | ⏳ |
| Day 20 | Coming soon | — | ⏳ |
| Day 21 | Coming soon | — | ⏳ |

---

## Live Outputs So Far

**Day 15 — Transaction Anatomy**
```
Signature: 4k7Q8AsES8WDyhMMdbaFdURDEY5wrEn8r1wqZ9E6asGMA8jztCMRSeNSZVWoEjuboxAge5eit6my7exYDj1jN27V
Accounts:  AWKYsCGB (srw- fee payer) | CUHUuC7J (-rw- dest) | 11111111 (-r-x System Program)
Fee: 5000 lamports | Compute: 150 units | Slot: 460450085
```

**Day 16 — First SOL Transfer**
```
Sender    (AWKYsCGB...): 2.498995 → 1.99899 SOL
Recipient (4mW77HkF...): 0       → 0.5 SOL
Signature: 36ZztT5VFAooZsWdrdmYP2jR8q6YVkoLoZ1mPpAmZTJV1WtNEaLi2LUCJJrL1SMUFaWLwzXXhShiEL5rBZFLkYJo
Settlement: < 1 second | Network: Devnet
```

**Day 17 — Transfer Tool (Node.js CLI)**
```
Solana Transfer Tool
====================
Sender:    AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
Recipient: 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ
Amount:    0.001 SOL | Balance before: 3.747955 SOL
Signature: 4G2xYXgJ3APaPDEABweLE7evgKvJuLJjy6Nj3NYsfCHqDnzt1snenMrL3DsVjxE6PftjsFF3Fb6ADJ3CiUBxUKZR
Slot: 460986088 | Status: Finalized | Fee: 0.000005 SOL
```

---

## Tech Stack
![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

- `@solana/kit` — Official Solana TypeScript SDK
- `Node.js` — Runtime for scripts
- `Solana CLI` — Transaction inspection, transfers, account management
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

> *"Turned a one-off CLI transfer into a reusable Node.js tool with validation, balance checks, and Explorer output."*
> — 100 Days of Solana, Day 17
