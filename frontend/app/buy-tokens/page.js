// "use client"

// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Slider } from "@/components/ui/slider"
// import { Coins, Wallet, CheckCircle, X } from "lucide-react"

// import { useEffect, useMemo, useState } from "react";
// import {
//   ConnectionProvider,
//   WalletProvider,
//   useConnection,
//   useWallet,
// } from "@solana/wallet-adapter-react";
// import {
//   WalletModalProvider,
//   WalletMultiButton,
// } from "@solana/wallet-adapter-react-ui";
// import {
//   clusterApiUrl,
//   Transaction,
//   PublicKey,
//   SystemProgram,
//   LAMPORTS_PER_SOL,
// } from "@solana/web3.js";
// import "@solana/wallet-adapter-react-ui/styles.css";
// import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";

// import dotenv from "dotenv";
// dotenv.config();

// import {  Connection, Keypair } from "@solana/web3.js";
// import {
//   createAssociatedTokenAccountIdempotent,
//   mintToChecked,
//   TOKEN_2022_PROGRAM_ID
// ,  TOKEN_PROGRAM_ID
// } from "@solana/spl-token";
// import bs58 from "bs58";

// import dotenv from "dotenv";
// dotenv.config();

// import { createKeyPairSignerFromBytes } from "gill";

// const WalletConnectionProvider = ({ children }) => {
//   const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
//   const wallets = useMemo(() => [], []); // Add wallets here like Phantom, etc.

//   return (
//     <ConnectionProvider endpoint={endpoint}>
//       <WalletProvider wallets={wallets} autoConnect>
//         <WalletModalProvider>{children}</WalletModalProvider>
//       </WalletProvider>
//     </ConnectionProvider>
//   );
// };

// export default function BuyTokensPage() {
//   const [amount, setAmount] = useState(50)
//   const [showConnectModal, setShowConnectModal] = useState(false)
//   const [isConnected, setIsConnected] = useState(false)
//   const [showSuccessModal, setShowSuccessModal] = useState(false)

//     const { publicKey, sendTransaction } = useWallet();
//   const { connection } = useConnection();

//   const handleConnectWallet = () => {

//     // Mock wallet connection
//     setTimeout(() => {
//       setIsConnected(true)
//       setShowConnectModal(false)
//     }, 1500)
//   }

//   const handleBuyTokens = () => {

//     //send sol to owner wallet

//     const sendSol = async () => {
//     if (!publicKey || !connection) {
//       console.error("Wallet not connected");
//       return;
//     }

//     try {
//       const recipient = new PublicKey("gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD");//owner address
//       const transaction = new Transaction().add(
//         SystemProgram.transfer({
//           fromPubkey: publicKey,
//           toPubkey: recipient,
//           lamports: amount * LAMPORTS_PER_SOL,//-> number sol = number of tokens to mint to this address
//         })
//       );

//       // Get recent blockhash
//       const { blockhash } = await connection.getLatestBlockhash();
//       transaction.recentBlockhash = blockhash;
//       transaction.feePayer = publicKey;

//       const signature = await sendTransaction(transaction, connection);
//       console.log(`Transaction signature: ${signature}`);

//       // Wait for confirmation
//       const confirmation = await connection.confirmTransaction(signature);
//       console.log("Transaction confirmed:", confirmation);
//     } catch (err) {
//       console.error("Transaction failed", err);
//     }
//   };

//     //once the transaction is confirmed, proceed to mint tokens

//     //correct the below function code ...and sign the transaction with the wallet key...dont generate new wallet from the secret key as in below
//     (async () => {
//       // connection
//       const connection = new Connection(
//         clusterApiUrl("devnet"),
//         "confirmed"
//       );

//       const secretKey = Uint8Array.from(
//         process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD
//       );

//       // Base58 encode the secret key
//       const base58SecretKey = bs58.encode(secretKey);

//     // Pass it to createKeyPairSignerFromBytes
//     const signer = await createKeyPairSignerFromBytes(bs58.decode(base58SecretKey));

//       // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
//       // const feePayer = Keypair.fromSecretKey(
//       //   bs58.decode(
//       //     "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
//       //   )
//       // );

//       const keypair = Keypair.fromSecretKey(bs58.decode(base58SecretKey));
//     const feePayer = keypair;

//       const mintPubkey = new PublicKey(
//         "7nMwDDpFEc7PcAnnAmw8njf7o3dWNKvp8FHBabMW455q"
//       );

//       console.log(`mintPubkey: ${mintPubkey}`);

