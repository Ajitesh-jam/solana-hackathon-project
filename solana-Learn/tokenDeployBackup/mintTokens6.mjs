// import { clusterApiUrl, Connection, PublicKey, Keypair } from "@solana/web3.js";
// import {
//   createAssociatedTokenAccountIdempotent,
//   mintToChecked,
//   TOKEN_2022_PROGRAM_ID,
//   TOKEN_PROGRAM_ID
// } from "@solana/spl-token";
// import bs58 from "bs58";

// (async () => {
//   // connection
//   const connection = new Connection(
//     clusterApiUrl("devnet"),
//     "confirmed"
//   );

//   // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
//   const feePayer = Keypair.fromSecretKey(
//     bs58.decode(
//       "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
//     )
//   );

//   // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
//   const alice = Keypair.fromSecretKey(
//     bs58.decode(
//       "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
//     )
//   );
// //   const airdropSig = await connection.requestAirdrop(
// //     feePayer.publicKey,
// //     1000000000
// //   );
// //   await connection.confirmTransaction(airdropSig);

//   const mintPubkey = new PublicKey(
//     "CvpuqLp2L8VDmdw93Cf2Sdamv9chCgtKHPgqPRKV5Gqe"
//   );

//   let tokenAccountPubkey = await createAssociatedTokenAccountIdempotent(
//     connection, // connection
//     feePayer, // fee payer
//     mintPubkey, // mint
//     feePayer.publicKey, // owner
//     undefined,
//     TOKEN_2022_PROGRAM_ID
//   );
//   console.log(`ATA: ${tokenAccountPubkey.toBase58()}`);

// //  const tokenAccountPubkey = new PublicKey(
// //     "FsjxBRaArS145B3cNLf3pj3VCK8q7UN6Mnud42fZZ6BR"
// //   );
// //   console.log(`Using token account address: ${tokenAccountPubkey.toBase58()}`);



//   {
//     let txhash = await mintToChecked(
//       connection, // connection
//       feePayer, // fee payer
//       mintPubkey, // mint
//       tokenAccountPubkey, // receiver (should be a token account)
//       feePayer, // mint authority
//       2e9, // amount. if your decimals are 2, you mint 10^2 for 1 token.
//       9, // decimals
//       undefined,
//       undefined,
//       TOKEN_PROGRAM_ID
//     );
//     console.log(`txhash: ${txhash}`);

//     // if alice is a multisig account
//     // let txhash = await mintToChecked(
//     //   connection, // connection
//     //   feePayer, // fee payer
//     //   mintPubkey, // mint
//     //   tokenAccountPubkey, // receiver (should be a token account)
//     //   alice.publicKey, // !! mint authority pubkey !!
//     //   1e8, // amount. if your decimals are 8, you mint 10^8 for 1 token.
//     //   8, // decimals
//     //   [signer1, signer2 ...],
//     // );
//   }
// })();

import { clusterApiUrl, Connection, PublicKey, Keypair } from "@solana/web3.js";
import {
  createAssociatedTokenAccountIdempotent,
  mintToChecked,
  TOKEN_2022_PROGRAM_ID
,  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import bs58 from "bs58";
import { getAssociatedTokenAddress } from "@solana/spl-token";


(async () => {
  // connection
  const connection = new Connection(
    clusterApiUrl("devnet"),
    "confirmed"
  );

  // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
  const feePayer = Keypair.fromSecretKey(
    bs58.decode(
      "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
    )
  );

  //get fee payer from 

  // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
  const alice = Keypair.fromSecretKey(
    bs58.decode(
      "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
    )
  );
//   const airdropSig = await connection.requestAirdrop(
//     feePayer.publicKey,
//     1000000000
//   );
//   await connection.confirmTransaction(airdropSig);

  const mintPubkey = new PublicKey(
    "FBVWtAGCHoDjnexCQ1bW37aSMF1BBzSZukBFdpJzJkx3"
  );
 
  console.log(`mintPubkey: ${mintPubkey}`);

  const tokenAccountPubkey = new PublicKey(
    "FsjxBRaArS145B3cNLf3pj3VCK8q7UN6Mnud42fZZ6BR"
  );
  console.log(`Using token account address: ${tokenAccountPubkey.toBase58()}`);
  console.log(`ATA: ${tokenAccountPubkey.toBase58()}`);



    // Get (or create if needed) the correct associated token account
    const correctTokenAccount = await createAssociatedTokenAccountIdempotent(
      connection,
      feePayer,               // fee payer
      mintPubkey,             // the mint for which the ATA is being created
      feePayer.publicKey,        // owner of the token account
      {},                     // default options
      TOKEN_PROGRAM_ID        // or TOKEN_2022_PROGRAM_ID if you're using Token-2022
    );

    console.log(`Correct ATA: ${correctTokenAccount.toBase58()}`);


  {
    // let txhash = await mintToChecked(
    //   connection, // connection
    //   feePayer, // fee payer
    //   mintPubkey, // mint
    //   tokenAccountPubkey, // receiver (should be a token account)
    //   feePayer, // mint authority
    //   1e9, // amount. if your decimals are 2, you mint 10^2 for 1 token.
    //   9, // decimals
    //   undefined,
    //   undefined,
    //   TOKEN_PROGRAM_ID
    // );
    console.log("minitng to correct token account",correctTokenAccount);
    let txhash = await mintToChecked(
      connection,
      feePayer,
      mintPubkey,
      correctTokenAccount,
      feePayer,  // mint authority
      6e9,
      9,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );

    
    console.log(`txhash: ${txhash}`);

    // if alice is a multisig account
    // let txhash = await mintToChecked(
    //   connection, // connection
    //   feePayer, // fee payer
    //   mintPubkey, // mint
    //   tokenAccountPubkey, // receiver (should be a token account)
    //   alice.publicKey, // !! mint authority pubkey !!
    //   1e8, // amount. if your decimals are 8, you mint 10^8 for 1 token.
    //   8, // decimals
    //   [signer1, signer2 ...],
    // );
  }
})();