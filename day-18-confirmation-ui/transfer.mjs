import { execSync, spawnSync } from "child_process";

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

// Overwrites current terminal line for clean live status display
function statusUpdate(msg) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(msg);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Polls getSignatureStatuses until commitment level is reached
async function waitForCommitment(signature, level, label) {
  const start = Date.now();
  while (true) {
    const result = spawnSync(
      "solana", ["confirm", signature, "--commitment", level],
      { encoding: "utf8" }
    );
    const out = (result.stdout + result.stderr).toLowerCase();
    if (out.includes("finalized") || out.includes("confirmed") || out.includes("ok")) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      statusUpdate(`[${label}] \u2705 reached in ${elapsed}s`);
      process.stdout.write("\n");
      return;
    }
    statusUpdate(`[${label}] \u23f3 waiting... (${((Date.now() - start)/1000).toFixed(1)}s)`);
    await sleep(500);
  }
}

async function main() {
  console.log("\nSolana Transfer Tool \u2014 with Confirmation Tracking");
  console.log("===================================================");
  console.log("Connected to Solana devnet.");

  const sender = run("solana address");
  console.log("Sender:    " + sender);
  console.log("Recipient: " + recipient);
  console.log("Amount:    " + amountNum + " SOL");

  const balanceRaw = run("solana balance");
  const balanceSol = Number(balanceRaw.replace(" SOL", ""));
  console.log("Sender balance: " + balanceSol + " SOL");

  if (balanceSol < amountNum + 0.000005) {
    console.error("\nError: Insufficient balance.");
    console.error("Need: " + (amountNum + 0.000005) + " SOL | Have: " + balanceSol + " SOL");
    process.exit(1);
  }

  console.log("\nSending transaction...");

  const raw = execSync(
    "solana transfer " + recipient + " " + amountNum + " --allow-unfunded-recipient",
    { encoding: "utf8" }
  );

  const lines = raw.split("\n");
  let signature = null;
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("Signature:")) {
      signature = t.replace("Signature:", "").trim();
      break;
    }
  }

  if (!signature) {
    console.error("Could not extract signature. Raw output:", raw);
    process.exit(1);
  }

  console.log("Signature: " + signature);
  console.log("\nTracking confirmation stages...");

  try {
    await waitForCommitment(signature, "confirmed", "Processed \u2192 Confirmed");
    await waitForCommitment(signature, "finalized", "Confirmed \u2192 Finalized");
  } catch (err) {
    console.error("\nTransaction failed:", err.message);
    process.exit(1);
  }

  const newBal = Number(run("solana balance").replace(" SOL", ""));

  console.log("\nTransaction successful! \uD83C\uDF89");
  console.log("Signature: " + signature);
  console.log("View on Solana Explorer:");
  console.log("https://explorer.solana.com/tx/" + signature + "?cluster=devnet");
  console.log("New sender balance: " + newBal + " SOL");
}

main();
