const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
// Note: You'll need to replace this with your actual Firebase configuration
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
});

// Initialize Firestore
const db = admin.firestore();

// Test route
app.get('/', (req, res) => {
    res.json({ message: `Server is running on port ${port}!` });
});

// Example route to interact with Firestore
app.get('/api/items', async (req, res) => {
    try {
        const itemsSnapshot = await db.collection('items').get();
        const items = [];
        itemsSnapshot.forEach((doc) => {
            items.push({
                id: doc.id,
                ...doc.data()
            });
        });
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to fetch all objects from Firestore
app.get('/api/objects', async (req, res) => {
    try {
        const objectsSnapshot = await db.collection('objects').get();
        const objects = [];
        objectsSnapshot.forEach((doc) => {
            objects.push({
                id: doc.id,
                ...doc.data()
            });
        });
        res.json(objects);
    } catch (error) {
        console.error('Error fetching objects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Route to fetch objects according to id
app.get('/api/objects/:id', async (req, res) => {
    const objectId = req.params.id;
    const objectSnapshot = await db.collection('objects').doc(objectId).get();
    const object = objectSnapshot.data();
    res.json(object);
});

//Route to fetch objects according to walletAdress  
app.get('/api/objects/:walletAdress', async (req, res) => {
    const objectId = req.params.id;
    const objectSnapshot = await db.collection('objects').doc(objectId).get();
    const object = objectSnapshot.data();
    res.json(object);
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 