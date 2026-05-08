import { Connection, Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import fs from "fs";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Load funded wallet
const keypairPath = process.env.HOME + "/.config/solana/id.json";
const secret = JSON.parse(fs.readFileSync(keypairPath, "utf8"));
const sender = Keypair.fromSecretKey(Uint8Array.from(secret));

// Load broke wallet (zero balance)
const brokeSecret = JSON.parse(fs.readFileSync("/tmp/broke-wallet.json", "utf8"));
const broke = Keypair.fromSecretKey(Uint8Array.from(brokeSecret));

console.log("Sender:", sender.publicKey.toBase58());
console.log("Broke wallet:", broke.publicKey.toBase58());
console.log("\nAttempting to send 9999 SOL (way more than balance...");
console.log("skipPreflight: true — bypassing local check, sending to chain...\n");

// Build tx that will fail on-chain: 9999 SOL >> actual balance
const tx = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: broke.publicKey,
    lamports: 9999 * LAMPORTS_PER_SOL,
  })
);

const { blockhash } = await connection.getLatestBlockhash();
tx.recentBlockhash = blockhash;
tx.feePayer = sender.publicKey;
tx.sign(sender);

const rawTx = tx.serialize();

try {
  // skipPreflight: true bypasses simulation — tx reaches chain and fails there
  const sig = await connection.sendRawTransaction(rawTx, { skipPreflight: true });
  console.log("Transaction sent (will fail on-chain)!");
  console.log("Signature:", sig);
  console.log("Explorer:", `https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  console.log("\nNow run:");
  console.log(`solana confirm -v ${sig} --url devnet`);
} catch (err) {
  console.error("Send error:", err.message);
}
