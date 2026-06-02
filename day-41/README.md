# Day 41 — Publish a Deep Dive on Token Extensions to DEV

> **Challenge:** Document day — slow down, look back at what you built over Days 36–40, and turn it into a public artifact on DEV.to for developers who are one week behind you.

---

## Published Article

**📝 [I Built 5 Token Extension Combinations on Solana This Week — Here’s What Each One Does](https://dev.to/gopichand_dev/i-built-5-token-extension-combinations-on-solana-this-week-heres-what-each-one-does-4ck3)**

> *From compliance-gated tokens to revocable credentials — a practical guide to Token-2022 extensions for Web2 developers.*

---

## Article Summary

The article covers all 5 token extension patterns built during Days 36–40, explained through Web2 analogies so any developer can immediately understand the use case.

### Extensions Covered

| Extension | Web2 Analogy | Error Code |
|-----------|-------------|------------|
| Interest-Bearing | Savings account that accrues yield | N/A (calculation layer only) |
| Transfer Fees | Payment processor cut on every transaction | N/A (auto-enforced) |
| Default Account State (Frozen) | Brokerage freezes accounts until KYC | `0x11` AccountFrozen |
| Non-Transferable | Professional cert tied to your identity | `0x25` NonTransferable |
| Permanent Delegate | Employer can revoke your access badge | Burns without holder signature |

### Key Takeaways Published

1. **Extensions are not free** — each adds bytes, bytes cost rent
   - 171 bytes → ~0.0021 SOL (default frozen only)
   - 222 bytes → ~0.0024 SOL (interest-bearing only)
   - 599 bytes → ~0.0051 SOL (fees + interest + metadata)

2. **Both sides of a transfer must be valid** — sender thawed is not enough; recipient must also be thawed (Default Account State lesson)

3. **Extensions cannot be added after mint creation** — plan your token schema upfront like a database schema

4. **The runtime warns holders** about permanent delegates at account creation — protocol-level transparency

5. **`spl-token display` is your config reader** — always inspect before you touch any Token-2022 mint

---

## Tags Used

```
solana, web3, learning, 100daysofsolana
```

---

## Article Structure

```
├─ Hook (Web2 brokerage analogy)
├─ What Are Token Extensions? (TLV storage, rent tradeoff)
├─ Extension 1: Interest-Bearing (500bps → 15000bps, calculation layer)
├─ Extension 2: Transfer Fees (100bps, withheld + harvested)
├─ Extension 3: Default Account State Frozen (0x11 error, both sides)
├─ Extension 4: Non-Transferable / Soulbound (0x25 error)
├─ Extension 5: Permanent Delegate + Non-Transferable (revocable credential)
├─ Cost of Extensions (size/rent comparison table)
├─ What Cannot Be Changed After Creation
├─ spl-token display walkthrough
└─ Where to Go Next (official docs + GitHub repo)
```

---

## Related Days

| Day | What was built |
|-----|---------------|
| [Day 36](../day-36/) | Interest-bearing token (500bps → 15000bps) |
| [Day 37](../day-37/) | Multi-extension token: fees + interest + metadata (ArcCoin/ARC) |
| [Day 38](../day-38/) | Compliance-gated token with default frozen accounts |
| [Day 39](../day-39/) | Inspect & compare all 3 mints (171 → 222 → 599 bytes) |
| [Day 40](../day-40/) | Revocable credential: non-transferable + permanent delegate + metadata |

---

*Part of [#100DaysOfSolana](https://github.com/gopichandchalla16/100-days-of-solana) — building in public daily.*
