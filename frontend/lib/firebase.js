// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();


// const firebaseConfig = {
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId,
//   storageBucket: process.env.storageBucket,
//   messagingSenderId: process.env.messagingSenderId,
//   appId: process.env.appId,
//   measurementId: process.env.measurementId
  
// };


const firebaseConfig = {
  apiKey: "AIzaSyDqzFlbFFSAP0yUWB9EDjxOF19-INFSsug",
  authDomain: "solana-hackathon-cd4dc.firebaseapp.com",
  projectId: "solana-hackathon-cd4dc",
  storageBucket: "solana-hackathon-cd4dc.firebasestorage.app",
  messagingSenderId: "503129489840",
  appId: "1:503129489840:web:2354acf407f4c56acf9675",
  measurementId: "G-Q5XLZHJVZD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
