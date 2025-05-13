import { db } from "@/lib/firebaseAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { objectId, quantity } = await req.json();
        if (!objectId || !quantity || quantity < 1) {
            return Response.json({ error: "Invalid request" }, { status: 400 });
        }
        // Get object
        const objectRef = db.collection("objects").doc(objectId);
        const objectSnap = await objectRef.get();
        if (!objectSnap.exists) {
            return Response.json({ error: "Object not found" }, { status: 404 });
        }
        const objectData = objectSnap.data();
        if (objectData.quantity < quantity) {
            return Response.json({ error: "Not enough quantity available" }, { status: 400 });
        }
        // Decrease quantity atomically
        await objectRef.update({ quantity: objectData.quantity - quantity });
        // Add/increment asset in user's subcollection
        const userId = session.user.email;
        const userAssetRef = db.collection("users").doc(userId).collection("assets").doc(objectId);
        const userAssetSnap = await userAssetRef.get();
        if (userAssetSnap.exists) {
            await userAssetRef.update({ quantity: userAssetSnap.data().quantity + quantity });
        } else {
            await userAssetRef.set({ ...objectData, quantity });
        }
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: "Failed to buy object" }, { status: 500 });
    }
} 