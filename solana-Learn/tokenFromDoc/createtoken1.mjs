// // import {
// //   clusterApiUrl,
// //   Connection,
// //   Keypair,
// //   sendAndConfirmTransaction,
// //   SystemProgram,
// //   Transaction
// // } from "@solana/web3.js";
// // import {
// //   createInitializeMintInstruction,
// //   TOKEN_PROGRAM_ID,
// //   MINT_SIZE,
// //   getMinimumBalanceForRentExemptMint,
// //   createMint
// // } from "@solana/spl-token";
// // import bs58 from "bs58";



// // import * as bip39 from "bip39";

// // import dotenv from "dotenv";
// // dotenv.config();


// // (async () => {
// //   await new Promise(resolve => setTimeout(resolve, 2000));

// //   if(!process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD) {
// //     console.log("Please set your PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD in .env file");
// //     return;
// //   }
// //   console.log("Create Token");
// //   // connection
// //   const connection = new Connection("http://127.0.0.1:8899", "confirmed");

// //   const recentBlockhash = await connection.getLatestBlockhash();
// //   console.log("Block has :",recentBlockhash);

// //   // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8

// //   const seed = bip39.mnemonicToSeedSync(process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD,"");
// //   const keypair = Keypair.fromSeed(seed.slice(0, 32));
// //   // const feePayer = Keypair.fromSecretKey(
// //   //   bs58.decode(
// //   //     "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
// //   //   )
// //   // );
// //   const feePayer = keypair;
// //   const airdropSig = await connection.requestAirdrop(
// //     feePayer.publicKey,
// //     1000000000
// //   );
// //   await connection.confirmTransaction(airdropSig);
  
// //   // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
// //   const seed2 = bip39.mnemonicToSeedSync(process.env.PVT_KEY_7uTyuTjttWfUrmnauLvNYYCLTZSfUMfTmCBkJ8kKP5q7,"");
// //   const keypair2 = Keypair.fromSeed(seed2.slice(0, 32));
// //   const alice = keypair2;

// //   // 1) use build-in function
// //   let mintPubkey = await createMint(
// //     connection, // connection
// //     feePayer, // fee payer
// //     alice.publicKey, // mint authority
// //     alice.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
// //     8 // decimals
// //   );
// //   console.log(`mint: ${mintPubkey.toBase58()}`);

// //   // or

// //   // 2) compose by yourself
// //   const mint = Keypair.generate();
// //   console.log(`mint: ${mint.publicKey.toBase58()}`);

// //   const transaction = new Transaction().add(
// //     // create mint account
// //     SystemProgram.createAccount({
// //       fromPubkey: feePayer.publicKey,
// //       newAccountPubkey: mint.publicKey,
// //       space: MINT_SIZE,
// //       lamports: await getMinimumBalanceForRentExemptMint(connection),
// //       programId: TOKEN_PROGRAM_ID
// //     }),
// //     // init mint account
// //     createInitializeMintInstruction(
// //       mint.publicKey, // mint pubkey
// //       8, // decimals
// //       alice.publicKey, // mint authority
// //       alice.publicKey // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
// //     )
// //   );

// //   // Send transaction
// //   const transactionSignature = await sendAndConfirmTransaction(
// //     connection,
// //     transaction,
// //     [feePayer, mint] // Signers
// //   );

// //   console.log(`txhash: ${transactionSignature}`);
// // })();





// import {
//   clusterApiUrl,
//   Connection,
//   Keypair,
//   sendAndConfirmTransaction,
//   SystemProgram,
//   Transaction,
//   PublicKey
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

// if (!process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD) {
//   throw new Error("Environment variable PVT_KEY_Cq4xMP2aGabszie3CVYrZCEFD29SPSxYhSjdEwENZai5 is not set");
// }
// //const secretKey = Uint8Array.from(process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD.split(",").map(Number));
// const secretKey = Uint8Array.from(process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD.split(",").map(Number));

// const walletKeypair = Keypair.fromSecretKey(secretKey);

// (async () => {
//   // --- Step 1: Connect to local Solana validator ---
//   const connection = new Connection("http://127.0.0.1:8899", "confirmed");
//   console.log("Connected to local Solana validator");

//   // --- Step 2: Define fee payer account ---

//   const feePayer = walletKeypair;
//   console.log("Fee payer public key:", feePayer.publicKey.toBase58());

//   // --- Step 3: Fund fee payer with SOL ---
//   const airdropSig = await connection.requestAirdrop(
//     feePayer.publicKey,
//     1_000_000_000 // 1 SOL
//   );
//   await connection.confirmTransaction(airdropSig);
//   console.log("Airdropped 1 SOL to fee payer");

//   // --- Step 4: Define the mint authority (who can mint tokens) ---
//   console.log("Mint authority (Alice) public key:", feePayer.publicKey.toBase58());
//   //console.log("pvt key:",PVT_KEY_Cq4xMP2aGabszie3CVYrZCEFD29SPSxYhSjdEwENZai5 );

//   const alice = Keypair.fromSecretKey(
//     bs58.decode(
//       "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
//       //process.env.PVT_KEY_Cq4xMP2aGabszie3CVYrZCEFD29SPSxYhSjdEwENZai5 
//       //"0x764a514b2806204b6f0b55e73c342d0fb390152c13aff64d4d15f2604226a61b"
//     )
//   );
//   console.log("Mint authority (Alice) public key:", alice.publicKey.toBase58());

//   // ==========================================
//   // Option 1: Use `createMint()` helper function
//   // ==========================================

//   const mintPubkey = await createMint(
//     connection,          // Solana connection
//     feePayer,            // Payer for transaction and rent
//     alice.publicKey,     // Mint authority (can mint more tokens)
//     alice.publicKey,     // Freeze authority (can freeze token accounts)
//     8                    // Decimal places (like USDC = 6, BTC = 8)
//   );

