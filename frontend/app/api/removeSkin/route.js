import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export async function POST(request) {
  try {
    const { playerName, skinId } = await request.json();

    if (!playerName || typeof skinId !== "number") {
      return Response.json({ message: "playerName and skinId (number) are required" }, { status: 400 });
    }

    const userRef = doc(db, "users", playerName);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    const { skins = [] } = userData;

    if (!skins.includes(skinId)) {
      return Response.json({ message: "User does not own this skin" }, { status: 400 });
    }

    const updatedSkins = skins.filter((id) => id !== skinId);

    await updateDoc(userRef, {
      skins: updatedSkins,
    });

    return Response.json({ message: "Skin deleted successfully" });
  } catch (error) {
    console.error("Delete skin error:", error);
    return Response.json({ message: "Failed to delete skin" }, { status: 500 });
  }
}
