import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { assert } from "chai";

describe("counter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;

  // Generate a fresh keypair for the counter account
  const counterAccount = anchor.web3.Keypair.generate();

  it("Initializes the counter at 0", async () => {
    await program.methods
      .initialize()
      .accounts({
        counter: counterAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counterAccount])
      .rpc();

    const account = await program.account.counterAccount.fetch(
      counterAccount.publicKey
    );
    assert.ok(account.count.toNumber() === 0);
    console.log("✅ Initialized — count:", account.count.toNumber());
  });

  it("Increments the counter to 1", async () => {
    await program.methods
      .increment()
      .accounts({
        counter: counterAccount.publicKey,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const account = await program.account.counterAccount.fetch(
      counterAccount.publicKey
    );
    assert.ok(account.count.toNumber() === 1);
    console.log("✅ Incremented — count:", account.count.toNumber());
  });

  it("Increments again to 2", async () => {
    await program.methods
      .increment()
      .accounts({
        counter: counterAccount.publicKey,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const account = await program.account.counterAccount.fetch(
      counterAccount.publicKey
    );
    assert.ok(account.count.toNumber() === 2);
    console.log("✅ Incremented again — count:", account.count.toNumber());
  });

  it("Decrements the counter to 1", async () => {
    await program.methods
      .decrement()
      .accounts({
        counter: counterAccount.publicKey,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const account = await program.account.counterAccount.fetch(
      counterAccount.publicKey
    );
    assert.ok(account.count.toNumber() === 1);
    console.log("✅ Decremented — count:", account.count.toNumber());
  });

  it("Resets the counter to 0", async () => {
    await program.methods
      .reset()
      .accounts({
        counter: counterAccount.publicKey,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const account = await program.account.counterAccount.fetch(
      counterAccount.publicKey
    );
    assert.ok(account.count.toNumber() === 0);
    console.log("✅ Reset — count:", account.count.toNumber());
  });
});
