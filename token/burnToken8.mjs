import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  burnChecked,
} from "@solana/spl-token";
import bs58 from "bs58";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  // Connect to devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Secret key as Uint8Array
  const secretKey = Uint8Array.from(process.env.PVT_KEY_ownerAddress);

  // Convert to Keypair for Solana compatibility
  const keypair = Keypair.fromSecretKey(secretKey);
  const feePayer = keypair;

  // Optional: Airdrop some SOL if needed
  // const airdropSig = await connection.requestAirdrop(feePayer.publicKey, 1_000_000_000);
  // await connection.confirmTransaction(airdropSig);

  // Step 1: Create a new mint
  const mintAuthority = feePayer;
  const freezeAuthority = feePayer;
  const decimals = 2;

  console.log("Creating mint...");
  const mint = await createMint(
    connection,
    feePayer,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    decimals
  );
  console.log("Mint created:", mint.toBase58());

  // Step 2: Create Associated Token Account
  console.log("Creating token account...");
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    feePayer,
    mint,
    feePayer.publicKey
  );
  console.log("Token account:", tokenAccount.address.toBase58());

//   // Step 3: Mint tokens
//   const amountToMint = 100;
//   console.log("Minting tokens...");
//   const mintTx = await mintTo(
//     connection,
//     feePayer,
//     mint,
//     tokenAccount.address,
//     mintAuthority,
//     amountToMint
//   );
//   console.log("Mint transaction:", mintTx);

  // Step 4: Burn tokens
  const amountToBurn = 5n; // 5 tokens in decimals (not 500_000_000n, since decimals = 2)
  console.log("Burning tokens...");
  const burnTx = await burnChecked(
    connection,
    feePayer,
    tokenAccount.address,
    mint,
    feePayer,
    amountToBurn,
    decimals
  );
  console.log("Burn transaction:", burnTx);
})();