//       const tokenAccountPubkey = new PublicKey(
//         "EwCTppEs8y7zuzRHGD54GDWXYwiHxCkvqAKZp8K2T7GZ"
//       );
//       console.log(`Using token account address: ${tokenAccountPubkey.toBase58()}`);
//       console.log(`ATA: ${tokenAccountPubkey.toBase58()}`);

//         // Get (or create if needed) the correct associated token account
//         const correctTokenAccount = await createAssociatedTokenAccountIdempotent(
//           connection,
//           feePayer,               // fee payer
//           mintPubkey,             // the mint for which the ATA is being created
//           feePayer.publicKey,        // owner of the token account
//           {},                     // default options
//           TOKEN_PROGRAM_ID        // or TOKEN_2022_PROGRAM_ID if you're using Token-2022
//         );

//         console.log(`Correct ATA: ${correctTokenAccount.toBase58()}`);

//       {

//         console.log("minitng to correct token account",correctTokenAccount);
//         let txhash = await mintToChecked(
//           connection,
//           feePayer,
//           mintPubkey,
//           correctTokenAccount,
//           feePayer,  // mint authority
//           6e9,
//           9,
//           undefined,
//           undefined,
//           TOKEN_PROGRAM_ID
//         );
//         console.log(`txhash: ${txhash}`);
//       }
//     })();

//     // Mock token purchase
//     setTimeout(() => {
//       setShowSuccessModal(true)
//     }, 1000)
//   }

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.3,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.5 },
//     },
//   }

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <WalletConnectionProvider>
//       <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">
//         <motion.div variants={itemVariants} className="text-center mb-12">
//           <h1 className="text-4xl font-bold mb-4">Buy Game Tokens</h1>
//           <p className="text-gray-400 text-lg">Power up your gaming experience with Solana tokens!</p>
//         </motion.div>

//         <motion.div
//           variants={itemVariants}
//           className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-8 mb-12"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div>
//               <h2 className="text-2xl font-bold mb-4">Why Buy Tokens?</h2>
//               <ul className="space-y-4">
//                 <li className="flex items-start">
//                   <div className="bg-purple-500/20 rounded-full p-1 mt-1 mr-3">
//                     <Coins className="h-5 w-5 text-purple-400" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Stake in Games</h3>
//                     <p className="text-gray-400">Use tokens to stake in competitive matches.</p>
//                   </div>
//                 </li>
//                 <li className="flex items-start">
//                   <div className="bg-purple-500/20 rounded-full p-1 mt-1 mr-3">
//                     <Coins className="h-5 w-5 text-purple-400" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Unlock Premium Features</h3>
//                     <p className="text-gray-400">Access exclusive game modes and features.</p>
//                   </div>
//                 </li>
//                 <li className="flex items-start">
//                   <div className="bg-purple-500/20 rounded-full p-1 mt-1 mr-3">
//                     <Coins className="h-5 w-5 text-purple-400" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Trade with Players</h3>
//                     <p className="text-gray-400">Exchange tokens with other players in the ecosystem.</p>
//                   </div>
//                 </li>
//               </ul>
//             </div>

//             <div className="bg-gray-800 rounded-xl p-6">
//               <h2 className="text-2xl font-bold mb-6 text-center">Buy Tokens</h2>

//               {!isConnected ? (
//                 <div className="text-center py-8">
//                   <Wallet className="h-16 w-16 mx-auto text-purple-400 mb-4" />
//                   <p className="text-gray-300 mb-6">Connect your wallet to buy tokens</p>
//                   <Button
//                     className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
//                     onClick={() => setShowConnectModal(true)}
//                   >
//                     Connect Wallet
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-8">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-400 mb-2">Select Amount</label>
//                     <div className="flex items-center gap-4">
//                       <Slider
//                         value={[amount]}
//                         min={10}
//                         max={1000}
//                         step={10}
//                         onValueChange={(value) => setAmount(value[0])}
//                         className="flex-1"
//                       />
//                       <div className="bg-gray-900 rounded-md px-3 py-2 min-w-[100px] text-center">
//                         <span className="text-xl font-bold">{amount}</span>
//                         <span className="text-gray-400 ml-2">SOL</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gray-900/50 rounded-lg p-4">
//                     <div className="flex justify-between mb-2">
//                       <span className="text-gray-400">Price</span>
//                       <span>{amount} SOL</span>
//                     </div>
//                     <div className="flex justify-between mb-2">
//                       <span className="text-gray-400">Network Fee</span>
//                       <span>0.001 SOL</span>
//                     </div>
//                     <div className="border-t border-gray-700 my-2"></div>
//                     <div className="flex justify-between font-bold">
//                       <span>Total</span>
//                       <span>{(amount + 0.001).toFixed(3)} SOL</span>
//                     </div>
//                   </div>

