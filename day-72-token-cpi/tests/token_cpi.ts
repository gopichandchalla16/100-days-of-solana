import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { TokenCpi } from "../target/types/token_cpi";
import { strict as assert } from "assert";
import {
  TOKEN_2022_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  getAccount,
} from "@solana/spl-token";

describe("token_cpi", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.TokenCpi as Program<TokenCpi>;

  it("mints Token-2022 tokens through the program", async () => {
    const payer = (provider.wallet as anchor.Wallet).payer;
    const connection = provider.connection;

    const mint = await createMint(
      connection,
      payer,
      payer.publicKey,
      null,
      9,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
      false,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    const amount = new anchor.BN(1_000_000_000);

    await program.methods
      .mintTokens(amount)
      .accounts({
        signer: payer.publicKey,
        mint,
        tokenAccount: ata.address,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc();

    const account = await getAccount(
      connection,
      ata.address,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    console.log("Minted base units:", account.amount.toString());
    assert.equal(account.amount.toString(), amount.toString());
  });
});
