import { NextResponse } from "next/server";
import { 
  createAssociatedTokenAccountInstruction, 
  getAssociatedTokenAddress, 
  createMintToCheckedInstruction,
  TOKEN_PROGRAM_ID,
  getMint
} from "@solana/spl-token";
import { 
  Transaction, 
  PublicKey, 
  Connection, 
  Keypair,
  clusterApiUrl,
  sendAndConfirmTransaction
} from "@solana/web3.js";

import { doc, deleteDoc } from 'firebase/firestore';

// Handle POST request to mint tokens
export async function POST(req) {
  try {

    
    // Parse request body
    const body = await req.json();
    const { walletAddress, amount ,roomCode} = body;
   
    
    // Validate inputs
    if (!walletAddress || !amount || amount <= 0) {
      console.log("Invalid input parameters:", { walletAddress, amount });
      return NextResponse.json(
        { success: false, message: "Invalid wallet address or amount" },
        { status: 400 }
      );
    }


    //validate if the wallet address exists in the database wiht the room code (to verify he/she had paid the money)
    const docRef = doc(db, 'Games', roomCode);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
      return NextResponse.json(
        { success: false, message: "No such document!" },
        { status: 400 }
      );
    }

    const room = docSnap.data();
    if(!room.joinedPlayerWalletAddress==walletAddress || room.hostPlayerWalletAddress!=walletAddress) {
      console.log("The wallet address had not paid or is not in the players list");
      return NextResponse.json(
        { success: false, message: "The wallet address is not in the players list" },
        { status: 400 }
      );
    }
    // Check if the wallet address is valid
    const isValidWalletAddress = PublicKey.isOnCurve(walletAddress);
    if (!isValidWalletAddress) {
      console.log("Invalid wallet address format:", walletAddress);
      return NextResponse.json(
        { success: false, message: "Invalid wallet address format" },
        { status: 400 }
      );
    }
    // Check if the amount is a valid number



    // Initialize connection to Solana devnet
    const connection = new Connection(
      clusterApiUrl("devnet"),   
      "confirmed"
    );
   
    
    // Get the mint authority private key (stored securely)
    // If the key is in array format
    console.log("pvt key ", process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD);


    const privateKeyString = process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD;
    const privateKeyArray = JSON.parse(privateKeyString);
    const secretKey = Uint8Array.from(privateKeyArray);

    
    // secrety key is of mint authority
    const mintAuthority = Keypair.fromSecretKey(secretKey);
    
    console.log("Mint authority address:", mintAuthority.publicKey.toString());
    
    // Token mint address 
    const mintAddress = new PublicKey("7nMwDDpFEc7PcAnnAmw8njf7o3dWNKvp8FHBabMW455q");
    console.log("Token mint address:", mintAddress.toString());
    
    // Verify mint authority
    try {
      const mintInfo = await getMint(connection, mintAddress);
      console.log("Mint info retrieved:", {
        decimals: mintInfo.decimals,
        freezeAuthority: mintInfo.freezeAuthority?.toString() || "None",
        isInitialized: mintInfo.isInitialized,
        mintAuthority: mintInfo.mintAuthority?.toString() || "None"
      });
      
      
      
      // Check if token is frozen
      if (!mintInfo.isInitialized) {
        console.error("Token mint is not initialized");
        return NextResponse.json(
          { success: false, message: "Token mint is not initialized" },
          { status: 400 }
        );
      }
    } catch (mintError) {
      console.error("Error fetching mint info:", mintError);
      return NextResponse.json(
        { success: false, message: "Failed to verify mint authority: " + mintError.message },
        { status: 500 }
      );
    }
    
    // Get the recipient's associated token account (ATA)
    const recipientPublicKey = new PublicKey(walletAddress);

    
    const recipientTokenAccount = await getAssociatedTokenAddress(
      mintAddress,
      recipientPublicKey,
      false, // allowOwnerOffCurve
      TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction();
    const tokenAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
    
    // If the token account doesn't exist, add instruction to create it
    if (!tokenAccountInfo) {
      console.log("Recipient token account doesn't exist. Creating it...");
      transaction.add(
        createAssociatedTokenAccountInstruction(
          mintAuthority.publicKey, // payer
          recipientTokenAccount, // ata
          recipientPublicKey, // owner
          mintAddress // mint
        )
      );
    } else {
      console.log("Recipient token account exists");
    }
    
    // Calculate token amount with decimals (9 decimals)
    const tokenAmount = BigInt(Math.floor(amount));
    console.log("Token amount to mint (with decimals):", tokenAmount.toString());
    
    // Add mint instruction
    transaction.add(
      createMintToCheckedInstruction(
        mintAddress, // mint
        recipientTokenAccount, // destination
        mintAuthority.publicKey, // mint authority
        tokenAmount, // amount
        9 // decimals
      )
    );
    
    // Get the latest blockhash
    console.log("Getting latest blockhash...");
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = mintAuthority.publicKey;
    
    console.log("Transaction built successfully");
    transaction.sign(mintAuthority);
    
    // Send raw transaction and handle errors more explicitly
    console.log("Sending transaction...");
    let signature;
    try {
      signature = await connection.sendRawTransaction(
        transaction.serialize(),
        { skipPreflight: false, preflightCommitment: "confirmed" }
      );
      console.log("Transaction sent with signature:", signature);
    } catch (sendError) {
      console.error("Failed to send transaction:", sendError);
      
      // More detailed error info
      if (sendError.logs) {
        console.error("Transaction logs:", sendError.logs);
      }
      
      return NextResponse.json(
        { success: false, message: "Transaction failed: " + sendError.message, logs: sendError.logs },
        { status: 500 }
      );
    }
    
    // Wait for confirmation with more detailed error handling
    console.log("Waiting for transaction confirmation...");
    try {
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, "confirmed");
      
      console.log("Transaction confirmation:", confirmation);
      
      if (confirmation.value.err) {
        console.error("Transaction confirmed but has errors:", confirmation.value.err);
        return NextResponse.json(
          { success: false, message: "Transaction error: " + JSON.stringify(confirmation.value.err) },
          { status: 500 }
        );
      }
    } catch (confirmError) {
      console.error("Failed to confirm transaction:", confirmError);
      return NextResponse.json(
        { success: false, message: "Failed to confirm transaction: " + confirmError.message },
        { status: 500 }
      );
    }
    
    console.log("Minting successful!");
    await deleteDoc(doc(db, 'Games', roomCode));
    
    // Return successful response
    return NextResponse.json({
      success: true,
      signature,
      message: `Successfully minted ${amount} tokens to ${walletAddress}`
    });
    
  } catch (error) {
    console.error("Error minting tokens:", error);
    console.error("Error stack:", error.stack);
    
    // Return detailed error information
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to mint tokens",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}