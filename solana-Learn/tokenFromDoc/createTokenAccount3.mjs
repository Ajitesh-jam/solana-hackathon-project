// create-token-account.js
// This script creates an Associated Token Account (ATA) for a specific wallet to hold tokens

import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createAssociatedTokenAccountIdempotent,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID
} from "@solana/spl-token";
import bs58 from "bs58";
import fs from "fs";

(async () => {
  console.log("🏦 Starting token account creation process...");
  
  try {
    // 1. Set up connection to Solana network
    // For local development use localhost, for testnet use 'testnet'
    const NETWORK = "http://127.0.0.1:8899";
    console.log(`💻 Connecting to Solana network: ${NETWORK}`);
    const connection = new Connection(NETWORK, "confirmed");
    console.log("✅ Connection established");
    
    // 2. Set up fee payer wallet (this account pays for the transaction)
    console.log("🔑 Setting up fee payer wallet...");
    const feePayer = Keypair.fromSecretKey(
      bs58.decode(
        "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
      )
    );
    console.log(`📝 Fee payer public key: ${feePayer.publicKey.toBase58()}`);
    
    // 3. Airdrop SOL to fee payer for transaction costs (only works on test networks)
    console.log("💰 Requesting airdrop of 1 SOL to fee payer...");
    const airdropAmount = 1 * LAMPORTS_PER_SOL; // 1 SOL
    const airdropSig = await connection.requestAirdrop(
      feePayer.publicKey,
      airdropAmount
    );
    console.log(`📡 Airdrop transaction signature: ${airdropSig}`);
    
    // Wait for airdrop confirmation
    console.log("⏳ Waiting for airdrop confirmation...");
    await connection.confirmTransaction(airdropSig);
    console.log("✅ Airdrop confirmed");
    
    // Check balance
    const balance = await connection.getBalance(feePayer.publicKey);
    console.log(`💰 Fee payer balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    // 4. Set up token owner wallet
    console.log("🔑 Setting up token owner wallet...");
    // This is the wallet that will own the tokens
    const owner = Keypair.fromSecretKey(
      bs58.decode(
        "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
      )
    );
    console.log(`📝 Token owner public key: ${owner.publicKey.toBase58()}`);

    // 5. Get token mint address
    let mintPubkey;
    
    if (process.argv.length > 2) {
      // If provided as command line argument
      mintPubkey = new PublicKey(process.argv[2]);
      console.log(`🪙 Using mint address from command line: ${mintPubkey.toBase58()}`);
    } else {
      // Try to read from token-info.json
      try {
        const tokenInfo = JSON.parse(fs.readFileSync("token-info.json", "utf8"));
        mintPubkey = new PublicKey(tokenInfo.mintAddress);
        console.log(`🪙 Using mint address from token-info.json: ${mintPubkey.toBase58()}`);
      } catch (e) {
        console.error("❌ Could not find token-info.json.");
        console.log("Please provide a mint address as a command line argument or create a token first.");
        process.exit(1);
      }
    }

    // 6. Try to create an Associated Token Account using both TOKEN_PROGRAM_ID and TOKEN_2022_PROGRAM_ID
    console.log("🏦 Creating Associated Token Account (ATA)...");
    console.log("First trying with TOKEN_PROGRAM_ID...");

    console.log("🔑 Creating ATA for owner...",owner.publicKey);

    //const secretKey = Uint8Array.from(process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD.split(",").map(Number));
    const secretKey = Uint8Array.from(process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD.split(",").map(Number));

    const walletKeypair = Keypair.fromSecretKey(secretKey);
    console.log(`📝 Wallet public key: ${walletKeypair.publicKey.toBase58()}`);
    
    let ata;
    try {
      // Method 1: Using TOKEN_PROGRAM_ID (standard SPL tokens)
      ata = await createAssociatedTokenAccountIdempotent(
        connection,       // connection
        feePayer,         // fee payer
        mintPubkey,       // mint
        walletKeypair.publicKey,  // owner
        undefined,        // confirmation options
        TOKEN_PROGRAM_ID  // token program ID
      );
      console.log("✅ Token account created successfully with TOKEN_PROGRAM_ID!");
    } catch (error) {
      console.log("❌ Failed with TOKEN_PROGRAM_ID, trying TOKEN_2022_PROGRAM_ID...");
      
      try {
        // Method 2: Using TOKEN_2022_PROGRAM_ID (newer token standard)
        ata = await createAssociatedTokenAccountIdempotent(
          connection,         // connection
          feePayer,           // fee payer
          mintPubkey,         // mint
          walletKeypair.publicKey,    // owner
          undefined,          // confirmation options
          TOKEN_2022_PROGRAM_ID // token program ID
        );
        console.log("✅ Token account created successfully with TOKEN_2022_PROGRAM_ID!");
      } catch (error2) {
        console.error("❌ Failed to create token account with either program ID:");
        console.error(error2);
        process.exit(1);
      }
    }
    
    console.log(`📝 Associated Token Account address: ${ata.toBase58()}`);
    
    // 7. Save token account info to a file
    const accountInfo = {
      tokenMint: mintPubkey.toBase58(),
      tokenAccount: ata.toBase58(),
      owner: walletKeypair.publicKey.toBase58(),
    };
    
    fs.writeFileSync("token-account-info.json", JSON.stringify(accountInfo, null, 2));
    console.log("💾 Token account information saved to token-account-info.json");
    
    console.log("\n✨ Associated Token Account (ATA) created successfully! ✨");
    console.log("=== Account Details ===");
    console.log(`Token Mint: ${mintPubkey.toBase58()}`);
    console.log(`Token Account: ${ata.toBase58()}`);
    console.log(`Owner: ${walletKeypair.publicKey.toBase58()}`);
    
    console.log("\n🎉 Next steps would be to:");
    console.log("1. Mint tokens to this account");
    console.log("2. Check your token balance");
    
  } catch (error) {
    console.error("❌ Error creating token account:", error);
    process.exit(1);
  }
})();