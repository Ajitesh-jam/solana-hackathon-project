import {
  airdropFactory,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  getExplorerLink,
  getMinimumBalanceForRentExemption,
  getSignatureFromTransaction,
  lamports,
  signTransactionMessageWithSigners,
  createKeyPairSignerFromBytes,
} from "gill";
import {
  getCreateAccountInstruction,
  getCreateMetadataAccountV3Instruction,
  getTokenMetadataAddress
  // @ts-ignore
} from "gill/programs";
import bs58 from "bs58";
import {
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS
  // @ts-ignore
} from "gill/programs/token";


const { rpc, rpcSubscriptions, sendAndConfirmTransaction } = createSolanaClient(
  {
    urlOrMoniker: "devnet"
  }
);

const secretKey = Uint8Array.from(process.env.PVT_KEY_gNxgyDEgJqCctLSsir6DgMTe8vyktX7q6LkFLMmS2tD);

// Base58 encode the secret key
const base58SecretKey = bs58.encode(secretKey);

// Pass it to createKeyPairSignerFromBytes
const signer = await createKeyPairSignerFromBytes(bs58.decode(base58SecretKey));

console.log("Signer address:", signer.address);


// const signer = await createKeyPairSignerFromBytes(
//   bs58.decode(
//     "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
    
//   )
// );

//const signer = walletKeypair;
// await airdropFactory({ rpc, rpcSubscriptions })({
//   commitment: "confirmed",
//   lamports: lamports(100_000_000n),
//   recipientAddress: signer.address
// });
console.log("signer:", signer.address);

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const tokenProgram = TOKEN_PROGRAM_ADDRESS;
const mint = await generateKeyPairSigner();
console.log("mint:", mint.address);

const space = getMintSize();

const metadataAddress = await getTokenMetadataAddress(mint);

/**
 * instead of manually crafting the `instructions` below and deriving addresses above:
 * you could use the `getCreateTokenInstructions()` function to simplify this code
 */
const transaction = createTransaction({
  feePayer: signer,
  version: "legacy",
  instructions: [
    getCreateAccountInstruction({
      space,
      lamports: getMinimumBalanceForRentExemption(space),
      newAccount: mint,
      payer: signer,
      programAddress: tokenProgram
    }),
    getInitializeMintInstruction(
      {
        mint: mint.address,
        mintAuthority: signer.address,
        freezeAuthority: signer.address,
        decimals: 9
      },
      { programAddress: tokenProgram }
    ),
    getCreateMetadataAccountV3Instruction({
      collectionDetails: null,
      isMutable: true,
      updateAuthority: signer,
      mint: mint.address,
      metadata: metadataAddress,
      mintAuthority: signer,
      payer: signer,
      data: {
        sellerFeeBasisPoints: 0,
        collection: null,
        creators: null,
        uses: null,
        name: "CGS COIN",
        symbol: "CGS",
        uri: "https://raw.githubusercontent.com/Ajitesh-jam/solana-hackathon-project/solana-Learn/token/metadata.json"
      }
    })
  ],
  latestBlockhash
});


// instead of the above `transaction`, you can also simplify your code
// using the `buildCreateTokenTransaction()` function
// const transaction = await buildCreateTokenTransaction({
//   feePayer: signer,
//   version: "legacy",
//   decimals: 9,
//   metadata: {
//     isMutable: true,
//     name: "super sweet token",
//     symbol: "SST",
//     uri: "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/Climate/metadata.json",
//   },
//   mint,
//   latestBlockhash,
//   // defaults to `TOKEN_PROGRAM_ADDRESS`
//   tokenProgram,
// });


const signedTransaction = await signTransactionMessageWithSigners(transaction);

await sendAndConfirmTransaction(signedTransaction);




//https://raw.githubusercontent.com/Ajitesh-jam/solana-hackathon-project/solana-Learn/token/metadata.json
//https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/assets/Climate/metadata.json



//https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/Climate/metadata.json