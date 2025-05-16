import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getMint, TOKEN_PROGRAM_ID,TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

(async () => {
    const NETWORK = "devnet";
    console.log(`Connecting to Solana network: ${NETWORK}`);
    
    const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");
    
    console.log("Connection established");
  const mintAccountPublicKey = new PublicKey(
    "MINT_ADDRESS"
  );
  console.log(`Using mint address: ${mintAccountPublicKey.toBase58()}`);
  console.log("Fetching token information...");

  let mintAccount = await getMint(
    connection,
    mintAccountPublicKey,
    "confirmed",
    TOKEN_PROGRAM_ID
  );
  console.log(mintAccount);


  /*
  {
    address: PublicKey {
      _bn: <BN: 7351e5e067cc7cfefef42e78915d3c513edbb8adeeab4d9092e814fe68c39fec>
    },
    mintAuthority: PublicKey {
      _bn: <BN: df30e6ca0981c1a677eed6f7cb46b2aa442ca9b7a10a10e494badea4b9b6944f>
    },
    supply: 0n,
    decimals: 8,
    isInitialized: true,
    freezeAuthority: PublicKey {
      _bn: <BN: df30e6ca0981c1a677eed6f7cb46b2aa442ca9b7a10a10e494badea4b9b6944f>
    }
  }
  */
})();


