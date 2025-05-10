"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  clusterApiUrl,
  Transaction,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";


const WalletConnectionProvider = ({ children }) => {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [], []); // Add wallets here like Phantom, etc.

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const BalanceDisplay = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!connection || !publicKey) return;

    let subscriptionId;

    const fetchBalance = async () => {
      try {
        const accountInfo = await connection.getAccountInfo(publicKey);
        if (accountInfo) {
          console.log("Account info:", accountInfo);
          setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    };

    fetchBalance();

    subscriptionId = connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        console.log("Account updated:", updatedAccountInfo);
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    return () => {
      if (subscriptionId) {
        connection.removeAccountChangeListener(subscriptionId);
      }
    };
  }, [connection, publicKey]);

  return publicKey ? <p>Balance: {balance.toFixed(4)} SOL</p> : null;
};

const WalletApp = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const getCustomTokenBalance = async () => {
    if (!publicKey || !connection) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const mintAddress = new PublicKey("7nMwDDpFEc7PcAnnAmw8njf7o3dWNKvp8FHBabMW455q");
      const ata = await getAssociatedTokenAddress(mintAddress, publicKey);
      const tokenAccount = await connection.getTokenAccountBalance(ata);
      console.log(`Custom Token Balance: ${tokenAccount.value.uiAmount}`);
    } catch (err) {
      console.error("Error fetching custom token balance:", err);
    }
  };

  const sendTokens = async () => {
    if (!publicKey || !connection) {
      console.error("Wallet not connected");
      return;
    }

    try {
      // Define the mint, token program, and destination
      const mint = new PublicKey("7nMwDDpFEc7PcAnnAmw8njf7o3dWNKvp8FHBabMW455q");
      const destination = new PublicKey("3BRrDyJrAo3ihd9SwuVy3CAQW2xaNZnHnqiphmYFt1rc");
      
      // Get the associated token addresses for source and destination
      const sourceAta = await getAssociatedTokenAddress(
        mint,
        publicKey
      );
      
      const destinationAta = await getAssociatedTokenAddress(
        mint,
        destination
      );
      
      // Create a new transaction (using @solana/web3.js Transaction)
      const transaction = new Transaction();
      
      // Check if the destination token account exists
      const destinationAccount = await connection.getAccountInfo(destinationAta);
      
      // If destination account doesn't exist, add instruction to create it
      if (!destinationAccount) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            destinationAta, // associated token account address
            destination, // owner
            mint // mint
          )
        );
      }
      
      // Add token transfer instruction
      transaction.add(
        createTransferInstruction(
          sourceAta, // source
          destinationAta, // destination
          publicKey, // owner of source
          1_000_000_000 // amount (1 token with 9 decimals)
        )
      );
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent, signature:", signature);
      
      // Optional: Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);
      console.log("Transaction confirmed:", confirmation);
      
    } catch (err) {
      console.error("Error sending tokens:", err);
    }
  };

  const sendSol = async () => {
    if (!publicKey || !connection) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const recipient = new PublicKey("gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD");
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: 0.1 * LAMPORTS_PER_SOL,
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      console.log(`Transaction signature: ${signature}`);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);
      console.log("Transaction confirmed:", confirmation);
    } catch (err) {
      console.error("Transaction failed", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Solana Wallet Demo</h1>
      <WalletMultiButton />
      <BalanceDisplay />
      <div className="flex flex-col space-y-2 mt-4">
        <button
          onClick={sendSol}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={!publicKey}
        >
          Send 0.1 SOL
        </button>
        <button
          onClick={getCustomTokenBalance}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={!publicKey}
        >
          Get Custom Token Balance
        </button>
        <button
          onClick={sendTokens}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          disabled={!publicKey}
        >
          Send Custom Tokens
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <WalletConnectionProvider>
      <WalletApp />
    </WalletConnectionProvider>
  );
};

export default Home;