import { db } from "@/lib/firebaseAdmin";

export async function GET(request, { params }) {
    const { walletAdress } = params;
    try {
        const snapshot = await db.collection("objects").where("walletAdress", "==", walletAdress).get();
        const objects = [];
        snapshot.forEach(doc => {
            objects.push({ id: doc.id, ...doc.data() });
        });
        return Response.json(objects);
    } catch (error) {
        return Response.json({ error: "Failed to fetch objects by wallet address" }, { status: 500 });
    }
} 