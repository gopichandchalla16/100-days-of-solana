import { generateKeyPairSigner, createSolanaRpc, devnet, address } from "@solana/kit";

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

// ✅ My funded wallet address from Day 1
const MY_WALLET = "HfxgnpDoqzSGfvX9SftvPSdc18TntyYUcAVXxrbsjwMt";

console.log("Checking balance for:", MY_WALLET);

const { value: balance } = await rpc.getBalance(address(MY_WALLET)).send();
const balanceInSol = Number(balance) / 1_000_000_000;

console.log(`Balance: ${balanceInSol} SOL`);
console.log(`\nView on Explorer: https://explorer.solana.com/address/${MY_WALLET}?cluster=devnet`);