//   console.log(`✅ [Method 1] Mint created with address: ${mintPubkey.toBase58()}`);


//   // ==========================================
//   // Option 2: Do it manually step-by-step
//   // ==========================================

//   const mint = Keypair.generate(); // This will be the new mint account
//   console.log(`🔧 [Method 2] Generated new mint public key: ${mint.publicKey.toBase58()}`);

//   // Get minimum lamports for rent-exemption
//   const lamports = await getMinimumBalanceForRentExemptMint(connection);
//   console.log("Minimum lamports for rent-exempt mint:", lamports);

//   const transaction = new Transaction().add(
//     // Create mint account (on-chain)
//     SystemProgram.createAccount({
//       fromPubkey: feePayer.publicKey,
//       newAccountPubkey: mint.publicKey,
//       space: MINT_SIZE,
//       lamports,
//       programId: TOKEN_PROGRAM_ID,
//     }),
//     // Initialize the mint
//     createInitializeMintInstruction(
//       mint.publicKey,     // The new mint account
//       8,                  // Decimal precision
//       alice.publicKey,    // Mint authority
//       alice.publicKey     // Freeze authority (can be null)
//     )
//   );

//   const txSignature = await sendAndConfirmTransaction(
//     connection,
//     transaction,
//     [feePayer, mint] // Signers
//   );

//   console.log(`✅ [Method 2] Custom mint created with transaction: ${txSignature}`);
// })();

// create-token.js
// This script creates a new SPL token on Solana

import {
  clusterApiUrl,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  createMint,
  getMint
} from "@solana/spl-token";
import bs58 from "bs58";
import fs from "fs";

// Configuration - you can modify these values
const TOKEN_NAME = "MY_CUSTOM_TOKEN";
const TOKEN_SYMBOL = "MCT";
const TOKEN_DECIMALS = 8;
const TOKEN_DESCRIPTION = "My first custom Solana token";

(async () => {
  console.log("🚀 Starting token creation process...");
  
  try {
    // 1. Set up connection to Solana network
    // For local development use localhost, for testnet use 'testnet'
    // Options: 'mainnet-beta', 'testnet', 'devnet', or local URL
    const NETWORK = "http://127.0.0.1:8899";
    console.log(`💻 Connecting to Solana network: ${NETWORK}`);
    const connection = new Connection(NETWORK, "confirmed");
    console.log("✅ Connection established");
    
    // Get recent blockhash for transaction
    const recentBlockhash = await connection.getLatestBlockhash();
    console.log(`📦 Recent blockhash: ${recentBlockhash.blockhash}`);

    // 2. Set up fee payer wallet (this account pays for the transaction)
    console.log("🔑 Setting up fee payer wallet...");
    // You can replace this with your own keypair or generate a new one
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

    // 4. Set up mint authority (controls minting new tokens)
    console.log("🔑 Setting up mint authority...");
    // This is the wallet that will have permission to mint new tokens
    // You can replace this with your own keypair or generate a new one
    const mintAuthority = Keypair.fromSecretKey(
      bs58.decode(
        "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
      )
    );
    console.log(`📝 Mint authority public key: ${mintAuthority.publicKey.toBase58()}`);

    // 5. Create the token mint
    console.log(`🏭 Creating token with ${TOKEN_DECIMALS} decimals...`);
    console.log("⏳ This may take a moment...");
    
    // Method 1: Using the built-in helper function (easier)
    const mintPubkey = await createMint(
      connection,            // Connection to use
      feePayer,              // Payer of the transaction and initialization fee
      mintAuthority.publicKey, // Account that will control minting
      mintAuthority.publicKey, // Account that will control freezing (optional, can be null)
      TOKEN_DECIMALS         // Location of the decimal place
    );
    
    console.log("✅ Token mint created successfully!");
    console.log(`📝 Mint address: ${mintPubkey.toBase58()}`);
    
    // Save the mint address to a file for future use
    const tokenInfo = {
      tokenName: TOKEN_NAME,
      tokenSymbol: TOKEN_SYMBOL,
      tokenDescription: TOKEN_DESCRIPTION,
      decimals: TOKEN_DECIMALS,
      mintAddress: mintPubkey.toBase58(),
      mintAuthority: mintAuthority.publicKey.toBase58(),
      freezeAuthority: mintAuthority.publicKey.toBase58()
    };
    
    fs.writeFileSync("token-info.json", JSON.stringify(tokenInfo, null, 2));
    console.log("💾 Token information saved to token-info.json");
    
    // 6. Fetch and display the created token's info
    console.log("\n🔍 Fetching token information...");
    const mintInfo = await getMint(
      connection,
      mintPubkey
    );
    
    console.log("\n✨ Token created successfully! ✨");
    console.log("=== Token Details ===");
    console.log(`Name: ${TOKEN_NAME}`);
    console.log(`Symbol: ${TOKEN_SYMBOL}`);
    console.log(`Mint Address: ${mintPubkey.toBase58()}`);
    console.log(`Decimals: ${mintInfo.decimals}`);
    console.log(`Mint Authority: ${mintInfo.mintAuthority.toBase58()}`);
    console.log(`Freeze Authority: ${mintInfo.freezeAuthority?.toBase58() || "None"}`);
    console.log(`Current Supply: ${mintInfo.supply}`);
    
    console.log("\n🎉 Token creation complete! Next steps would be to:");
    console.log("1. Create a token account");
    console.log("2. Mint tokens to that account");
    console.log("3. Add metadata (optional)");
    
  } catch (error) {
    console.error("❌ Error creating token:", error);
    process.exit(1);
  }
})();