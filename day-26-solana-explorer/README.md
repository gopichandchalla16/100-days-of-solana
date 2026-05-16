# Day 26 — Explore Solana Explorer

> **100 Days of Solana** | Arc Theme: Accounts & Programs (Week 4)

## What I Did

Used Solana Explorer to visually browse the same on-chain data I've been reading via CLI and RPC scripts for 25 days. No code today — just exploration.

**Explored 4 pages:**
1. My latest devnet transaction (full breakdown)
2. My devnet wallet (25-day history visible)
3. Token-2022 program on mainnet (live activity)
4. Mainnet live dashboard (real-time TPS + slots)

---

## Explorer URLs Used

```
# Latest devnet transaction
https://explorer.solana.com/tx/GM6iVMk9VbHfd8PCNLuzbyWM9Sqh5BsWm8UWJmYytrfT1o7WmCME9Pi6ybS5gcA6EYrFYVmRrJCbRKqRQpr6D6z?cluster=devnet

# My devnet wallet
https://explorer.solana.com/address/AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y?cluster=devnet

# Token-2022 program (mainnet)
https://explorer.solana.com/address/TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

# Mainnet live dashboard
https://explorer.solana.com/
```

---

## My 5 Recent Devnet Transactions

```
GM6iVMk9VbHfd8PCNLuzbyWM9Sqh5BsWm8UWJmYytrfT1o7WmCME9Pi6ybS5gcA6EYrFYVmRrJCbRKqRQpr6D6z
3FWwYbZ6kcXsou6Vt9hrKqWgcWfidq2EhMTZ5DDavyYqH9dTHTzUSLDHSGzAHNQVL489idk1EFJp5sDmTdQkN6EE
2xQrSQUhoiF2ob4NAukfp9PvRoa4P6PSvHSKwW5bkKvgVoua8Agti2brD9FPEZonAbQDsqYVad5ZHbfvH8prtdyU
5boFQkXWP7W7KnYr6LYQe4nGb3xW4R8y8Zg6D8kX7t8XKSmSrueEcQ8ffWaDYoXUuHgGdb6Tc3y5dVRXUsR2hnwp
3hYmkD3mmCCAJiji76mccJUqU2xB7YeNPokUPnZV6rJ3btGt8kzzzvmq7B8ytd83saDDkiZUYeAcSMtStLi9fQZz
```

---

## What I Found Interesting

### 1. Transaction Page
- Every field I've been reading in JSON via RPC — fee, accounts, instructions, status — is rendered visually
- Fee: exactly **5000 lamports** (0.000005 SOL) every time, no matter the transfer amount
- The System Program (`11111111111111111111111111111111`) appears in every transfer as the executing program
- Success/fail status is instant and permanent

### 2. My Wallet Page
- 25 days of on-chain activity visible in one scroll — every airdrop, every transfer, every test
- Balance: **6.137925 SOL** — same number I read via `solana balance` on CLI
- Everything public. No login. No permission. Anyone can see this.

### 3. Token-2022 Program (Mainnet)
- Address: `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`
- This is the same program I queried via RPC in Arc 2 — now showing thousands of live transactions
- It handles extensions: transfer fees, interest-bearing tokens, confidential transfers
- Marked as **Executable** with BPF loader — exactly what I inspected yesterday in Day 25

### 4. Mainnet Live Dashboard
- **TPS: ~3000–4000** transactions per second in real time
- Slot numbers updating every **~400ms** — the fastest blockchain I've seen
- Each slot = a potential state change for millions of accounts simultaneously
- The scale of what's happening beneath every CLI command finally clicked visually

---

## Key Insight

Every piece of on-chain data I've read through RPC calls, CLI commands, and `@solana/kit` scripts over 25 days is just a different interface to the same public ledger. Explorer renders it visually. RPC returns it as JSON. CLI prints it in terminal. The data is identical — the tool changes, the blockchain doesn't.

---

## Screenshots
- `screenshot-1-devnet-transaction.png` — Latest tx breakdown
- `screenshot-2-devnet-wallet.png` — Wallet with 25-day history
- `screenshot-3-token2022-mainnet.png` — Token-2022 program live activity
- `screenshot-4-mainnet-dashboard.png` — Live TPS + slot counter

---

## Resources
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
- [Solana Explorer (mainnet)](https://explorer.solana.com/)
- [Token-2022 Program](https://explorer.solana.com/address/TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb)
