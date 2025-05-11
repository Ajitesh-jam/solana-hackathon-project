import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getAccount } from "@solana/spl-token";

(async () => {
    const NETWORK = "http://127.0.0.1:8899";
    console.log(`💻 Connecting to Solana network: ${NETWORK}`);
    const connection = new Connection(NETWORK, "confirmed");

  const tokenAccountPubkey = new PublicKey(
    "CUGprhFgtNxiHxBbZCAopzzPMQohcQsT2eUWAGKAoKbE"
  );
  console.log(
    `Fetching token account info for ${tokenAccountPubkey.toBase58()}...`
  );

  let tokenAccount = await getAccount(connection, tokenAccountPubkey);
  console.log(tokenAccount);
  /*
  {
    address: PublicKey {
      _bn: <BN: 16aef79dfadb39ffedb3b6f77688b8c162b18bb9cba2ffefe152303629ae3030>
    },
    mint: PublicKey {
      _bn: <BN: 7351e5e067cc7cfefef42e78915d3c513edbb8adeeab4d9092e814fe68c39fec>
    },
    owner: PublicKey {
      _bn: <BN: df30e6ca0981c1a677eed6f7cb46b2aa442ca9b7a10a10e494badea4b9b6944f>
    },
    amount: 0n,
    delegate: null,
    delegatedAmount: 0n,
    isInitialized: true,
    isFrozen: false,
    isNative: false,
    rentExemptReserve: null,
    closeAuthority: null
  }
  */
})();




(async () => {
  const NETWORK = "http://127.0.0.1:8899";
  console.log(`💻 Connecting to Solana network: ${NETWORK}`);
  const connection = new Connection(NETWORK, "confirmed");

  const tokenAccount = new PublicKey(
    "CUGprhFgtNxiHxBbZCAopzzPMQohcQsT2eUWAGKAoKbE"
  );

  let tokenAmount = await connection.getTokenAccountBalance(tokenAccount);
  console.log(`amount: ${tokenAmount.value.amount}`);
  console.log(`decimals: ${tokenAmount.value.decimals}`);
})();