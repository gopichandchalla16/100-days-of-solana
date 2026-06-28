# Day 70 — Amplify Your PDA Mental Model on Social Media

## Challenge
Take the DEV.to PDA explainer from Day 69 and turn it into a social post that helps another developer find the mental model you built this week.

## What Was Done

- Published a 5-post X thread amplifying the Day 69 DEV.to article
- Posted on LinkedIn with the article linked in the first comment
- Replied to two other `#100DaysOfSolana` posts from fellow participants
- Used `#100DaysOfSolana` hashtag on every post

## X Thread (5 posts)

**Post 1 — Hook:**
```
Spent a week on Solana PDAs.

The thing that finally made them click:
PDAs are not accounts a program owns.
They are accounts a program can prove it derived.

Thread 🧵 #100DaysOfSolana #Solana
```

**Post 2 — Where I started:**
```
I came in with a Web2 mental model.

I thought: “it’s like a database row with a foreign key.”

That works until it doesn’t — because there’s no
private key, no signer, and no randomness.
The address IS the proof.
```

**Post 3 — Core insight:**
```
The model that works:

seed bytes + program ID → deterministic address

Same seeds, same program = same address every time.
Different wallet, same seeds = different PDA.

Your program signs for it. No private key needed.
```

**Post 4 — Concrete artifact:**
```
Proved it live across 6 days:

Derive → Init → Mutate → Close → Spoof test

Anchored rejected the cross-wallet spoof:
ConstraintSeeds error 2006 ✅
1,231,920 lamports reclaimed on close ✅
```

**Post 5 — Closing + link:**
```
If you’re at Day 64 and confused about bumps,
seeds, or why your PDA address doesn’t match —
this is what I wish I had.

🔗 https://dev.to/gopichand_dev/what-i-learned-about-pdas-in-a-week-of-building-on-solana-4n9b

#100DaysOfSolana #Solana #Anchor #Web3Dev
```

## LinkedIn Post

```
Week 10 of #100DaysOfSolana wrapped.

This week I built the full PDA lifecycle from scratch:

• Derived a PDA deterministically from seeds
• Built a per-user counter — Alice and Bob got isolated state
• Added a singleton Config PDA with admin auth + pause guard
• Closed a PDA account and watched 1.2M lamports return
• Ran a collision explorer to prove near-miss seeds diverge

The mental model that finally clicked: PDAs are not
accounts a program owns. They are accounts a program
can prove it derived — deterministic, ownable, closeable.

Wrote the full explainer in the first comment ↓

#Solana #Anchor #Web3 #BuildingInPublic #100DaysOfSolana
```
*(Article link posted in first comment)*

## Source Article

[Day 69 — What I Learned About PDAs in a Week of Building on Solana](https://dev.to/gopichand_dev/what-i-learned-about-pdas-in-a-week-of-building-on-solana-4n9b)

## Related Days

- [Day 64 — Derive PDA](../day-64-derive-pda/)
- [Day 65 — PDA Counter](../day-65-pda-counter/)
- [Day 66 — Config PDA](../day-66-config-pda/)
- [Day 67 — Close PDA](../day-67-close-pda/)
- [Day 68 — PDA Collision Explorer](../day-68-pda-collisions/)
- [Day 69 — PDA Explainer Article](../day-69-pda-explainer/)

## Tags
`#100DaysOfSolana` `#Solana` `#Anchor` `#Web3Dev` `#BuildingInPublic`
