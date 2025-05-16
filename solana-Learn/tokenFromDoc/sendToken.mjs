import {
    Connection,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction
  } from "@solana/web3.js";
  import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    createTransferInstruction
  } from "@solana/spl-token";
  import bs58 from "bs58";
  
  (async () => {
    // Connect to cluster
    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  
    // Generate a new wallet keypair and airdrop SOL
    const fromWallet = Keypair.fromSecretKey(
      bs58.decode(
        "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
      )
    );
  
    const fromAirdropSignature = await connection.requestAirdrop(
      fromWallet.publicKey,
      LAMPORTS_PER_SOL
    );
    // Wait for airdrop confirmation
    await connection.confirmTransaction(fromAirdropSignature);
  
    // Generate a new wallet to receive newly minted token
    //const secretKey = Uint8Array.from(process.env.PVT_KEY_ownerAddress.split(",").map(Number));
    const secretKey = Uint8Array.from(process.env.PVT_KEY_ownerAddress.split(",").map(Number));

    const walletKeypair = Keypair.fromSecretKey(secretKey);
    console.log(`📝 Wallet public key: ${walletKeypair.publicKey.toBase58()}`);

    const toWallet = walletKeypair;
  
    // Create new token mint
    const mint = await createMint(
      connection,
      fromWallet,
      fromWallet.publicKey,
      null,
      9
    );
  
    // Get the token account of the fromWallet Solana address, if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    );
  
    //get the token account of the toWallet Solana address, if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      toWallet.publicKey
    );
  
    // Minting 1 new token to the "fromTokenAccount" account we just returned/created
    await mintTo(
      connection,
      fromWallet,
      mint,
      fromTokenAccount.address,
      fromWallet.publicKey,
      1000000000, // it's 1 token, but in lamports
      []
    );
  
    // Add token transfer instructions to transaction
    const transaction = new Transaction().add(
      createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        1
      )
    );
  
    // Sign transaction, broadcast, and confirm
    await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
  })();