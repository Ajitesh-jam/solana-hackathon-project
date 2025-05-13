import { db } from "@/lib/firebaseAdmin";

export async function GET() {
    try {
        const snapshot = await db.collection("objects").get();
        const objects = [];
        snapshot.forEach(doc => {
            objects.push({ id: doc.id, ...doc.data() });
        });
        return Response.json(objects);
    } catch (error) {
        return Response.json({ error: "Failed to fetch objects" }, { status: 500 });
    }
}