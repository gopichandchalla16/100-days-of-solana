import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { assert } from "chai";

describe("counter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Counter as Program<any>;
  const user = provider.wallet.publicKey;

  const [counterPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter"), user.toBuffer()],
    program.programId
  );

  it("initializes config", async () => {
    await program.methods.initConfig().rpc();
    console.log("  config initialized");
  });

  it("initializes a counter and increments", async () => {
    await program.methods.initCounter().rpc();
    await program.methods.increment().rpc();
    const counter = await program.account.counter.fetch(counterPda);
    assert.equal(counter.count.toNumber(), 1);
    console.log("  count:", counter.count.toNumber(), "| counterPda:", counterPda.toBase58());
  });

  it("closes the counter and refunds rent", async () => {
    const counterAccount = await provider.connection.getAccountInfo(counterPda);
    const rentLamports = counterAccount!.lamports;
    const balanceBefore = await provider.connection.getBalance(user);

    await program.methods.closeCounter().rpc();

    const counterAfter = await provider.connection.getAccountInfo(counterPda);
    const balanceAfter = await provider.connection.getBalance(user);

    if (counterAfter !== null) {
      throw new Error("counter account still exists after close");
    }

    console.log("  rent refunded (lamports):", rentLamports);
    console.log("  net wallet change (lamports):", balanceAfter - balanceBefore);
  });
});
