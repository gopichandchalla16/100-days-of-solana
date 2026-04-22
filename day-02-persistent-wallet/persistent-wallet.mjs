import {
  createSolanaRpc,
  devnet,
  generateKeyPairSigner,
  createKeyPairSignerFromBytes,
} from "@solana/kit";
import { readFile, writeFile } from "node:fs/promises";

const WALLET_FILE = "wallet.json";
const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

async function loadOrCreateWallet() {
  try {
    // Try to load an existing wallet
    const data = JSON.parse(await readFile(WALLET_FILE, "utf-8"));
    const secretBytes = new Uint8Array(data.secretKey);
    const wallet = await createKeyPairSignerFromBytes(secretBytes);
    console.log("Loaded existing wallet:", wallet.address);
    return wallet;
  } catch {
    // No wallet file found — create a new extractable one
    const wallet = await generateKeyPairSigner(true);

    // Export private key using pkcs8 (raw not supported for Ed25519 in Node.js)
    const pkcs8 = await crypto.subtle.exportKey(
      "pkcs8",
      wallet.keyPair.privateKey
    );
    const privateKeyBytes = new Uint8Array(pkcs8, pkcs8.byteLength - 32, 32);

    // Export public key in raw format
    const publicKeyBytes = new Uint8Array(
      await crypto.subtle.exportKey("raw", wallet.keyPair.publicKey)
    );

    // Solana keypair format: 64 bytes (32 private + 32 public)
    const keypairBytes = new Uint8Array(64);
    keypairBytes.set(privateKeyBytes, 0);
    keypairBytes.set(publicKeyBytes, 32);

    await writeFile(
      WALLET_FILE,
      JSON.stringify({ secretKey: Array.from(keypairBytes) }, null, 2)
    );

    console.log("Created new wallet:", wallet.address);
    console.log(`Saved to ${WALLET_FILE} (do NOT commit this file)`);
    return wallet;
  }
}

const wallet = await loadOrCreateWallet();

// Check balance
const { value: balance } = await rpc.getBalance(wallet.address).send();
const balanceInSol = Number(balance) / 1_000_000_000;

console.log(`\nAddress: ${wallet.address}`);
console.log(`Balance: ${balanceInSol} SOL`);

if (balanceInSol === 0) {
  console.log("\nThis wallet has no SOL. Visit https://faucet.solana.com/ and airdrop to:");
  console.log(wallet.address);
}
