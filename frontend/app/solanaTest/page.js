"use client";

import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import Solflare from '@solflare-wallet/sdk';
import { useEffect } from "react";

function SolanaProvider({ children }) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        ck
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};




export default function RootLayout({
  children
}) {

  useEffect( () => {

    async function connectWallet() {
      
      const wallet = new Solflare();
      wallet.on('connect', () => {
          console.log('connected', wallet.publicKey.toString());
      });
      wallet.on('disconnect', () => {
          console.log('disconnected');
      });

      await wallet.connect();

      console.log('connected', wallet.publicKey.toString());
      const balance = await wallet.getBalance();
      console.log('balance', balance);
    }
    connectWallet();
   
  }, []);
  
  
  return (
    <>
    skfn

        {/* <SolanaProvider>{children}</SolanaProvider> */}
    </>
     
  );
}

