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
    TOKEN_2022_PROGRAM_ADDRESS
    // @ts-ignore
  } from "gill/programs/token";
  import bs58 from "bs58";
  
  const { rpc, rpcSubscriptions, sendAndConfirmTransaction } = createSolanaClient(
    {
      urlOrMoniker: "http://127.0.0.1:8899" // or `mainnet`, `localnet`, etc
    }
  );
  
  const signer = await createKeyPairSignerFromBytes(
    bs58.decode(
      "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
    )
  );
  await airdropFactory({ rpc, rpcSubscriptions })({
    commitment: "confirmed",
    lamports: lamports(5_000_000n),
    recipientAddress: signer.address
  });
  
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  
  const tokenProgram = TOKEN_2022_PROGRAM_ADDRESS;
  const mint = address("8mAKLjGGmjKTnmcXeyr3pr7iX13xXVjJJiL6RujDbSPV");
  
  const destination = address("nick6zJc6HpW3kfBm4xS2dmbuVRyb5F3AnUvj5ymzR5");
  const destinationAta = await getAssociatedTokenAccountAddress(
    mint,
    destination,
    tokenProgram
  );
  
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