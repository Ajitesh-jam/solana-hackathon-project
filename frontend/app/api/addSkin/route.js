import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
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

    await updateDoc(userRef, {
      skins: arrayUnion(skinId),
    });

    return Response.json({ message: "Skin added successfully" });
  } catch (error) {
    console.error("Add skin error:", error);
    return Response.json({ message: "Failed to add skin" }, { status: 500 });
  }
}
