// app/page.tsx or app/Home.tsx
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
import { getAssociatedTokenAddress } from "@solana/spl-token";

// --- 1. Wallet Connection Provider Component ---
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

// --- 2. Balance Display Component ---
const BalanceDisplay = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!connection || !publicKey) return;

    let subscriptionId;

    const fetchBalance = async () => {
      const accountInfo = await connection.getAccountInfo(publicKey);
      if (accountInfo) {
        console.log("Account info:", accountInfo);
        setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
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

// --- 3. Main Component ---
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

      const signature = await sendTransaction(transaction, connection);
      console.log(`Transaction signature: ${signature}`);
    } catch (err) {
      console.error("Transaction failed", err);
    }
  };

  return (
    <div className="p-4">
      <WalletMultiButton />
      <BalanceDisplay />
      <button
        onClick={sendSol}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Send 0.1 SOL
      </button>
      <button
        onClick={getCustomTokenBalance}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Get Custom Token Balance
      </button>
    </div>
  );
};

// --- 4. Final Export ---
const Home = () => {
  return (
    <WalletConnectionProvider>
      <WalletApp />
    </WalletConnectionProvider>
  );
};

export default Home;

