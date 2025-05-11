import {
    address,
    airdropFactory,
    createKeyPairSignerFromBytes,
    createSolanaClient,
    createTransaction,
    lamports,
    signTransactionMessageWithSigners
  } from "gill";
  import {
    getAssociatedTokenAccountAddress,
    getCreateAssociatedTokenIdempotentInstruction,
    TOKEN_2022_PROGRAM_ADDRESS,
    TOKEN_PROGRAM_ADDRESS
    // @ts-ignore
  } from "gill/programs/token";
  import bs58 from "bs58";
  import { Keypair } from "@solana/web3.js";
  import dotenv from "dotenv";
  dotenv.config();
  const { rpc, rpcSubscriptions, sendAndConfirmTransaction } = createSolanaClient(
    {
      urlOrMoniker: "devnet" // or `mainnet`, `localnet`, etc
    }
  );
  
  const secretKey = Uint8Array.from(
    process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD
  );

  // Base58 encode the secret key
  const base58SecretKey = bs58.encode(secretKey);

  // Pass it to createKeyPairSignerFromBytes
  const signer = await createKeyPairSignerFromBytes(bs58.decode(base58SecretKey));
  console.log("signer:", signer.address);
  // await airdropFactory({ rpc, rpcSubscriptions })({
  //   commitment: "confirmed",
  //   lamports: lamports(5_000_000n),
  //   recipientAddress: signer.address
  // });
  
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  
  const tokenProgram = TOKEN_PROGRAM_ADDRESS;
  const mint = address("7nMwDDpFEc7PcAnnAmw8njf7o3dWNKvp8FHBabMW455q");
  
  const destination = address("gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD");
  const destinationAta = await getAssociatedTokenAccountAddress(
    mint,
    destination,
    tokenProgram
  );


  const ata = await getCreateAssociatedTokenIdempotentInstruction({
    mint,
    payer: signer,
    tokenProgram,
    owner: destination,
    ata: destinationAta
  })

  console.log("ata:", ata);
  
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
      })
    ],
    latestBlockhash
  });
  
  const signedTransaction = await signTransactionMessageWithSigners(transaction);
  
  await sendAndConfirmTransaction(signedTransaction);