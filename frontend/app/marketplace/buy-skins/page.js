"use client";

import BuySkins from "@/components/marketplace/buy-skins"
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

 const metadata = {
  title: "Buy Skins | Solana Gaming Ecosystem",
  description: "Browse and purchase game skins from official game companies and marketplace sellers",
}

export default function BuySkinsPage() {
  return(
    <WalletConnectionProvider>
      <BuySkins />
    </WalletConnectionProvider>
    
  )
}
