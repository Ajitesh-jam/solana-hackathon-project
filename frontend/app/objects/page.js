"use client"
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function ObjectsPage() {
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buying, setBuying] = useState({}); // { [objectId]: boolean }
    const [quantities, setQuantities] = useState({}); // { [objectId]: number }
    const { data: session } = useSession();

    useEffect(() => {
        fetch("/api/objects")
            .then((res) => res.json())
            .then((data) => {
                // Assign random price if not set
                const updated = data.map(obj => ({
                    ...obj,
                    price: obj.price || (Math.floor(Math.random() * 100) + 1),
                }));
                setObjects(updated);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch objects");
                setLoading(false);
            });
    }, []);

    const handleBuy = async (objectId) => {
        setBuying(b => ({ ...b, [objectId]: true }));
        const quantity = quantities[objectId] || 1;
        const res = await fetch("/api/objects/buy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ objectId, quantity }),
        });
        if (res.ok) {
            setObjects(objs => objs.map(obj => obj.id === objectId ? { ...obj, quantity: obj.quantity - quantity } : obj));
        }
        setBuying(b => ({ ...b, [objectId]: false }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    Firestore Objects
                </h1>
                {loading ? (
                    <div className="text-center text-gray-300 text-xl">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-500 text-xl">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {objects.map((obj) => (
                            <Card key={obj.id} className="hover:scale-105 transition-transform duration-300 bg-gray-800/80 border-purple-700 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-purple-300">{obj.name}</CardTitle>
                                    <CardDescription className="text-gray-400">{obj.category}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <img src={obj.imageUrl} alt={obj.name} className="rounded-lg mb-4 w-full h-48 object-cover border border-purple-700" />
                                    <p className="text-gray-200 mb-2">{obj.description}</p>
                                    <p className="text-sm text-gray-400 mb-2">Created: {obj.createdAt}</p>
                                    <p className="text-lg font-semibold text-pink-400">Price: {obj.price} ◎</p>
                                    <p className="text-sm text-gray-400 mb-2">Available: {obj.quantity ?? 0}</p>
                                    {obj.quantity > 0 && session && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <input
                                                type="number"
                                                min={1}
                                                max={obj.quantity}
                                                value={quantities[obj.id] || 1}
                                                onChange={e => setQuantities(q => ({ ...q, [obj.id]: Math.max(1, Math.min(obj.quantity, Number(e.target.value))) }))}
                                                className="w-16 rounded bg-gray-900 border border-purple-700 px-2 py-1 text-white"
                                            />
                                            <Button
                                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                                onClick={() => handleBuy(obj.id)}
                                                disabled={buying[obj.id]}
                                            >
                                                {buying[obj.id] ? "Buying..." : "Buy"}
                                            </Button>
                                        </div>
                                    )}
                                    {obj.quantity === 0 && (
                                        <div className="text-red-400 font-bold mt-4">Unavailable</div>
                                    )}
                                    {!session && (
                                        <div className="text-gray-400 mt-2">Sign in to buy</div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">View Details</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

