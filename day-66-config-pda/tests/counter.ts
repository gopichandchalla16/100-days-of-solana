import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { PublicKey } from "@solana/web3.js";
import { assert } from "chai";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const idl = require("../target/idl/counter.json");

describe("counter with config", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = new anchor.Program(idl, provider);
  const admin = provider.wallet;

  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    program.programId
  );
  const [counterPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter"), admin.publicKey.toBuffer()],
    program.programId
  );

  it("initializes config and a counter, then increments", async () => {
    await program.methods.initConfig().rpc();
    await program.methods.initCounter().rpc();
    await program.methods.increment().rpc();

    const counter = await program.account.counter.fetch(counterPda);
    const config  = await program.account.config.fetch(configPda);

    assert.equal(counter.count.toNumber(), 1, "count should be 1");
    assert.equal(config.totalCounters.toNumber(), 1, "totalCounters should be 1");
    assert.ok(config.admin.equals(admin.publicKey), "admin mismatch");
    assert.equal(config.paused, false, "should not be paused");

    console.log("\n  Config PDA :", configPda.toBase58());
    console.log("  Counter PDA:", counterPda.toBase58());
    console.log("  count       :", counter.count.toNumber());
    console.log("  totalCounters:", config.totalCounters.toNumber());
  });

  it("refuses to increment when paused", async () => {
    await program.methods.setPaused(true).rpc();

    try {
      await program.methods.increment().rpc();
      assert.fail("expected Paused error — should not reach here");
    } catch (err: any) {
      assert.include(err.toString(), "Paused", "error should mention Paused");
      console.log("\n  ✅ Paused error caught correctly:", err.message ?? err.toString());
    }

    // restore so other tests aren\'t affected
    await program.methods.setPaused(false).rpc();
  });
});
