// check-token-balance.js
// This script checks the token balance for a specific token account

import { Connection, PublicKey } from "@solana/web3.js";
import fs from "fs";

(async () => {
  console.log("💰 Starting token balance check...");
  
  try {
    // 1. Set up connection to Solana network
    const NETWORK = "http://127.0.0.1:8899";
    console.log(`💻 Connecting to Solana network: ${NETWORK}`);
    const connection = new Connection(NETWORK, "confirmed");
    console.log("✅ Connection established");
    
    // 2. Get the token account address - either from command line args or token-account-info.json
    let tokenAccountAddress;
    
    if (process.argv.length > 2) {
      // If provided as command line argument
      tokenAccountAddress = process.argv[2];
      console.log(`🔑 Using token account address from command line: ${tokenAccountAddress}`);
    } else {
      // Try to read from token-account-info.json
      try {
        const accountInfo = JSON.parse(fs.readFileSync("token-account-info.json", "utf8"));
        tokenAccountAddress = accountInfo.tokenAccount;
        console.log(`🔑 Using token account address from token-account-info.json: ${tokenAccountAddress}`);
      } catch (e) {
        console.error("❌ Could not find token-account-info.json. Please provide a token account address as a command line argument.");
        process.exit(1);
      }
    }
    
    // Convert string address to PublicKey object
    const tokenAccountPubkey = new PublicKey(tokenAccountAddress);
    
    // 3. Fetch token balance information
    console.log("⏳ Fetching token balance...");
    
    try {
      const tokenAmount = await connection.getTokenAccountBalance(tokenAccountPubkey);
      
      // 4. Display token balance information in various formats
      console.log("\n=== Token Balance ===");
      console.log(`Raw Amount: ${tokenAmount.value.amount}`);
      console.log(`Decimals: ${tokenAmount.value.decimals}`);
      
      // Calculate and show UI amount (human-readable)
      const uiAmount = tokenAmount.value.uiAmount;
      console.log(`Human-readable Balance: ${uiAmount !== null ? uiAmount : '0'} ${tokenAmount.value.uiAmountString}`);
      
      // Get token info if available
      try {
        const tokenInfo = JSON.parse(fs.readFileSync("token-info.json", "utf8"));
        console.log(`Token Name: ${tokenInfo.tokenName}`);
        console.log(`Token Symbol: ${tokenInfo.tokenSymbol}`);
      } catch (e) {
        // If token info is not available, just show the mint address
        try {
          const accountInfo = JSON.parse(fs.readFileSync("token-account-info.json", "utf8"));
          console.log(`Token Mint: ${accountInfo.tokenMint}`);
        } catch (e) {
          // If neither is available, just continue
        }
      }
      
      // 5. Display examples of the balance in different formats
      console.log("\n=== Balance Examples ===");
      
      // If balance is not zero, show different ways to display it
      if (tokenAmount.value.amount !== '0') {
        const rawAmount = BigInt(tokenAmount.value.amount);
        const decimals = tokenAmount.value.decimals;
        
        console.log(`With all decimal places: ${uiAmount}`);
        
        // Format with different decimal precisions
        if (decimals > 0) {
          const divisor = BigInt(10 ** decimals);
          const wholeUnits = rawAmount / divisor;
          const fractionalBigInt = rawAmount % divisor;
          
          // Format with 2 decimal places
          const fractionalStr = fractionalBigInt.toString().padStart(decimals, '0');
          const twoDecimalPlaces = fractionalStr.substring(0, 2).padEnd(2, '0');
          console.log(`With 2 decimal places: ${wholeUnits}.${twoDecimalPlaces}`);
        }
      } else {
        console.log("Token balance is zero.");
      }
      
    } catch (error) {
      console.error("❌ Error fetching token balance:");
      console.error(error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error("❌ Error in balance check:", error);
    process.exit(1);
  }
})();