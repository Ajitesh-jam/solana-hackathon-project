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

const signer = await createKeyPairSignerFromBytes(
  bs58.decode(
    "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
  )
);
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
        name: "super sweet token",
        symbol: "SST",
        uri: {
          "name": "OPOS",
          "symbol": "OPOS",
          "description": "Only Possible On Solana",
          "image": "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/Climate/image.png",
          "attributes": [
            {
              "trait_type": "Item",
              "value": "Climate"
            }
          ]
        }
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




