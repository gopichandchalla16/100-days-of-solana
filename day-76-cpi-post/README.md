# Day 76 — Publish CPI Mental Model Article on DEV.to

**Challenge:** Write and publish a DEV.to article covering the CPI mental model built across Days 71–75.

## What I Published

A full technical article — [CPI on Solana: The Mental Model I Wish I Had on Day 71](https://dev.to/gopichand_dev/cpi-on-solana-the-mental-model-i-wish-i-had-on-day-71-ceh) — covering every CPI pattern I built during Week 11.

## Article Breakdown

| Section | Day Source | What it covers |
|---|---|---|
| The simplest possible CPI | Day 71 | `Transfer` struct · `CpiContext::new` · SOL transfer to System Program |
| The same pattern, different callee | Day 72 | `MintTo` struct · `token_interface::mint_to` · Token-2022 |
| PDA-signed CPI | Day 73 | `CpiContext::new_with_signer` · `signer_seeds` · vault withdraw |
| Program calling another program | Day 74 | `declare_program!(counter)` · typed `Increment` accounts · atomic composition |
| Reading a CPI failure | Day 75 | `ConstraintSeeds` · `privilege escalation` · `ConstraintHasOne` · `invalid instruction data` |

## Key Insight

Every line of CPI code does one of three things:
1. Names the program being called (a public key, not an import)
2. Passes the accounts that program needs
3. Proves who is authorised to sign

The `CpiContext` shape stays the same across all four callees — System Program, Token-2022, and two custom Anchor programs. The only variation is whether you use `new` or `new_with_signer`, and which accounts struct you fill in.

## Live Article

[https://dev.to/gopichand_dev/cpi-on-solana-the-mental-model-i-wish-i-had-on-day-71-ceh](https://dev.to/gopichand_dev/cpi-on-solana-the-mental-model-i-wish-i-had-on-day-71-ceh)

## Tags

`#100daysofsolana` `#rust` `#anchor` `#web3`

## Resources Referenced

- [Solana docs: Cross-Program Invocations](https://solana.com/docs/core/cpi)
- [Anchor docs: CPI](https://www.anchor-lang.com/docs/basics/cpi)
- [Anchor docs: declare_program!](https://www.anchor-lang.com/docs/references/macros#declare_program)
- [anchor_lang::system_program](https://docs.rs/anchor-lang/latest/anchor_lang/system_program/index.html)
- [Token-2022 docs](https://www.solana-program.com/docs/token-2022)
