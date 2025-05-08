import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

(async () => {
  const connection = new Connection(
    clusterApiUrl("devnet"),
    "confirmed"
  );

  const tokenAccount = new PublicKey(
    "H2EtPtNUtEqxdLjxw8kkFytuaVa1TWaCVxgAgkd6m8gB"
  );

  let tokenAmount = await connection.getTokenAccountBalance(tokenAccount);
  console.log("token acc : ",tokenAccount);
  console.log(`amount: ${tokenAmount.value.amount}`);
  console.log(`decimals: ${tokenAmount.value.decimals}`);
})();