import {
  airdropFactory,
  appendTransactionMessageInstructions,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";

// Create a connection to cluster
const rpc = createSolanaRpc("http://localhost:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://localhost:8900");

// Generate sender and recipient keypairs
const sender = await generateKeyPairSigner();
const recipient = await generateKeyPairSigner();

const LAMPORTS_PER_SOL = 1_000_000_000n;
const transferAmount = lamports(LAMPORTS_PER_SOL / 100n); // 0.01 SOL



// Fund sender with airdrop
await airdropFactory({ rpc, rpcSubscriptions })({
  recipientAddress: sender.address,
  lamports: lamports(LAMPORTS_PER_SOL), // 1 SOL
  commitment: "confirmed"
});

// Check balance before transfer
const { value: preBalance1 } = await rpc.getBalance(sender.address).send();
const { value: preBalance2 } = await rpc.getBalance(recipient.address).send();

// Create a transfer instruction for transferring SOL from sender to recipient
const transferInstruction = getTransferSolInstruction({
  source: sender,
  destination: recipient.address,
  amount: transferAmount // 0.01 SOL in lamports
});

// Add the transfer instruction to a new transaction
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(sender, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstructions([transferInstruction], tx)
);

// Send the transaction to the network
const signedTransaction =
  await signTransactionMessageWithSigners(transactionMessage);
await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
  signedTransaction,
  { commitment: "confirmed" }
);
const transactionSignature = getSignatureFromTransaction(signedTransaction);

// Check balance after transfer
const { value: postBalance1 } = await rpc.getBalance(sender.address).send();
const { value: postBalance2 } = await rpc.getBalance(recipient.address).send();

console.log(
  "Sender prebalance:",
  Number(preBalance1) / Number(LAMPORTS_PER_SOL)
);
console.log(
  "Recipient prebalance:",
  Number(preBalance2) / Number(LAMPORTS_PER_SOL)
);
console.log(
  "Sender postbalance:",
  Number(postBalance1) / Number(LAMPORTS_PER_SOL)
);
console.log(
  "Recipient postbalance:",
  Number(postBalance2) / Number(LAMPORTS_PER_SOL)
);
console.log("Transaction Signature:", transactionSignature);



import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

async function buildCreateMintTransaction(
    connection,
    payer,
    decimals,
){
    const lamports = await token.getMinimumBalanceForRentExemptMint(connection);
    const accountKeypair = web3.Keypair.generate();
    const programId = token.TOKEN_PROGRAM_ID;

    const transaction = new web3.Transaction().add(
        web3.SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: accountKeypair.publicKey,
            space: token.MINT_SIZE,
            lamports,
            programId,
        }),
        token.createInitializeMintInstruction(
            accountKeypair.publicKey,
            decimals,
            payer,
            payer,
            programId,
        ),
    );

    return transaction;
}