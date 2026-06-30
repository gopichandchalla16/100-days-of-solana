# Day 71 — Move SOL from Inside Your Program with a CPI

> **Challenge:** [100 Days of Solana](https://mlh.link/solana-100) · Week 11 · MLH

---

## ✅ What I Built

An Anchor 1.0 program (`sol-mover`) with a single instruction — `sol_transfer` — that calls the **System Program** via a **Cross-Program Invocation (CPI)** to transfer SOL from a signer to any recipient. No lamport arithmetic inside the program itself; the System Program owns that logic, and my program simply delegates to it.

---

## 🧠 Key Concepts

### What is a CPI?
A CPI (Cross-Program Invocation) lets one Solana program pause mid-execution, call a completely different program, and resume once it returns. This is the primitive that lets thousands of independent programs compose into a single ecosystem.

### Why CPI for SOL transfers?
On Solana, **only the program that owns an account may reduce its lamport balance**. Ordinary wallets are owned by the System Program — not your program. So to move SOL out of a wallet, you must ask the System Program to do it. That request is a CPI.

### The three building blocks used today

| Piece | What it does |
|---|---|
| `Transfer { from, to }` | Anchor's ready-made accounts struct for the System Program's transfer instruction |
| `CpiContext::new(program_id, accounts)` | Bundles the target program's pubkey + the required accounts into a single context |
| `transfer(cpi_context, amount)` | Fires the invocation — builds the real instruction and hands it to the runtime |

---

## 🗂️ Project Structure

```
sol-mover/
├── programs/sol-mover/src/
│   └── lib.rs           # sol_transfer instruction + SolTransfer accounts struct
├── tests/
│   └── sol-mover.ts     # TypeScript test — sends 0.25 SOL, asserts balance change
├── Anchor.toml          # [scripts] test = yarn run ts-mocha ...
└── tsconfig.json
```

---

## 📄 Core Program — `lib.rs`

```rust
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("2RuhecMfTQqGwfgEC47ca965VqGUbTGefypkSY5Re6ob");

#[program]
pub mod sol_mover {
    use super::*;

    pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.sender.to_account_info(),
            to:   ctx.accounts.recipient.to_account_info(),
        };
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.key(), // Anchor 1.0: Pubkey, not AccountInfo
            cpi_accounts,
        );
        transfer(cpi_context, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(mut)]
    pub sender:         Signer<'info>,
    #[account(mut)]
    pub recipient:      SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
```

**Why `system_program.key()` and not `.to_account_info()`?**
Anchor 1.0 changed `CpiContext::new`'s first argument from `AccountInfo` to `Pubkey`. Using `.to_account_info()` here produces a compiler error: `expected Pubkey, found AccountInfo<'_>`.

---

## 🧪 Test — `tests/sol-mover.ts`

```typescript
import * as anchor from "@anchor-lang/core";
import { Program, web3 } from "@anchor-lang/core";
import { SolMover } from "../target/types/sol_mover";

const { Keypair, LAMPORTS_PER_SOL } = web3;

describe("sol-mover", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolMover as Program<SolMover>;
  const sender = provider.wallet;

  it("moves SOL with a CPI to the System Program", async () => {
    const recipient = Keypair.generate();
    const amount    = new anchor.BN(0.25 * LAMPORTS_PER_SOL);

    const before    = await provider.connection.getBalance(recipient.publicKey);
    const signature = await program.methods
      .solTransfer(amount)
      .accounts({ sender: sender.publicKey, recipient: recipient.publicKey })
      .rpc();
    const after     = await provider.connection.getBalance(recipient.publicKey);

    console.log("Transaction signature:", signature);
    console.log(`Recipient went from ${before} to ${after} lamports`);

    if (after - before !== amount.toNumber()) {
      throw new Error("The recipient did not receive the expected amount of SOL");
    }
  });
});
```

> Notice: `systemProgram` is **not** listed in `.accounts()` — Anchor recognises it by name and fills it in automatically.

---

## 🚀 Passing Test Output

```
  sol-mover
Transaction signature: 389wbbxp3BnJMB44X6XrWNg2GmTk8vZfnzP6wSCFbQAj3STPiCian5RxT1u8jKKTD7z3dDAQ7vq2iRYJKRuw6HPZ
Recipient went from 0 to 250000000 lamports
    ✔ moves SOL with a CPI to the System Program


  1 passing (-565ms)

Done in 4.61s.
```

**Recipient balance:** `0 → 250,000,000 lamports` = exactly **0.25 SOL** ✅

---

## 🔑 Anchor.toml `[scripts]` Fix

The default Anchor 1.0 scaffold generates `test = "cargo test"`, which skips TypeScript entirely. Changed it to:

```toml
[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

---

## 💡 What I Learned

- A CPI is an **atomic sub-call** — if the inner transfer fails, the entire outer instruction rolls back. You never end up half-done.
- **Signer authority propagates automatically.** Because `sender` signed the outer transaction, the runtime forwards that authority into the CPI. No extra signing code needed for real keypairs.
- **PDAs need seed-based signing** — the next challenge. When the payer is a PDA (no private key), you must pass seeds into `CpiContext::new_with_signer` instead of relying on the outer signature.
- In Anchor 1.0, `CpiContext::new`'s first arg is `Pubkey` (`.key()`), not `AccountInfo` — a subtle but compiler-enforced breaking change from 0.x.

---

## 📚 Resources

- [Anchor docs: Cross-Program Invocations](https://www.anchor-lang.com/docs/basics/cpi)
- [Solana docs: Cross Program Invocation](https://solana.com/docs/intro/quick-start/cross-program-invocation)
- [anchor-lang: system_program module](https://docs.rs/anchor-lang/latest/anchor_lang/system_program/index.html)
- [Anchor docs: testing with LiteSVM](https://www.anchor-lang.com/docs/testing/litesvm)

---

> *"Your program was the caller; the System Program was the callee. The difference on Solana is that the 'API call' happens atomically inside one transaction."*
> — Day 71, 100 Days of Solana
