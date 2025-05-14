import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerName = searchParams.get("playerName");

    if (!playerName) {
      return Response.json({ message: "playerName is required" }, { status: 400 });
    }

    const userRef = doc(db, "users", playerName);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const { skins = [] } = userSnap.data();

    return Response.json({ skins });
  } catch (error) {
    console.error("Get skins error:", error);
    return Response.json({ message: "Failed to get skins" }, { status: 500 });
  }
}
