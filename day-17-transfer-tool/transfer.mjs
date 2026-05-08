import { execSync } from "child_process";

// ── Parse CLI arguments ────────────────────────────────────────────────────────
const [recipient, amount] = process.argv.slice(2);

if (!recipient || !amount) {
  console.log("\nUsage: node transfer.mjs <recipient-address> <amount-in-SOL>");
  console.log("Example: node transfer.mjs 8Z9e1budzc3CwwLvjo7MaQ9W15Tb3PW21it5nEMf6LeZ 0.05\n");
  process.exit(1);
}

const amountNum = Number(amount);
if (!Number.isFinite(amountNum) || amountNum <= 0) {
  console.error("Error: Amount must be a positive number.");
  process.exit(1);
}

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

try {
  console.log("\nSolana Transfer Tool");
  console.log("====================");
  console.log("Connected to Solana devnet.");

  // ── Load sender address ────────────────────────────────────────────────────
  const sender = run("solana address");
  console.log(`Sender:    ${sender}`);
  console.log(`Recipient: ${recipient}`);
  console.log(`Amount:    ${amountNum} SOL`);

  // ── Balance check before sending ──────────────────────────────────────────
  // A failed tx on Solana still costs a fee — validate first
  const balanceText = run("solana balance");
  const balanceSol = Number(balanceText.replace(" SOL", ""));
  console.log(`Sender balance: ${balanceSol} SOL`);

  const estimatedFee = 0.000005;
  if (balanceSol < amountNum + estimatedFee) {
    console.error("\nError: Insufficient balance.");
    console.error(`Need about ${(amountNum + estimatedFee).toFixed(6)} SOL but only have ${balanceSol} SOL`);
    process.exit(1);
  }

  // ── Send the transaction ───────────────────────────────────────────────────
  console.log("\nSending transaction...");
  const transferOutput = run(
    `solana transfer ${recipient} ${amountNum} --allow-unfunded-recipient`
  );

  // Extract signature from CLI output
  // CLI prints: "Signature: <base58sig>"
  const sigMatch = transferOutput.match(/Signature:\s*(\S+)/);
  const signature = sigMatch ? sigMatch[1] : "NOT_FOUND";

  // ── Post-transfer balance ──────────────────────────────────────────────────
  const newBalanceText = run("solana balance");
  const newBalanceSol = Number(newBalanceText.replace(" SOL", ""));

  console.log("Transaction confirmed! ✅");
  console.log(`Signature: ${signature}`);
  console.log(`Explorer:  https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  console.log(`New sender balance: ${newBalanceSol} SOL`);

} catch (error) {
  console.error("\nTransfer failed.");
  if (error.stdout) console.error(error.stdout.toString());
  if (error.stderr) console.error(error.stderr.toString());
  process.exit(1);
}
