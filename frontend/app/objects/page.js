"use client"
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ObjectsPage() {
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/api/objects")
            .then((res) => res.json())
            .then((data) => {
                setObjects(data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch objects");
                setLoading(false);
            });
    }, []);

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

