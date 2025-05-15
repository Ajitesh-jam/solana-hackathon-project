import { db } from "@/lib/firebaseAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(req, authOptions);
        if (!session) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { objectId, quantity } = await req.json();
        if (!objectId || !quantity || quantity < 1) {
            return Response.json({ error: "Invalid request" }, { status: 400 });
        }
        // Get user's asset
        const userId = session.user.email;
        const userAssetRef = db.collection("users").doc(userId).collection("assets").doc(objectId);
        const userAssetSnap = await userAssetRef.get();
        if (!userAssetSnap.exists || userAssetSnap.data().quantity < quantity) {
            return Response.json({ error: "Not enough asset quantity to sell" }, { status: 400 });
        }
        // Decrease or remove asset from user
        if (userAssetSnap.data().quantity === quantity) {
            await userAssetRef.delete();
        } else {
            await userAssetRef.update({ quantity: userAssetSnap.data().quantity - quantity });
        }
        // Increase object quantity atomically
        const objectRef = db.collection("objects").doc(objectId);
        const objectSnap = await objectRef.get();
        if (!objectSnap.exists) {
            return Response.json({ error: "Object not found" }, { status: 404 });
        }
        await objectRef.update({ quantity: objectSnap.data().quantity + quantity });
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: "Failed to sell object" }, { status: 500 });
    }
} 