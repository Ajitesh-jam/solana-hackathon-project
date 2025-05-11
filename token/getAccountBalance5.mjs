import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

(async () => {
  const connection = new Connection(
    clusterApiUrl("devnet"),
    "confirmed"
  );

  const tokenAccount = new PublicKey(
    "EwCTppEs8y7zuzRHGD54GDWXYwiHxCkvqAKZp8K2T7GZ"
  );

  let tokenAmount = await connection.getTokenAccountBalance(tokenAccount);
  console.log("token acc : ",tokenAccount);
  console.log(`amount: ${tokenAmount.value.amount}`);
  console.log(`decimals: ${tokenAmount.value.decimals}`);
})();