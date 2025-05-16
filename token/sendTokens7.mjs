import {
    address,
    createSolanaClient,
    createTransaction,
    getExplorerLink,
    getSignatureFromTransaction,
    signTransactionMessageWithSigners,
    createKeyPairSignerFromBytes
  } from "gill";
  import { loadKeypairSignerFromFile } from "gill/node";
  import {
    getAssociatedTokenAccountAddress,
    getCreateAssociatedTokenIdempotentInstruction,
    getTransferInstruction,
    TOKEN_2022_PROGRAM_ADDRESS,
    TOKEN_PROGRAM_ADDRESS,
    getTransferTokensInstructions,
    buildTransferTokensTransaction
  } from "gill/programs/token";
  import bs58 from "bs58";
  import { Keypair } from "@solana/web3.js";
  import dotenv from "dotenv";
  dotenv.config();

  const secretKey = Uint8Array.from(
    process.env.PVT_KEY_ownerAddress
  );

// Base58 encode the secret key
const base58SecretKey = bs58.encode(secretKey);

// Pass it to createKeyPairSignerFromBytes
const signer = await createKeyPairSignerFromBytes(bs58.decode(base58SecretKey));
  
  const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: "devnet"
  });
  
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  
  const mint = address("MINT_ADDRESS");
  const tokenProgram = TOKEN_PROGRAM_ADDRESS; // use the correct program for the `mint`
  
  const destination = address("FwihGJFQ2Qe1p5hfsLMokFosfm5wMWD3nDZYnD8M9bt6");
    const destinationAta = await getAssociatedTokenAccountAddress(
    mint,
    destination,
    tokenProgram
    );
    console.log("destinationAta:", destinationAta);
 
  
  const sourceAta = await getAssociatedTokenAccountAddress(
    mint,
    signer.address,
    tokenProgram
  );
  console.log("sourceAta:", sourceAta);
  
  /**
   * instead of manually crafting the two instructions below, and deriving the ata's above:
   * you could use the `getTransferTokensInstructions()` function to simplify this code
   */
  console.log("Start transaction");
  const transaction = createTransaction({
    feePayer: signer,
    version: "legacy",
    instructions: [
      // create idempotent will gracefully fail if the ata already exists. this is the gold standard!
      getCreateAssociatedTokenIdempotentInstruction({
        mint,
        payer: signer,
        tokenProgram,
        owner: destination,
        ata: destinationAta
      }),
      getTransferInstruction(
        {
          source: sourceAta,
          authority: signer,
          destination: destinationAta,
          amount: 1_000_000_000n // 1 token, 9 decimals
        },
        { programAddress: tokenProgram }
      )
    ],
    latestBlockhash
  });
  
  // instead of the above, you can also simplify with `buildTransferTokensTransaction()`
//   const transaction2 = await buildTransferTokensTransaction({
//     feePayer: signer,
//     version: "legacy",
//     latestBlockhash,
//     amount: 1_000_000,
//     authority: signer,
//     destination: destination,
//     mint,
//     tokenProgram
//   });
  
  const signedTransaction = await signTransactionMessageWithSigners(transaction);
  
  await sendAndConfirmTransaction(signedTransaction);