// /app/api/getAllSkins/route.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export async function GET() {
  try {
    const sellersRef = collection(db, "sellers");
    const snapshot = await getDocs(sellersRef);

    const listings = snapshot.docs.map(doc => doc.data());

    return Response.json({ listings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching skins:", error);
    return Response.json({ message: "Failed to fetch skins" }, { status: 500 });
  }
}