//                   <Button
//                     className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6"
//                     onClick={handleBuyTokens}
//                   >
//                     Buy Tokens
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </motion.div>

//         <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-gray-800 rounded-xl p-6 text-center">
//             <div className="bg-purple-500/20 rounded-full p-4 mx-auto w-fit mb-4">
//               <Coins className="h-8 w-8 text-purple-400" />
//             </div>
//             <h3 className="text-xl font-bold mb-2">Instant Delivery</h3>
//             <p className="text-gray-400">Tokens are delivered to your wallet instantly after purchase.</p>
//           </div>

//           <div className="bg-gray-800 rounded-xl p-6 text-center">
//             <div className="bg-purple-500/20 rounded-full p-4 mx-auto w-fit mb-4">
//               <Coins className="h-8 w-8 text-purple-400" />
//             </div>
//             <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
//             <p className="text-gray-400">All transactions are secured by Solana blockchain technology.</p>
//           </div>

//           <div className="bg-gray-800 rounded-xl p-6 text-center">
//             <div className="bg-purple-500/20 rounded-full p-4 mx-auto w-fit mb-4">
//               <Coins className="h-8 w-8 text-purple-400" />
//             </div>
//             <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
//             <p className="text-gray-400">Our support team is available around the clock to assist you.</p>
//           </div>
//         </motion.div>
//       </motion.div>

//       {/* Connect Wallet Modal */}
//       {showConnectModal && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
//           <div className="bg-gray-900 border border-purple-900/30 rounded-xl p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold">Connect Wallet</h2>
//               <button onClick={() => setShowConnectModal(false)} className="text-gray-400 hover:text-white">
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="text-center mb-8">
//               <div className="bg-gray-800 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
//                 <Wallet className="h-10 w-10 text-purple-400" />
//               </div>

//               <p className="text-gray-300 mb-4">Connect your wallet to buy tokens and participate in games.</p>
//             </div>

//             <Button
//               className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
//               onClick={handleConnectWallet}
//             >
//               Connect Wallet
//             </Button>

//             <p className="text-xs text-gray-500 text-center mt-4">
//               By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Success Modal */}
//       {showSuccessModal && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
//           <div className="bg-gray-900 border border-green-500/30 rounded-xl p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold text-green-400">Success!</h2>
//               <button onClick={() => setShowSuccessModal(false)} className="text-gray-400 hover:text-white">
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="text-center mb-8">
//               <div className="bg-green-500/20 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
//                 <CheckCircle className="h-10 w-10 text-green-400" />
//               </div>

//               <p className="text-gray-300 mb-4">You have successfully purchased {amount} SOL tokens!</p>

//               <p className="text-sm text-gray-400">The tokens have been added to your wallet and are ready to use.</p>
//             </div>

//             <Button
//               className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 h-12"
//               onClick={() => setShowSuccessModal(false)}
//             >
//               Continue
//             </Button>
//           </div>
//         </div>
//       )}

//       </WalletConnectionProvider>
//     </div>
//   )
// }
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Coins, Wallet, CheckCircle, X } from "lucide-react";
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
  Connection,
} from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

