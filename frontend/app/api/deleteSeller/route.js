// /app/api/deleteSeller/route.js
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export async function POST(request) {
  try {
    const { listingId } = await request.json();

    if (!listingId) {
      return Response.json({ message: "listingId is required" }, { status: 400 });
    }

    const listingRef = doc(db, "sellers", listingId);
    const listingSnap = await getDoc(listingRef);

    if (!listingSnap.exists()) {
      return Response.json({ message: "Listing not found" }, { status: 404 });
    }

    await deleteDoc(listingRef);

    return Response.json({ message: "Seller listing deleted successfully" },{ status: 200 });
  } catch (error) {
    console.error("Delete seller error:", error);
    return Response.json({ message: "Failed to delete seller" }, { status: 500 });
  }
}
