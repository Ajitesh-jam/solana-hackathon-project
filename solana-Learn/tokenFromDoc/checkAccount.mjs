// check-token-account.js
// This script checks detailed information about a token account

import { Connection, PublicKey } from "@solana/web3.js";
import { 
  getAccount, 
  TOKEN_PROGRAM_ID, 
  TOKEN_2022_PROGRAM_ID 
} from "@solana/spl-token";
import fs from "fs";

(async () => {
  console.log("🔍 Starting token account inspection process...");
  
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
    
    // 3. Try to fetch token account info using standard TOKEN_PROGRAM_ID
    console.log("⏳ Fetching token account information...");
    
    let tokenAccount;
    try {
      tokenAccount = await getAccount(
        connection,
        tokenAccountPubkey,
        "confirmed",
        TOKEN_PROGRAM_ID
      );
      
      console.log("✅ Token account found with TOKEN_PROGRAM_ID!");
    } catch (err) {
      console.log("ℹ️ Token account not found with TOKEN_PROGRAM_ID, trying TOKEN_2022_PROGRAM_ID...");
      
      try {
        // Try with TOKEN_2022_PROGRAM_ID
        tokenAccount = await getAccount(
          connection,
          tokenAccountPubkey,
          "confirmed",
          TOKEN_2022_PROGRAM_ID
        );
        
        console.log("✅ Token account found with TOKEN_2022_PROGRAM_ID!");
      } catch (err2) {
        console.error("❌ Could not find token account with either program ID:");
        console.error(err2);
        process.exit(1);
      }
    }
    
    // 4. Display detailed token account information
    console.log("\n=== Token Account Details ===");
    console.log(`Address: ${tokenAccount.address.toBase58()}`);
    console.log(`Mint: ${tokenAccount.mint.toBase58()}`);
    console.log(`Owner: ${tokenAccount.owner.toBase58()}`);
    console.log(`Amount: ${tokenAccount.amount.toString()}`);
    
    // 5. Try to get mint info to show decimals and calculate human-readable balance
    try {
      console.log("\n⏳ Fetching token balance with decimals...");
      const tokenAmount = await connection.getTokenAccountBalance(tokenAccountPubkey);
      
      console.log(`Raw Amount: ${tokenAmount.value.amount}`);
      console.log(`Decimals: ${tokenAmount.value.decimals}`);
      
      // Calculate and show UI amount (human-readable)
      const uiAmount = tokenAmount.value.uiAmount;
      console.log(`Human-readable Balance: ${uiAmount} ${tokenAmount.value.uiAmountString}`);
    } catch (error) {
      console.log("ℹ️ Could not fetch detailed token balance information");
    }
    
    // 6. Show additional token account properties
    console.log("\n=== Additional Properties ===");
    console.log(`Is Initialized: ${tokenAccount.isInitialized}`);
    console.log(`Is Frozen: ${tokenAccount.isFrozen}`);
    console.log(`Is Native: ${tokenAccount.isNative}`);
    
    if (tokenAccount.delegate) {
      console.log(`Delegate: ${tokenAccount.delegate.toBase58()}`);
      console.log(`Delegated Amount: ${tokenAccount.delegatedAmount.toString()}`);
    } else {
      console.log("Delegate: None");
    }
    
    if (tokenAccount.closeAuthority) {
      console.log(`Close Authority: ${tokenAccount.closeAuthority.toBase58()}`);
    } else {
      console.log("Close Authority: None");
    }
    
    if (tokenAccount.rentExemptReserve) {
      console.log(`Rent Exempt Reserve: ${tokenAccount.rentExemptReserve.toString()}`);
    }
    
  } catch (error) {
    console.error("❌ Error checking token account:", error);
    process.exit(1);
  }
})();