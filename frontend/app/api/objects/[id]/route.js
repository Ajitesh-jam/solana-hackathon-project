import { db } from "@/lib/firebaseAdmin";

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const doc = await db.collection("objects").doc(id).get();
        if (!doc.exists) {
            return Response.json({ error: "Object not found" }, { status: 404 });
        }
        return Response.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        return Response.json({ error: "Failed to fetch object" }, { status: 500 });
    }
} 