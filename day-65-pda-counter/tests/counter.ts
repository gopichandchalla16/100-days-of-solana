import * as anchor from "@anchor-lang/core";
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { assert } from "chai";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const idl = require("../target/idl/counter.json");

describe("counter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const programId = new PublicKey(idl.address);
  const program   = new anchor.Program(idl, provider);

  const getCounterPda = (user: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("counter"), user.toBuffer()],
      programId
    )[0];

  it("creates a counter per user and increments independently", async () => {
    const alice = provider.wallet.publicKey;
    const bob   = Keypair.generate();

    // Airdrop SOL to bob
    const sig    = await provider.connection.requestAirdrop(bob.publicKey, 2 * LAMPORTS_PER_SOL);
    const latest = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({ signature: sig, ...latest }, "confirmed");

    // Init both counters
    await program.methods.initCounter().accounts({ user: alice }).rpc();
    await program.methods.initCounter().accounts({ user: bob.publicKey }).signers([bob]).rpc();

    // Alice increments twice, Bob increments once
    await program.methods.increment().accounts({ user: alice }).rpc();
    await program.methods.increment().accounts({ user: alice }).rpc();
    await program.methods.increment().accounts({ user: bob.publicKey }).signers([bob]).rpc();

    const aliceState = await program.account.counter.fetch(getCounterPda(alice));
    const bobState   = await program.account.counter.fetch(getCounterPda(bob.publicKey));

    assert.equal(aliceState.count.toNumber(), 2, "Alice count should be 2");
    assert.equal(bobState.count.toNumber(),   1, "Bob count should be 1");
    assert.ok(aliceState.user.equals(alice),            "Alice PDA owner mismatch");
    assert.ok(bobState.user.equals(bob.publicKey),      "Bob PDA owner mismatch");

    console.log("\n  PDA Results:");
    console.log("  Alice:", getCounterPda(alice).toBase58(), "→ count:", aliceState.count.toNumber());
    console.log("  Bob:  ", getCounterPda(bob.publicKey).toBase58(), "→ count:", bobState.count.toNumber());
  });
});
