"use client";

import { use, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Wallet, Lock, Unlock, AlertCircle } from "lucide-react";
import RoomCard from "@/components/RoomCard";
import SuccessModal from "@/components/SuccessModal";
import JSZip from "jszip";

import { Coins, CheckCircle, X } from "lucide-react";
import { useEffect, useMemo } from "react";
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
import { clusterApiUrl, PublicKey, Transaction } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";

import useUsers from "@/hooks/users.zustand";
// Game data
const games = {
  solanabattlefield: {
    name: "Solana Battlefield",
    description:
      "Intense multiplayer battles with strategic gameplay and high stakes rewards.",
    link: "unitydl://mylink?",
    downloadLink: "/multi.zip",
  },
  solanaops: {
    name: "Solana Ops",
    description:
      "Tactical team-based missions with real-time combat and blockchain rewards.",
    link: "unitydl://mylink?",
    downloadLink: "/multi.zip",
  },
  callofduty: {
    name: "Call of Duty",
    description:
      "The legendary FPS now with Solana integration. Stake, play, and earn.",
    link: "unitydl://mylink?",
    downloadLink: "https://drive.google.com/file/d/1UA2VMDMY6_0z2U33d5op04kC1qsLqauI/view",
  },
};

function GamePage() {
  const params = useParams();
  const gameId = params.game;
  const game = games[gameId] || {
    name: "Game Not Found",
    description: "",
    link: "#",
  };
  const user = useUsers((state) => state.selectedUser);

  async function handleZip() {
    const zip = new JSZip();
    const fileName = game.downloadLink.split("/").pop(); // Extract the file name from the URL
    const fileUrl = game.downloadLink; // URL of the file to be downloaded
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    zip.file(fileName, blob);
    const content = await zip.generateAsync({ type: "blob" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(content);
    downloadLink.download = fileName;
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href); // Clean up the URL object
  }

  const [Rooms, setRooms] = useState([
    {
      id: 1,
      roomCode: "GAME123",
      stakeAmount: 50,
      hostPlayerWalletAddress: "Wallet123",
      hostPlayerName: "Player1",
      isPrivate: false,
    },
    {
      id: 2,
      roomCode: "BATTLE456",
      stakeAmount: 100,
      hostPlayerWalletAddress: "Wallet456",
      hostPlayerName: "CryptoGamer",
      isPrivate: false,
    },
    {
      id: 3,
      roomCode: "SOLANA789",
      stakeAmount: 75,
      hostPlayerWalletAddress: "Wallet789",
      hostPlayerName: "BlockchainWarrior",
      isPrivate: true,
    },
    {
      id: 4,
      roomCode: "WAR2022",
      stakeAmount: 200,
      hostPlayerWalletAddress: "Wallet101",
      hostPlayerName: "TokenMaster",
      isPrivate: false,
    },
  ]);

  const [lobbyCode, setLobbyCode] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalType, setModalType] = useState("host"); // 'host' or 'join'
  const [selectedRoom, setSelectedRoom] = useState(null);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [cgsCoins, setCgsCoins] = useState(0);

  useEffect(() => {
    async function fetchGame() {
      console.log("Fetching game data...", gameId);
      const gameData = games[gameId];
      if (!gameData) {
        console.error("Game not found");
        return;
      }
      console.log("Game data:", gameData);

      const response = await fetch("/api/getGameByGameId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: gameId,
        }),
      });
      const data = await response.json();
      console.log("fehtc  Game Response:", data);
      setRooms(data);
    }
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    const getCustomTokenBalance = async () => {
      if (!publicKey || !connection) {
        console.error("Wallet not connected");
        return;
      }

      try {
        const mintAddress = new PublicKey(
          "MINT_ADDRESS"
        );
        const ata = await getAssociatedTokenAddress(mintAddress, publicKey);
        const tokenAccount = await connection.getTokenAccountBalance(ata);
        console.log(`Custom Token Balance: ${tokenAccount.value.uiAmount}`);
        setCgsCoins(tokenAccount.value.uiAmount);
      } catch (err) {
        console.error("Error fetching custom token balance:", err);
      }
    };
    if (publicKey) {
      console.log("Public Key:", publicKey.toString());
      getCustomTokenBalance();
    }
  }, [publicKey, connection]);

  // async function transferTokens() {
  //   if (!publicKey) {
  //     alert("Please connect your wallet first.");
  //     return;
  //   }

  //   try {
  //     const mint = new PublicKey(
  //       "MINT_ADDRESS"
  //     );
  //     const destination = new PublicKey(
  //       "gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD"
  //     ); //Owner wallet address

  //     const sourceAta = await getAssociatedTokenAddress(mint, publicKey);
  //     const destinationAta = await getAssociatedTokenAddress(mint, destination);

  //     const destinationAccount = await connection.getAccountInfo(
  //       destinationAta
  //     );
  //     const instructions = [];

  //     if (!destinationAccount) {
  //       instructions.push(
  //         createAssociatedTokenAccountInstruction(
  //           publicKey, // payer
  //           destinationAta, // ata
  //           destination, // owner
  //           mint // mint
  //         )
  //       );
  //     }

  //     // Add transfer instruction
  //     instructions.push(
  //       createTransferInstruction(
  //         sourceAta, // source
  //         destinationAta, // destination
  //         publicKey, // owner (authority)
  //         stakeAmount * 10 ** 9 // amount with decimals (assuming 9 decimals)
  //       )
  //     );

  //     // Create transaction
  //     const transaction = new Transaction().add(...instructions);

  //     // Get latest blockhash
  //     const { blockhash } = await connection.getLatestBlockhash();
  //     transaction.recentBlockhash = blockhash;
  //     transaction.feePayer = publicKey;

  //     // Send transaction
  //     const signature = await sendTransaction(transaction, connection);

  //     // Wait for confirmation
  //     const confirmation = await connection.confirmTransaction(
  //       signature,
  //       "confirmed"
  //     );
  //     console.log("Transaction confirmation:", confirmation);

  //     console.log("Transaction confirmed:", signature);
  //     alert(`Transfer successful! Transaction signature: ${signature}`);

  //     return signature;
  //   } catch (error) {
  //     console.error("Error transferring tokens:", error);
  //     alert(`Error: ${error.message}`);
  //   }
  // }

    async function transferTokens() {
    if (!publicKey) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const mint = new PublicKey(
        "MINT_ADDRESS"
      );
      const destination = new PublicKey(
        "gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD"
      ); //Owner wallet address

      const sourceAta = await getAssociatedTokenAddress(mint, publicKey);
      const destinationAta = await getAssociatedTokenAddress(mint, destination);

      const destinationAccount = await connection.getAccountInfo(destinationAta);
      const instructions = [];

      if (!destinationAccount) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            destinationAta, // ata
            destination, // owner
            mint // mint
          )
        );
      }

      // Add transfer instruction
      instructions.push(
        createTransferInstruction(
          sourceAta, // source
          destinationAta, // destination
          publicKey, // owner (authority)
          stakeAmount * 10 ** 9 // amount with decimals (assuming 9 decimals)
        )
      );

      // Create transaction
      const transaction = new Transaction().add(...instructions);

      // Get latest blockhash with longer validity
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      console.log("Transaction sent:", signature);
      
      // Improved confirmation approach with retry
      const confirmationStrategy = {
        signature,
        blockhash,
        lastValidBlockHeight
      };
      
      try {
        // Use a longer timeout and specify commitment level
        const confirmation = await connection.confirmTransaction(confirmationStrategy, 'confirmed');
        console.log("Transaction confirmation:", confirmation);
        
        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${confirmation.value.err}`);
        }
        
        console.log("Transaction confirmed:", signature);
        alert(`Transfer successful! Transaction signature: ${signature}`);
        return signature;
      } catch (confirmError) {
        // If confirmation fails, check if transaction is actually on chain
        console.error("Confirmation error:", confirmError);
        
        // Try to get transaction status
        try {
          const status = await connection.getSignatureStatus(signature);
          if (status && status.value && !status.value.err) {
            console.log("Transaction successful despite confirmation error:", status);
            alert(`Transfer appears successful! Check signature: ${signature}`);
            return signature;
          } else if (status && status.value && status.value.err) {
            throw new Error(`Transaction failed: ${status.value.err}`);
          }
        } catch (statusError) {
          console.error("Error checking transaction status:", statusError);
          throw new Error(`Transaction may have failed: ${confirmError.message}. Please check signature ${signature} on Solana Explorer.`);
        }
        
        throw confirmError;
      }
    } catch (error) {
      console.error("Error transferring tokens:", error);
      alert(`Error: ${error.message}`);
      
      // If we have a transaction signature, guide the user to check it
      if (error.message && error.message.includes("signature")) {
        const signatureMatch = error.message.match(/signature\s+(\w+)/i);
        if (signatureMatch && signatureMatch[1]) {
          const extractedSignature = signatureMatch[1];
          console.log(`You can check transaction status at: https://explorer.solana.com/tx/${extractedSignature}`);
        }
      }
    }
  }

  const handleGame = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first.");
      return;
    }
    console.log("Public Key:", publicKey.toString());
    setShowWalletModal(false);

    // Transfer tokens to the host
    const transferSignature = await transferTokens();
    if (!transferSignature) {
      console.error("Token transfer failed");
      return;
    }
    console.log("Token transfer successful, signature:", transferSignature);

    if (modalType === "join" && selectedRoom) {
      console.log("Joining room:", selectedRoom.roomCode);
      const lobbyCode = selectedRoom.roomCode;
      console.log("Joining room with code:", lobbyCode);

      const response = await fetch("/api/joinRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomCode: lobbyCode,
          joinedPlayerWalletAddress: publicKey.toString(),
          joinedPlayerName: user.playerName,
        }),
      });
      const data = await response.json();
      console.log("Join Game Response:", data);
      setShowSuccessModal(true);
      return;
    }

    console.log("Hosting room with code:", lobbyCode);

    //call api to host -> url -> /api/hostRoom
    const response = await fetch("/api/hostRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomCode: lobbyCode,
        hostPlayerWalletAddress: publicKey.toString(),
        hostPlayerName: user.playerName,
        stakeAmount: stakeAmount,
        isPrivateRoom: isPrivate,
        gameId: gameId,
      }),
    });
    const data = await response.json();
    console.log("Host Game Response:", data);
    setShowSuccessModal(true);
    return;
  };

  const handleJoinRoom = (room) => {
    setModalType("join");
    setSelectedRoom(room);
    setStakeAmount(room.stakeAmount);

    setShowWalletModal(true);
  };

  const handleStake = () => {
    console.log("Public Key:", publicKey.toString());
    handleGame();
    setIsConnecting(false);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);

    // If it was a host game, redirect to game link

    //unitydl://mylink?name=Alice&player_id=12345&wallet_address=0xABC123DEF456&tokens=500&room_code=NEWROOM&skin_ids=1,3,5
    if (modalType === "host") {
      const link =
        game.link +
        "name=" +
        user.playerName +
        "&player_id=" +
        user.playerName +
        "&wallet_address=" +
        publicKey.toString() + 
        "&tokens=" +
        stakeAmount +
        "&room_code=" +
        lobbyCode +
        "&skin_ids=" +
        user.skins.join(",") ;
        window.open(link, "_blank");
      } else if (modalType === "join" && selectedRoom) {
        const link =
        game.link +
        "name=" +
        user.playerName +
        "&player_id=" +
        user.playerName +
        "&wallet_address=" +
        publicKey.toString() + 
        "&tokens=" +
        stakeAmount +
        "&room_code=" +
        lobbyCode +
        "&skin_ids=" +
        user.skins.join(",") ;
      window.open(link, "_blank");
    }
  };
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    handleStake();
  };
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        className="text-4xl font-bold mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {game.name}
      </motion.h1>
      <motion.p
        className="text-gray-400 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {game.description}
      </motion.p>
      <div className="flex items-center mb-4">
      <WalletConnectionProvider1>
        <WalletMultiButton className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-md px-4 py-2" /> 
      </WalletConnectionProvider1>
      <br></br>
      <br></br>
      </div>

      <Tabs defaultValue="host" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="host" className="text-lg py-3">
            Host a Game
          </TabsTrigger>
          <TabsTrigger value="join" className="text-lg py-3">
            Join Room
          </TabsTrigger>
        </TabsList>

        <TabsContent value="host" className="space-y-8">
          <motion.div
            className="bg-gray-800/50 border border-purple-900/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <p className="text-gray-300 mb-6">
              Download the game and install it. Once installed, you can host a
              game by entering a unique room code. You can choose to make the
              game private or public. If you choose private, only players with
              the code can join. Choose any lobby code and stake some amount to
              play. You will be redirected to the game. Wait for someone to join
              the room and play the game. If you win, you can claim your reward
              from the rewards page, else you will lose all stake.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={handleZip}
            >
              Download
            </Button>
            <br></br>
            <br></br>

            <div className="space-y-6">
              <div>
                <Label htmlFor="lobby-code">Room Code</Label>
                <Input
                  id="lobby-code"
                  placeholder="Enter a unique room code"
                  className="mt-2 bg-gray-900 border-gray-700"
                  value={lobbyCode}
                  onChange={(e) => setLobbyCode(e.target.value)}
                />
              </div>

              {/* <div>
                <Label htmlFor="stake-amount">Max Players</Label>
                <div className="relative mt-2">
                  <Input
                    id="stake-amount"
                    type="number"
                    placeholder="Enter max players"
                    className="bg-gray-900 border-gray-700 pl-10"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(e.target.value)}
                  />
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div> 

              due to time constraint , we are not implementing max players ....but it can be done easily
              
              
              */}
                


              <div>
                <Label htmlFor="stake-amount">Stake Amount (SOL)</Label>
                <div className="relative mt-2">
                  <Input
                    id="stake-amount"
                    type="number"
                    placeholder="Enter stake amount"
                    className="bg-gray-900 border-gray-700 pl-10"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="private-game"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
                <Label
                  htmlFor="private-game"
                  className="flex items-center cursor-pointer"
                >
                  {isPrivate ? (
                    <Lock className="h-4 w-4 mr-2 text-purple-400" />
                  ) : (
                    <Unlock className="h-4 w-4 mr-2 text-gray-400" />
                  )}
                  {isPrivate ? "Private Game" : "Public Game"}
                </Label>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => {
                  setModalType("host");
                  setShowWalletModal(true);
                }}
                disabled={!lobbyCode || !stakeAmount}
              >
                Host Room
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="join" className="space-y-8">
          <motion.div
            className="bg-gray-800/50 border border-purple-900/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>

            <div className="space-y-4">
              {Rooms.map((room, index) => (
                <RoomCard
                  key={index}
                  room={room}
                  onJoin={() => handleJoinRoom(room)}
                />
              ))}

              {Rooms.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-400">
                    No rooms available. Try hosting a game instead!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {showWalletModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setShowWalletModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-purple-900/30 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Connect Wallet</h2>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="text-center mb-8">
                <div className="bg-gray-800 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                  <Wallet className="h-10 w-10 text-purple-400" />
                </div>

                <p className="text-gray-300 mb-2">
                  {modalType === "host"
                    ? "Stake Tokens to host this game"
                    : "Stake Tokens to join this game"}
                </p>

                {modalType === "host"
                  ? stakeAmount
                  : selectedRoom?.stake && (
                      <p className="text-lg font-bold text-purple-400">
                        Stake Amount:{" "}
                        {modalType === "host"
                          ? stakeAmount
                          : selectedRoom?.stake}{" "}
                        SOL
                      </p>
                    )}
              </div>

              <WalletConnectionProvider1>
                <WalletMultiButton className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-md px-4 py-2" />
              </WalletConnectionProvider1>

              <br></br>
              <br></br>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-md px-4 py-2">
                CGS COINS : {cgsCoins}
              </div>
              <div className="ml-2 text-gray-400">
                <Coins className="h-5 w-5" />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Staking...
                  </div>
                ) : (
                  "Stake Tokens"
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-4">
                By connecting your wallet, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        modalType={modalType}
      />
    </div>
  );
}

function WalletConnectionProvider1({ children }) {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [], []); // Add specific wallets here if needed

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default function WalletConnectionProvider({ children }) {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [], []); // Add specific wallets here if needed

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
        <GamePage />
      </WalletProvider>
    </ConnectionProvider>
  );
}
