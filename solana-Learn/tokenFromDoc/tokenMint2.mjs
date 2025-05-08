// check-token.js
// This script checks information about an existing SPL token on Solana

import { Connection, PublicKey } from "@solana/web3.js";
import { getMint, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import fs from "fs";

(async () => {
  console.log("🔍 Starting token inspection process...");
  
  try {
    // 1. Set up connection to Solana network
    const NETWORK = "http://127.0.0.1:8899";
    console.log(`💻 Connecting to Solana network: ${NETWORK}`);
    const connection = new Connection(NETWORK, "confirmed");
    console.log("✅ Connection established");
    
    // 2. Get the mint address - either from command line args or token-info.json
    let mintAddress;
    
    if (process.argv.length > 2) {
      // If provided as command line argument
      mintAddress = process.argv[2];
      console.log(`🔑 Using mint address from command line: ${mintAddress}`);
    } else {
      // Try to read from token-info.json
      try {
        const tokenInfo = JSON.parse(fs.readFileSync("token-info.json", "utf8"));
        mintAddress = tokenInfo.mintAddress;
        console.log(`🔑 Using mint address from token-info.json: ${mintAddress}`);
      } catch (e) {
        console.error("❌ Could not find token-info.json. Please provide a mint address as a command line argument.");
        process.exit(1);
      }
    }
    
    // Convert string address to PublicKey object
    const mintAccountPublicKey = new PublicKey(mintAddress);
    
    // 3. Try to fetch token info using standard TOKEN_PROGRAM_ID
    console.log("⏳ Fetching token information...");
    try {
      const mintInfo = await getMint(
        connection,
        mintAccountPublicKey,
        "confirmed",
        TOKEN_PROGRAM_ID
      );
      
      displayTokenInfo(mintInfo, "TOKEN_PROGRAM_ID");
    } catch (err) {
      console.log("ℹ️ Token not found with TOKEN_PROGRAM_ID, trying TOKEN_2022_PROGRAM_ID...");
      
      try {
        // Try with TOKEN_2022_PROGRAM_ID
        const mintInfo = await getMint(
          connection,
          mintAccountPublicKey,
          "confirmed",
          TOKEN_2022_PROGRAM_ID
        );
        
        displayTokenInfo(mintInfo, "TOKEN_2022_PROGRAM_ID");
      } catch (err2) {
        console.error("❌ Could not find token with either program ID:");
        console.error(err2);
      }
    }
    
  } catch (error) {
    console.error("❌ Error checking token:", error);
    process.exit(1);
  }
})();

function displayTokenInfo(mintInfo, programId) {
  console.log("\n✅ Token found!");
  console.log("=== Token Details ===");
  console.log(`Mint Address: ${mintInfo.address.toBase58()}`);
  console.log(`Program ID: ${programId}`);
  console.log(`Decimals: ${mintInfo.decimals}`);
  console.log(`Mint Authority: ${mintInfo.mintAuthority?.toBase58() || "None"}`);
  console.log(`Freeze Authority: ${mintInfo.freezeAuthority?.toBase58() || "None"}`);
  console.log(`Current Supply: ${mintInfo.supply.toString()}`);
  console.log(`Is Initialized: ${mintInfo.isInitialized}`);
  
  // Converting supply to human-readable format based on decimals
  const humanReadableSupply = Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals);
  console.log(`Human Readable Supply: ${humanReadableSupply}`);
}