import { db } from "@/lib/firebaseAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route.js";

export async function GET(req) {
    try {
        const session = await getServerSession(req, authOptions);
        if (!session) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.email;
        const assetsSnap = await db.collection("users").doc(userId).collection("assets").get();
        const assets = [];
        assetsSnap.forEach(doc => {
            assets.push({ id: doc.id, ...doc.data() });
        });
        return Response.json(assets);
    } catch (error) {
        return Response.json({ error: "Failed to fetch user assets" }, { status: 500 });
    }
} 