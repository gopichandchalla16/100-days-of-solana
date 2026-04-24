# Day 3: SOL and Lamports

Part of the [100 Days of Solana](https://www.mlh.com/events/100-days-of-solana/challenges) challenge by MLH.

## What This Does

This script reads the persistent wallet created on Day 2 and:
- Checks the devnet balance via RPC (which returns lamports)
- Converts lamports to SOL
- Prints the conversion math clearly
- Lists common lamport denominations you'll encounter while building

## Why Lamports?

Solana's runtime uses **integers (lamports)** instead of floats to avoid rounding errors.
Every node must compute the exact same result — floating point can't guarantee that.

> Just like Stripe uses cents (not $19.99), Solana uses lamports (not 0.000005 SOL).

## Key Conversion

```
1 SOL = 1,000,000,000 lamports (10^9)
```

## Common Amounts

| Description | Lamports | SOL |
|---|---|---|
| 1 SOL | 1,000,000,000 | 1 |
| Devnet airdrop | 2,000,000,000 | 2 |
| Base tx fee | 5,000 | 0.000005 |
| Rent (basic account) | 890,880 | ~0.00089 |

## Run It

```bash
npm install
node day-03-lamports.mjs
```

> Note: Requires `wallet.json` from Day 2 (`../day-02-persistent-wallet/wallet.json`)

## Resources

- [Solana Fees Docs](https://solana.com/docs/core/fees)
- [getBalance RPC](https://solana.com/docs/rpc/http/getbalance)
- [Solana CLI Usage](https://docs.anza.xyz/cli/usage)
