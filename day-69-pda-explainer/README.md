# Day 69 — Write a PDA Explainer That Will Hold Up in Six Months

## Challenge
Write a public explainer of the PDA model as you now understand it, aimed at a developer who is exactly where you were a week ago.

## Published Article

📖 **[What I Learned About PDAs in a Week of Building on Solana](https://dev.to/gopichand_dev/what-i-learned-about-pdas-in-a-week-of-building-on-solana-4n9b)**

## What This Post Covers

| Section | Summary |
|---------|----------|
| The Problem PDAs Solve | Programs are stateless — PDAs are how they remember things |
| The Mental Model | Web2 DB primary key analogy + where it breaks |
| Anatomy of a Derivation | Every piece of the Anchor `seeds` + `bump` constraint explained |
| Why the Seeds Matter | Per-user vs global PDA; near-miss variants; real terminal output |
| What the Bump Buys You | Canonical bump; store vs re-derive; cost difference |
| The Full Lifecycle | Derive → Init → Mutate → Close with real code from Days 64–68 |
| The Spoof Test | Live `ConstraintSeeds` rejection from Day 68 |
| What I Would Tell Past Me | 5 hard-won lessons in plain English |

## Code Referenced

All code snippets in the article come directly from Days 64–68:

- [Day 64 — Derive PDA](../day-64-derive-pda/)
- [Day 65 — PDA Counter](../day-65-pda-counter/)
- [Day 66 — Config PDA](../day-66-config-pda/)
- [Day 67 — Close PDA](../day-67-close-pda/)
- [Day 68 — PDA Collision Explorer](../day-68-pda-collisions/)

## Key Terminal Outputs Cited

```
# Per-user derivation — different wallets, different PDAs
Wallet A PDA : 6khGZheFP1Yn61p7VJmwQtPd5gc5S2BHru8nugJFBHXy
Wallet B PDA : EEwiF4AFLd5nEFgYJA6SN6bRQPEaH9kHj4a8GtkdkyJx
Same address?: false ✅

# Global derivation — same PDA from any wallet
Derived from A: 4f9BPE2BaRMG7SH339sw6dTigKqGJdeSKrtfaiZJXhmc
Derived from B: 4f9BPE2BaRMG7SH339sw6dTigKqGJdeSKrtfaiZJXhmc
Same address?: true ✅

# Spoof attempt rejected by Anchor
AnchorError caused by account: counter.
Error Code: ConstraintSeeds. Error Number: 2006.
Error Message: A seeds constraint was violated.

# Rent reclaimed on close
Counter closed ✅
Lamports returned : 1,231,920
getAccountInfo    : null
```

## Resources

- [Solana PDA documentation](https://solana.com/docs/core/pda)
- [Anchor PDA guide](https://www.anchor-lang.com/docs/basics/pda)
- [anchor-lang crate docs](https://docs.rs/anchor-lang/latest/anchor_lang/)

## Tags
`solana` `rust` `anchor` `webdev` `100DaysOfSolana`
