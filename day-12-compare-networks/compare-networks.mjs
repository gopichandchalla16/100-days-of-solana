import { createSolanaRpc, devnet, mainnet, address } from "@solana/kit";

// Two RPC connections — same code, different URLs
const devnetRpc  = createSolanaRpc(devnet("https://api.devnet.solana.com"));
const mainnetRpc = createSolanaRpc(mainnet("https://api.mainnet-beta.solana.com"));

// Token-2022 program — exists on both networks with different data
const TARGET = address("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");

async function queryNetwork(rpc, networkName) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`  ${networkName.toUpperCase()}`);
  console.log(`${'='.repeat(50)}`);

  try {
    // Balance
    const { value: lamports } = await rpc.getBalance(TARGET).send();
    const sol = Number(lamports) / 1_000_000_000;
    console.log(`  Address : ${TARGET}`);
    console.log(`  Balance : ${sol.toFixed(9)} SOL`);
    console.log(`  Lamports: ${lamports.toString()}`);

    // Last 3 transactions
    const signatures = await rpc
      .getSignaturesForAddress(TARGET, { limit: 3 })
      .send();

    console.log(`\n  Recent Transactions (${signatures.length} found):`);

    if (signatures.length === 0) {
      console.log("  No transactions found.");
    } else {
      signatures.forEach((tx, i) => {
        const time = tx.blockTime
          ? new Date(Number(tx.blockTime) * 1000).toLocaleString()
          : "unknown";
        const status = tx.err ? "Failed" : "Success";
        console.log(`\n  [${i + 1}] Sig    : ${tx.signature.slice(0, 20)}...`);
        console.log(`       Slot   : ${tx.slot}`);
        console.log(`       Time   : ${time}`);
        console.log(`       Status : ${status}`);
      });
    }
  } catch (err) {
    console.log(`  Error: ${err.message}`);
  }
}

console.log("\n  Solana Network Comparison");
console.log(`  Address: ${TARGET}`);
console.log("  Querying devnet and mainnet...\n");

await queryNetwork(devnetRpc,  "Devnet  (test network — free SOL, test data)");
await queryNetwork(mainnetRpc, "Mainnet (live network — real SOL, real data)");

console.log(`\n${'='.repeat(50)}`);
console.log("  Key Insight:");
console.log("  Same address. Same code. Same RPC calls.");
console.log("  Only the URL changed — but the data is totally different.");
console.log("  devnet() and mainnet() helpers add type safety too.");
console.log(`${'='.repeat(50)}\n`);
