import { createSolanaRpc, devnet, address } from "@solana/kit";

// Connect to Solana devnet
const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

// Token-2022 program address — always has a non-zero balance (safe demo target)
const targetAddress = address("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");

// Query the balance — just like calling a REST API, no API key needed
const { value: balanceInLamports } = await rpc
  .getBalance(targetAddress)
  .send();

// 1 SOL = 1,000,000,000 lamports (learned on Day 3)
const balanceInSol = Number(balanceInLamports) / 1_000_000_000;

console.log(`Address: ${targetAddress}`);
console.log(`Balance: ${balanceInSol} SOL`);
