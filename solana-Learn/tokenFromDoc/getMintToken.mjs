import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

(async () => {
    const NETWORK = "http://127.0.0.1:8899";
    console.log(`💻 Connecting to Solana network: ${NETWORK}`);
    const connection = new Connection(NETWORK, "confirmed");
    console.log("✅ Connection established");;

  const mintAccountPublicKey = new PublicKey(
    "CUGprhFgtNxiHxBbZCAopzzPMQohcQsT2eUWAGKAoKbE"
  );

  let mintAccount = await getMint(
    connection,
    mintAccountPublicKey,
    undefined,
    TOKEN_2022_PROGRAM_ID
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