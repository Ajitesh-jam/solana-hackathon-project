// mint-tokens.js
// This script mints tokens to a token account

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
    mintTo,
    getMint,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID
  } from "@solana/spl-token";
  import bs58 from "bs58";
  import fs from "fs";
  
  (async () => {
    console.log("💸 Starting token minting process...");
    
    try {
      // 1. Set up connection to Solana network
      const NETWORK = "http://127.0.0.1:8899";
      console.log(`💻 Connecting to Solana network: ${NETWORK}`);
      const connection = new Connection(NETWORK, "confirmed");
      console.log("✅ Connection established");
      
      // 2. Load mint authority wallet (must be the same as used when creating the token)
      console.log("🔑 Setting up mint authority wallet...");
      const mintAuthority = Keypair.fromSecretKey(
        bs58.decode(
          "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
        )
      );
      console.log(`📝 Mint authority public key: ${mintAuthority.publicKey.toBase58()}`);

              // Generate a new wallet to receive newly minted token
      //const secretKey = Uint8Array.from(process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD.split(",").map(Number));
      const secretKey = Uint8Array.from(process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD.split(",").map(Number));

      const walletKeypair = Keypair.fromSecretKey(secretKey);
      console.log(`📝 Wallet public key: ${walletKeypair.publicKey.toBase58()}`);
      
      // Make sure we have some SOL for transaction fees
      const balance = await connection.getBalance(mintAuthority.publicKey);
      if (balance < 0.01 * LAMPORTS_PER_SOL) {
        console.log("💰 Requesting airdrop for transaction fees...");
        const airdropSig = await connection.requestAirdrop(
          mintAuthority.publicKey,
          LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(airdropSig);
        console.log("✅ Airdrop confirmed");
      }
      
      // 3. Get mint address and token account from files or command line
      let mintAddress, tokenAccount;
      
      // Try to read mint address from token-info.json
      try {
        const tokenInfo = JSON.parse(fs.readFileSync("token-info.json", "utf8"));
        mintAddress = tokenInfo.mintAddress;
        console.log(`🪙 Using mint address from token-info.json: ${mintAddress}`);
      } catch (e) {
        // If file not found, check command line arguments
        if (process.argv.length > 2) {
          mintAddress = process.argv[2];
          console.log(`🪙 Using mint address from command line: ${mintAddress}`);
        } else {
          console.error("❌ Could not find token mint address. Please provide it as a command line argument or create a token first.");
          process.exit(1);
        }
      }
      
      // Try to read token account from token-account-info.json
      try {
        const accountInfo = JSON.parse(fs.readFileSync("token-account-info.json", "utf8"));
        tokenAccount = accountInfo.tokenAccount;
        console.log(`🏦 Using token account from token-account-info.json: ${tokenAccount}`);
      } catch (e) {
        // If file not found, check command line arguments
        if (process.argv.length > 3) {
          tokenAccount = process.argv[3];
          console.log(`🏦 Using token account from command line: ${tokenAccount}`);
        } else {
          console.error("❌ Could not find token account address. Please provide it as a command line argument or create a token account first.");
          process.exit(1);
        }
      }
      
      // Convert string addresses to PublicKey objects
      const mintPubkey = new PublicKey(mintAddress);
      const tokenAccountPubkey = new PublicKey(tokenAccount);
      
      // 4. Get the amount to mint from command line or default
      const amountArg = process.argv.length > 4 ? process.argv[4] : "1000";
      
      // 5. Determine the token program to use and get mint info
      console.log("🔍 Getting token mint information...");
      let mintInfo;
      let tokenProgramId;
      
      try {
        // Try TOKEN_PROGRAM_ID first
        mintInfo = await getMint(connection, mintPubkey, undefined, TOKEN_PROGRAM_ID);
        tokenProgramId = TOKEN_PROGRAM_ID;
        console.log("✅ Token found with TOKEN_PROGRAM_ID");
      } catch (error) {
        try {
          // Try TOKEN_2022_PROGRAM_ID if the first attempt fails
          mintInfo = await getMint(connection, mintPubkey, undefined, TOKEN_2022_PROGRAM_ID);
          tokenProgramId = TOKEN_2022_PROGRAM_ID;
          console.log("✅ Token found with TOKEN_2022_PROGRAM_ID");
        } catch (error2) {
          console.error("❌ Could not find token with either program ID");
          console.error(error2);
          process.exit(1);
        }
      }
      
      // 6. Calculate the amount to mint based on decimals
      const decimals = mintInfo.decimals;
      console.log(`ℹ️ Token has ${decimals} decimals`);
      
      // Parse the amount argument and convert to raw amount
      let uiAmount;
      try {
        uiAmount = parseFloat(amountArg);
        if (isNaN(uiAmount) || uiAmount <= 0) {
          throw new Error("Invalid amount");
        }
      } catch (e) {
        console.error("❌ Invalid amount provided. Please provide a positive number.");
        process.exit(1);
      }
      
      // Convert UI amount to raw amount based on decimals
      const rawAmount = BigInt(Math.floor(uiAmount * Math.pow(10, decimals)));
      console.log(`🧮 Minting ${uiAmount} tokens (${rawAmount} raw amount) `);
      
      // 7. Mint tokens
      console.log("💸 Minting tokens...");
      const signature = await mintTo(
        connection,
        mintAuthority,             // Payer of the transaction fee
        mintPubkey,                // Mint address
        tokenAccountPubkey,        // Destination token account
        mintAuthority.publicKey,   // Authority that can mint tokens
        rawAmount,                 // Amount to mint
        [],                        // Additional signers
        undefined,                 // Confirmation options
        tokenProgramId             // Token program ID to use
      );
      
      console.log(`✅ Minting transaction successful! Signature: ${signature}`);
      
      // 8. Verify the new token balance
      console.log("\n⏳ Verifying new token balance...");
      try {
        const tokenAmount = await connection.getTokenAccountBalance(tokenAccountPubkey);
        
        console.log("\n=== Updated Token Balance ===");
        console.log(`Raw Amount: ${tokenAmount.value.amount}`);
        console.log(`Human-readable Balance: ${tokenAmount.value.uiAmount} ${tokenAmount.value.uiAmountString}`);
      } catch (error) {
        console.log("⚠️ Could not verify token balance. Please check using the check-token-balance.js script.");
      }
      
      console.log("\n🎉 Tokens minted successfully!");
      
    } catch (error) {
      console.error("❌ Error minting tokens:", error);
      process.exit(1);
    }
  })();


// import { clusterApiUrl, Connection, PublicKey, Keypair } from "@solana/web3.js";
// import {
//   createAssociatedTokenAccountIdempotent,
//   mintToChecked,
//   TOKEN_2022_PROGRAM_ID
// } from "@solana/spl-token";
// import bs58 from "bs58";

// (async () => {
//   // connection
//   const connection = new Connection("http://127.0.0.1:8899", "confirmed");
//     // Generate a new wallet to receive newly minted token
//   //const secretKey = Uint8Array.from(process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD.split(",").map(Number));
//   const secretKey = Uint8Array.from([183, 21, 103, 85, 51, 40, 44, 31, 140, 105, 15, 211, 100, 34, 42, 227, 86,
//     243, 164, 50, 237, 149, 192, 32, 176, 74, 227, 248, 68, 189, 149, 72, 10, 22,
//     123, 99, 59, 252, 51, 236, 150, 127, 62, 62, 244, 191, 154, 115, 151, 64, 168,
//     120, 188, 116, 219, 131, 244, 250, 12, 196, 105, 69, 204, 166
//   ]);

//   const walletKeypair = Keypair.fromSecretKey(secretKey);
//   console.log(`📝 Wallet public key: ${walletKeypair.publicKey.toBase58()}`);

//   // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
//   const feePayer = Keypair.fromSecretKey(
//     bs58.decode(
//       "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
//     )
//   );

//   // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
//   const alice = Keypair.fromSecretKey(
//     bs58.decode(
//       "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
//     )
//   );
//   // const airdropSig = await connection.requestAirdrop(
//   //   feePayer.publicKey,
//   //   1000000000
//   // );
//   // await connection.confirmTransaction(airdropSig);

//   console.log("💰 Fee payer balance: ", await connection.getBalance(feePayer.publicKey) / 1e9);

//   const mintPubkey = new PublicKey(
//     "3BLwDckxdND2duPD9MShxrELZCouu4i2LMYmRQLQVPHW"
//   );

//   console.log(`🪙 Using mint address: ${mintPubkey.toBase58(  )}`);

//   let tokenAccountPubkey = await createAssociatedTokenAccountIdempotent(
//     connection, // connection
//     feePayer, // fee payer
//     mintPubkey, // mint
//     walletKeypair.publicKey, // owner
//     undefined,
//     TOKEN_2022_PROGRAM_ID
//   );
//   console.log(`ATA: ${tokenAccountPubkey.toBase58()}`);

//   {
//     let txhash = await mintToChecked(
//       connection, // connection
//       feePayer, // fee payer
//       mintPubkey, // mint
//       tokenAccountPubkey, // receiver (should be a token account)
//       feePayer, // mint authority
//       1e9, // amount. if your decimals are 2, you mint 10^2 for 1 token.
//       9, // decimals
//       undefined,
//       undefined,
//       TOKEN_2022_PROGRAM_ID
//     );
//     console.log(`txhash: ${txhash}`);

//     // if alice is a multisig account
//     // let txhash = await mintToChecked(
//     //   connection, // connection
//     //   feePayer, // fee payer
//     //   mintPubkey, // mint
//     //   tokenAccountPubkey, // receiver (should be a token account)
//     //   alice.publicKey, // !! mint authority pubkey !!
//     //   1e8, // amount. if your decimals are 8, you mint 10^8 for 1 token.
//     //   8, // decimals
//     //   [signer1, signer2 ...],
//     // );
//   }
// })();

