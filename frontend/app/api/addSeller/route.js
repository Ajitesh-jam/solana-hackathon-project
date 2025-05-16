// /app/api/addSeller/route.js
import { doc, setDoc, getDoc ,updateDoc} from "firebase/firestore";
import { db } from "../../../lib/firebase";

export async function POST(request) {
  try {
    const { listingId, skinId, sellerName, sellerWalletAddress, price, listedDate } = await request.json();

   
    
    //delete skin from the user
    const userRef = doc(db, "users", sellerName);
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
    

    const listingRef = doc(db, "sellers", listingId);
    const listingSnap = await getDoc(listingRef);

    if (listingSnap.exists()) {
      return Response.json({ message: "Listing ID already exists" }, { status: 409 });
    }

    await setDoc(listingRef, {
      listingId,
      skinId,
      sellerName,
      sellerWalletAddress,
      price,
      listedDate,
    });

    return Response.json({ message: "Seller listing added successfully" });
  } catch (error) {
    console.error("Add seller error:", error);
    return Response.json({ message: "Failed to add seller" }, { status: 500 });
  }
}
