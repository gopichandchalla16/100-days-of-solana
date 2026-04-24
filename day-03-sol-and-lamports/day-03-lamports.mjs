import { readFile } from "node:fs/promises";
import {
  createSolanaRpc,
  devnet,
  createKeyPairSignerFromBytes,
} from "@solana/kit";

// Load persistent wallet from Day 2
const data = JSON.parse(await readFile("../day-02-persistent-wallet/wallet.json", "utf-8"));
const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
const wallet = await createKeyPairSignerFromBytes(new Uint8Array(data.secretKey));

// Get balance in lamports (what Solana actually stores)
const { value: balanceLamports } = await rpc.getBalance(wallet.address).send();

// Convert to SOL (human-readable)
const LAMPORTS_PER_SOL = 1_000_000_000;
const balanceSol = Number(balanceLamports) / LAMPORTS_PER_SOL;

console.log("Day 3: SOL and Lamports");
console.log("=========================\n");
console.log(`Wallet Address: ${wallet.address}`);
console.log(`Balance in SOL: ${balanceSol}`);
console.log(`Balance in Lamports: ${balanceLamports}`);
console.log(`\n--- Conversion Math ---`);
console.log(`${balanceSol} SOL x 1,000,000,000 = ${balanceLamports} lamports`);
console.log(`${balanceLamports} lamports / 1,000,000,000 = ${balanceSol} SOL`);
console.log(`\n--- Common Denominations ---`);
console.log(`1 SOL        = 1,000,000,000 lamports`);
console.log(`Tx fee       = 5,000 lamports (0.000005 SOL)`);
console.log(`Devnet drop  = 2,000,000,000 lamports (2 SOL)`);
console.log(`Rent (basic) = 890,880 lamports (~0.00089 SOL)`);
