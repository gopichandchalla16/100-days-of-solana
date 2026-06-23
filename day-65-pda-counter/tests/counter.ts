import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { assert } from "chai";

describe("counter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Counter as Program<Counter>;

  const counterPda = (user: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("counter"), user.toBuffer()],
      program.programId
    )[0];

  it("creates a counter per user and increments independently", async () => {
    const alice = provider.wallet.publicKey;
    const bob = Keypair.generate();

    // fund bob so he can pay rent
    const sig = await provider.connection.requestAirdrop(
      bob.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    const latest = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction(
      { signature: sig, ...latest },
      "confirmed"
    );

    // init counters for both users
    await program.methods
      .initCounter()
      .accounts({ user: alice })
      .rpc();

    await program.methods
      .initCounter()
      .accounts({ user: bob.publicKey })
      .signers([bob])
      .rpc();

    // alice increments twice, bob increments once
    await program.methods.increment().accounts({ user: alice }).rpc();
    await program.methods.increment().accounts({ user: alice }).rpc();
    await program.methods
      .increment()
      .accounts({ user: bob.publicKey })
      .signers([bob])
      .rpc();

    // fetch both states and assert independence
    const aliceState = await program.account.counter.fetch(counterPda(alice));
    const bobState = await program.account.counter.fetch(
      counterPda(bob.publicKey)
    );

    assert.equal(aliceState.count.toNumber(), 2, "alice count should be 2");
    assert.equal(bobState.count.toNumber(), 1, "bob count should be 1");
    assert.ok(aliceState.user.equals(alice), "alice.user field mismatch");
    assert.ok(
      bobState.user.equals(bob.publicKey),
      "bob.user field mismatch"
    );

    console.log(
      "\n✅ Alice PDA:",
      counterPda(alice).toBase58(),
      "count =",
      aliceState.count.toNumber()
    );
    console.log(
      "✅ Bob   PDA:",
      counterPda(bob.publicKey).toBase58(),
      "count =",
      bobState.count.toNumber()
    );
    console.log(
      "\n🎯 Per-user PDA mapping proven — Alice and Bob counters are fully independent!"
    );
  });
});
