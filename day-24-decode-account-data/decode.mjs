import { createSolanaRpc, address, getBase58Encoder } from "@solana/kit";
import { getMintDecoder } from "@solana-program/token";

const WSOL = "So11111111111111111111111111111111111111112";
const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");

async function main() {
  const res = await rpc.getAccountInfo(address(WSOL), { encoding: "base64" }).send();
  const info = res.value;
  const rawBytes = Buffer.from(info.data[0], "base64");

  console.log("\n====== RAW ACCOUNT INFO ======\n");
  console.log("Address:", WSOL);
  console.log("Owner  :", info.owner.toString());
  console.log("Bytes  :", rawBytes.length);
  console.log("Hex    :", rawBytes.toString("hex").slice(0, 64) + "...");

  console.log("\n====== 1. CODEC DECODE (getMintDecoder) ======\n");
  const mint = getMintDecoder().decode(new Uint8Array(rawBytes));
  console.log("Mint Authority  :", mint.mintAuthority.__option === "Some" ? mint.mintAuthority.value.toString() : "(none)");
  console.log("Supply          :", mint.supply.toLocaleString());
  console.log("Decimals        :", mint.decimals);
  console.log("Is Initialized  :", mint.isInitialized);
  console.log("Freeze Authority:", mint.freezeAuthority.__option === "Some" ? mint.freezeAuthority.value.toString() : "(none)");

  console.log("\n====== 2. MANUAL DECODE (DataView byte-by-byte) ======\n");
  const view = new DataView(rawBytes.buffer, rawBytes.byteOffset, rawBytes.byteLength);
  const mintAuthOpt = view.getUint32(0, true);
  const supply = view.getBigUint64(36, true);
  const decimals = view.getUint8(44);
  const isInit = view.getUint8(45) === 1;
  const freezeOpt = view.getUint32(46, true);
  const manualMintAuth = mintAuthOpt === 1 ? getBase58Encoder().encode(new Uint8Array(rawBytes.slice(4, 36))) : "(none)";
  const manualFreezeAuth = freezeOpt === 1 ? getBase58Encoder().encode(new Uint8Array(rawBytes.slice(50, 82))) : "(none)";
  console.log("mintAuthorityOption:", mintAuthOpt, mintAuthOpt === 1 ? "(present)" : "(none)");
  console.log("Mint Authority     :", manualMintAuth);
  console.log("Supply (u64 LE)    :", supply.toLocaleString());
  console.log("Decimals (u8)      :", decimals);
  console.log("Is Initialized     :", isInit);
  console.log("freezeAuthorityOpt :", freezeOpt, freezeOpt === 1 ? "(present)" : "(none)");
  console.log("Freeze Authority   :", manualFreezeAuth);

  console.log("\n====== 3. RPC jsonParsed COMPARISON ======\n");
  const pr = await rpc.getAccountInfo(address(WSOL), { encoding: "jsonParsed" }).send();
  const p = pr.value?.data?.parsed?.info;
  if (p) {
    console.log("Mint Authority  :", p.mintAuthority ?? "(none)");
    console.log("Supply          :", BigInt(p.supply).toLocaleString());
    console.log("Decimals        :", p.decimals);
    console.log("Is Initialized  :", p.isInitialized);
    console.log("Freeze Authority:", p.freezeAuthority ?? "(none)");
  }

  console.log("\n====== MATCH CHECK ======\n");
  console.log("Supply match   (codec vs manual):", mint.supply === supply);
  console.log("Decimals match (codec vs manual):", mint.decimals === decimals);
}

main().catch(console.error);
