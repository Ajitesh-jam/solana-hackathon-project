// import {
//   clusterApiUrl,
//   Connection,
//   Keypair,
//   sendAndConfirmTransaction,
//   SystemProgram,
//   Transaction
// } from "@solana/web3.js";
// import {
//   createInitializeMintInstruction,
//   TOKEN_PROGRAM_ID,
//   MINT_SIZE,
//   getMinimumBalanceForRentExemptMint,
//   createMint
// } from "@solana/spl-token";
// import bs58 from "bs58";



// import * as bip39 from "bip39";

// import dotenv from "dotenv";
// dotenv.config();


// (async () => {
//   await new Promise(resolve => setTimeout(resolve, 2000));

//   if(!process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD) {
//     console.log("Please set your PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD in .env file");
//     return;
//   }
//   console.log("Create Token");
//   // connection
//   const connection = new Connection("http://127.0.0.1:8899", "confirmed");

//   const recentBlockhash = await connection.getLatestBlockhash();
//   console.log("Block has :",recentBlockhash);

//   // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8

//   const seed = bip39.mnemonicToSeedSync(process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD,"");
//   const keypair = Keypair.fromSeed(seed.slice(0, 32));
//   // const feePayer = Keypair.fromSecretKey(
//   //   bs58.decode(
//   //     "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
//   //   )
//   // );
//   const feePayer = keypair;
//   const airdropSig = await connection.requestAirdrop(
//     feePayer.publicKey,
//     1000000000
//   );
//   await connection.confirmTransaction(airdropSig);
  
//   // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
//   const seed2 = bip39.mnemonicToSeedSync(process.env.PVT_KEY_7uTyuTjttWfUrmnauLvNYYCLTZSfUMfTmCBkJ8kKP5q7,"");
//   const keypair2 = Keypair.fromSeed(seed2.slice(0, 32));
//   const alice = keypair2;

//   // 1) use build-in function
//   let mintPubkey = await createMint(
//     connection, // connection
//     feePayer, // fee payer
//     alice.publicKey, // mint authority
//     alice.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
//     8 // decimals
//   );
//   console.log(`mint: ${mintPubkey.toBase58()}`);

//   // or

//   // 2) compose by yourself
//   const mint = Keypair.generate();
//   console.log(`mint: ${mint.publicKey.toBase58()}`);

//   const transaction = new Transaction().add(
//     // create mint account
//     SystemProgram.createAccount({
//       fromPubkey: feePayer.publicKey,
//       newAccountPubkey: mint.publicKey,
//       space: MINT_SIZE,
//       lamports: await getMinimumBalanceForRentExemptMint(connection),
//       programId: TOKEN_PROGRAM_ID
//     }),
//     // init mint account
//     createInitializeMintInstruction(
//       mint.publicKey, // mint pubkey
//       8, // decimals
//       alice.publicKey, // mint authority
//       alice.publicKey // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
//     )
//   );

//   // Send transaction
//   const transactionSignature = await sendAndConfirmTransaction(
//     connection,
//     transaction,
//     [feePayer, mint] // Signers
//   );

//   console.log(`txhash: ${transactionSignature}`);
// })();

import {
  clusterApiUrl,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  createMint
} from "@solana/spl-token";
import bs58 from "bs58";

(async () => {
  // connection
  const connection = new Connection(
    clusterApiUrl("http://127.0.0.1:8899"),
    "confirmed"
  );
  const recentBlockhash = await connection.getLatestBlockhash();

  // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
  const feePayer = Keypair.fromSecretKey(
    bs58.decode(
      "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
    )
  );
  const airdropSig = await connection.requestAirdrop(
    feePayer.publicKey,
    1000000000
  );
  await connection.confirmTransaction(airdropSig);

  // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
  const alice = Keypair.fromSecretKey(
    bs58.decode(
      "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
    )
  );

  // 1) use build-in function
  let mintPubkey = await createMint(
    connection, // connection
    feePayer, // fee payer
    alice.publicKey, // mint authority
    alice.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
    8 // decimals
  );
  console.log(`mint: ${mintPubkey.toBase58()}`);

  // or

  // 2) compose by yourself
  const mint = Keypair.generate();
  console.log(`mint: ${mint.publicKey.toBase58()}`);

  const transaction = new Transaction().add(
    // create mint account
    SystemProgram.createAccount({
      fromPubkey: feePayer.publicKey,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports: await getMinimumBalanceForRentExemptMint(connection),
      programId: TOKEN_PROGRAM_ID
    }),
    // init mint account
    createInitializeMintInstruction(
      mint.publicKey, // mint pubkey
      8, // decimals
      alice.publicKey, // mint authority
      alice.publicKey // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
    )
  );

  // Send transaction
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [feePayer, mint] // Signers
  );

  console.log(`txhash: ${transactionSignature}`);
})();