// Main component
 function BuyTokensPage() {
  const [amount, setAmount] = useState(50);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState("");
  const [error, setError] = useState("");

  // Get wallet and connection from context
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();

  // Update connected state based on actual wallet connection
  useEffect(() => {
    if (connected && publicKey) {
      setShowConnectModal(false);
    }
  }, [connected, publicKey]);

  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [], []); // Add specific wallets here if needed

  const handleBuyTokens = async () => {
    if (!publicKey || !connection) {
      setShowConnectModal(true);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Step 1: Send SOL to the owner wallet address
      const ownerWalletAddress = new PublicKey(
        //"gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD"
        "FwihGJFQ2Qe1p5hfsLMokFosfm5wMWD3nDZYnD8M9bt6"
      );

      // Create transaction to send SOL
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: ownerWalletAddress,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      // Get recent blockhash and set fee payer
      const {
        blockhash,
        lastValidBlockHeight,
      } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction using wallet adapter
      const signature = await sendTransaction(transaction, connection);
      console.log(`Transaction sent. Signature: ${signature}`);
      setTransactionSignature(signature);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      );

      console.log("Transaction confirmed:", confirmation);

      // If the transaction was successful, show success modal
      if (!confirmation.value.err) {

         // Call  minting API
      const response = await fetch('/api/mintTokens', {  // Your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          amount: Number(amount)
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus(`Tokens minted successfully! Transaction: ${data.signature}`);
      } else {
        throw new Error(data.message || "Failed to mint tokens");
      }


        setShowSuccessModal(true);
      } else {
        setError("Transaction failed. Please try again.");
        console.error("Transaction error:", confirmation.value.err);
      }
    } catch (err) {
      console.error("Error buying tokens:", err);
      setError(err.message || "Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <ConnectionProvider endpoint={endpoint}>
      
          <WalletModalProvider>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Buy Game Tokens</h1>
                <p className="text-gray-400 text-lg">
                  Power up your gaming experience with Solana tokens!
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-8 mb-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Why Buy Tokens?</h2>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="bg-purple-500/20 rounded-full p-1 mt-1 mr-3">
                          <Coins className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Stake in Games</h3>
                          <p className="text-gray-400">
                            Use tokens to stake in competitive matches.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-purple-500/20 rounded-full p-1 mt-1 mr-3">
                          <Coins className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            Unlock Premium Features
                          </h3>
                          <p className="text-gray-400">
                            Access exclusive game modes and features.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-purple-500/20 rounded-full p-1 mt-1 mr-3">
                          <Coins className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Trade with Players</h3>
                          <p className="text-gray-400">
                            Exchange tokens with other players in the ecosystem.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                      Buy Tokens
                    </h2>

                    <div className="text-center py-8">
                      <Wallet className="h-16 w-16 mx-auto text-purple-400 mb-4" />
                      <p className="text-gray-300 mb-6">
                        Connect your wallet to buy tokens
                      </p>

                      <WalletMultiButton className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-md px-4 py-2" />
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Select Amount
                        </label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[amount]}
                            min={0.1}
                            max={50}
                            step={0.1}
                            onValueChange={(value) => setAmount(value[0])}
                            className="flex-1"
                          />
                          <div className="bg-gray-900 rounded-md px-3 py-2 min-w-[100px] text-center">
                            <span className="text-xl font-bold">
                              {amount.toFixed(1)}
                            </span>
                            <span className="text-gray-400 ml-2">SOL</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Price</span>
                          <span>{amount} SOL</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Network Fee</span>
                          <span>~0.000005 SOL</span>
                        </div>
                        <div className="border-t border-gray-700 my-2"></div>
                        <div className="flex justify-between font-bold">
                          <span>CGS COINS : </span>
                          <span>~{amount.toFixed(9)} CGS</span>
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-900/30 border border-red-500/30 rounded-md p-3 text-red-400 text-sm">
                          {error}
                        </div>
                      )}

                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6"
                        onClick={handleBuyTokens}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Buy Tokens"}
                      </Button>

                      <div className="text-xs text-gray-500 text-center">
                        You will receive {amount * 1000} game tokens
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="bg-gray-800 rounded-xl p-6 text-center">
                  <div className="bg-purple-500/20 rounded-full p-4 mx-auto w-fit mb-4">
                    <Coins className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Instant Delivery</h3>
                  <p className="text-gray-400">
                    Tokens are delivered to your wallet instantly after
                    purchase.
                  </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 text-center">
                  <div className="bg-purple-500/20 rounded-full p-4 mx-auto w-fit mb-4">
                    <Coins className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Secure Transactions
                  </h3>
                  <p className="text-gray-400">
                    All transactions are secured by Solana blockchain
                    technology.
                  </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 text-center">
                  <div className="bg-purple-500/20 rounded-full p-4 mx-auto w-fit mb-4">
                    <Coins className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                  <p className="text-gray-400">
                    Our support team is available around the clock to assist
                    you.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Success Modal */}
            {showSuccessModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div className="bg-gray-900 border border-green-500/30 rounded-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-green-400">
                      Success!
                    </h2>
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="text-center mb-8">
                    <div className="bg-green-500/20 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-green-400" />
                    </div>

                    <p className="text-gray-300 mb-4">
                      You have successfully purchased {amount * 1000} game
                      tokens!
                    </p>

                    <p className="text-sm text-gray-400">
                      The tokens have been added to your wallet and are ready to
                      use.
                    </p>

                    {transactionSignature && (
                      <a
                        href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:underline mt-4 inline-block"
                      >
                        View transaction on Solana Explorer
                      </a>
                    )}
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 h-12"
                    onClick={() => setShowSuccessModal(false)}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </WalletModalProvider>
        
      </ConnectionProvider>
    </div>
  );
}

// We don't need the wallet providers to be inside the component
export default function  WalletConnectionProvider ({ children }) {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [], []); // Add specific wallets here if needed

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
        
        <BuyTokensPage />
      </WalletProvider>
    </ConnectionProvider>
  );
};
