# Day 77 — Take Your Composed Program Public

**Challenge:** Share what you built this week in public with a social post that links to the repo.

## What I shared

For Day 77, I published an X post about the composed CPI work from Week 11 of the challenge.

**X post:**  
https://x.com/GopichandAI/status/2073638281275949395?s=20

## What this post highlights

This week I learned how Solana programs compose through CPIs:

- Call the **System Program** to move SOL
- Call **Token-2022** from inside my own program
- Use **PDA signer seeds** with `CpiContext::new_with_signer`
- Call one **Anchor program from another**
- Read CPI failures as clues instead of dead ends

## Repo linked in the post

https://github.com/gopichandchalla16/100-days-of-solana

## Why this matters

Publishing the program publicly turns a private learning exercise into proof of work.

Instead of saying I am learning Solana, I can show:
- working Anchor programs
- passing tests
- public writeups
- public social proof
- a repo that others can inspect

## Week 11 recap

| Day | Topic | Outcome |
|-----|-------|---------|
| Day 71 | SOL transfer with CPI | Called System Program successfully |
| Day 72 | Token mint via CPI | Minted Token-2022 tokens from my program |
| Day 73 | PDA vault | Withdrew using PDA signer seeds |
| Day 74 | Program-to-program CPI | One Anchor program called another |
| Day 75 | CPI failure lab | Learned to read logs as debugging clues |
| Day 76 | DEV article | Published my CPI mental model writeup |
| Day 77 | Social post | Shared the repo and key learnings publicly |

## Links

- **X post:** https://x.com/GopichandAI/status/2073638281275949395?s=20
- **Repo:** https://github.com/gopichandchalla16/100-days-of-solana
- **DEV article:** https://dev.to/gopichand_dev/cpi-on-solana-the-mental-model-i-wish-i-had-on-day-71-ceh
