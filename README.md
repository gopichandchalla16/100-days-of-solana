# 100 Days of Solana

> **by Gopichand Challa** — Building in public daily 🚀

My public build log and code for the [100 Days of Solana](https://mlh.link/solana-100) challenge by MLH.
Daily Solana, Web3, and on-chain development — from keypairs to smart contracts.

---

## Progress

![Progress](https://img.shields.io/badge/Progress-22%20%2F%20100%20Days-9945FF?style=for-the-badge&logo=solana&logoColor=white)
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
Day 18  ████████████████████████████████████████  ✅
Day 19  ████████████████████████████████████████  ✅
Day 20  ████████████████████████████████████████  ✅
Day 21  ████████████████████████████████████████  ✅
Day 22  ████████████████████████████████████████  ✅
Day 23  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ⏳
...
Day100  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ⏳

[██████████████████████░░░░░░░░░░░░░░░░░░░░] 22%
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

### 📅 Week 3 — Transactions & State Changes (✅ Complete!)

| Day | Challenge | Key Concept | Status |
|-----|-----------|-------------|--------|
| [Day 15](./day-15-transaction-anatomy/) | Understand transaction anatomy | Signatures, account keys, blockhash, instructions, 1232-byte limit | ✅ Done |
| [Day 16](./day-16-first-sol-transfer/) | Send first deliberate SOL transfer | `solana transfer`, `--allow-unfunded-recipient`, settlement < 1s | ✅ Done |
| [Day 17](./day-17-transfer-tool/) | Build a reusable Node.js transfer tool | Arg parsing, balance check, signature output, Explorer link | ✅ Done |
| [Day 18](./day-18-confirmation-ui/) | Add transaction confirmation UI | Processed→Confirmed→Finalized live tracking, error handling | ✅ Done |
| [Day 19](./day-19-failed-transactions/) | Explore failed transactions | skipPreflight, on-chain error, fee charged on failure, custom program error 0x1 | ✅ Done |
| [Day 20](./day-20-write-about-transactions/) | [Write about transactions — DEV.to post](https://dev.to/gopichand_dev/solana-transactions-explained-for-backend-developers-with-real-failures-2ido) | Technical writing, Web2→Web3 mental model, confirmation stages | ✅ Done |
| [Day 21](./day-21-share-transfer-tool/) | [Share transfer tool — X post](https://x.com/GopichandAI/status/2054100764197634276) | Building in public, social proof, on-chain receipt | ✅ Done |

### 📅 Week 4 — Accounts & Programs

| Day | Challenge | Key Concept | Status |
|-----|-----------|-------------|--------|
| [Day 22](./day-22-inspect-account-data/) | Inspect account data | 5 account fields, wallet vs program vs native, owner model | ✅ Done |
| Day 23 | Coming soon | — | ⏳ |
| Day 24 | Coming soon | — | ⏳ |
| Day 25 | Coming soon | — | ⏳ |
| Day 26 | Coming soon | — | ⏳ |
| Day 27 | Coming soon | — | ⏳ |
| Day 28 | Coming soon | — | ⏳ |

---

## Live Outputs So Far

**Day 21 — X Post (Building in Public)**
> [Day 21/100 — Shared transfer tool on X with on-chain proof](https://x.com/GopichandAI/status/2054100764197634276)

**Day 22 — Account Inspection**
```
Wallet:  Owner=System Program | Executable=false | Data=0 bytes
Token:   Owner=BPFLoaderUpgradeable | Executable=true  | Data=36 bytes
System:  Owner=NativeLoader    | Executable=true  | Data="system_program"
```

---

## Tech Stack
![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

- `@solana/kit` — Official Solana TypeScript SDK
- `@solana/web3.js` — Solana JavaScript SDK
- `Node.js` — Runtime for scripts
- `Solana CLI` — Transaction inspection, account inspection, transfers
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

> *"Everything on Solana is an account. Wallets, programs, tokens, NFTs — all five fields, same structure."*
> — 100 Days of Solana, Day 22
