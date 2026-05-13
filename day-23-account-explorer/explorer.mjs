import { createSolanaRpc, address } from "@solana/kit";

const KNOWN_PROGRAMS = {
  "11111111111111111111111111111111": "System Program",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA": "SPL Token Program",
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bE5": "Associated Token Program",
  "BPFLoaderUpgradeab1e11111111111111111111111": "BPF Loader (Upgradeable)",
  "NativeLoader1111111111111111111111111111111": "Native Loader",
  "ComputeBudget111111111111111111111111111111": "Compute Budget Program",
};

const rpc = createSolanaRpc("https://api.devnet.solana.com");

const inputAddress = process.argv[2];
if (!inputAddress) {
  console.error("\n❌  Usage: node explorer.mjs <SOLANA_ADDRESS>\n");
  process.exit(1);
}

async function exploreAccount(addr) {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║        🔭  Solana Account Explorer  (devnet)            ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");
  console.log(`📍 Address : ${addr}\n`);

  try {
    const balanceResult = await rpc.getBalance(address(addr)).send();
    const lamportValue = balanceResult.value;
    const solValue = Number(lamportValue) / 1_000_000_000;

    const accountResult = await rpc
      .getAccountInfo(address(addr), { encoding: "base64" })
      .send();

    const info = accountResult.value;

    if (!info) {
      console.log("⚠️  Account not found or not yet on-chain.\n");
      return;
    }

    const ownerAddr = info.owner.toString();
    const ownerName = KNOWN_PROGRAMS[ownerAddr] || "Unknown Program";

    const dataRaw = info.data[0];
    const dataBytes = Buffer.from(dataRaw, "base64");
    const dataLength = dataBytes.length;
    const dataPreview =
      dataLength > 0
        ? dataBytes.slice(0, 32).toString("hex") + (dataLength > 32 ? "..." : "")
        : "(empty — wallet account)";

    const accountType = info.executable
      ? "🟢 Program (Executable)"
      : "🔵 Data Account (Wallet / State)";

    console.log("┌─────────────────────────────────────────────────────────┐");
    console.log(`│  💰 Balance     : ${solValue.toFixed(9)} SOL`);
    console.log(`│  ⚡ Lamports    : ${lamportValue.toLocaleString()}`);
    console.log(`│  👑 Owner       : ${ownerAddr}`);
    console.log(`│  📛 Owner Name  : ${ownerName}`);
    console.log(`│  🚀 Executable  : ${info.executable}`);
    console.log(`│  📦 Data Size   : ${dataLength} bytes`);
    console.log(`│  🔢 Rent Epoch  : ${info.rentEpoch}`);
    console.log(`│  🏷️  Type        : ${accountType}`);
    console.log("├─────────────────────────────────────────────────────────┤");
    console.log(`│  🗂️  Data Preview: ${dataPreview}`);
    console.log("└─────────────────────────────────────────────────────────┘\n");

  } catch (err) {
    console.error(`\n❌ Error: ${err.message}\n`);
  }
}

exploreAccount(inputAddress);
