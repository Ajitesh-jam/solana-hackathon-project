
import {  collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore"

import { db } from "../../../../lib/firebase"
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { playerName, email, password } = await request.json()

    if (!playerName || !email || !password) {
      return Response.json({ message: "Player name, email, and password are required" }, { status: 400 })
    }

    // Check if player name already exists
    const playerNameQuery = query(collection(db, "users"), where("playerName", "==", playerName))
    const playerNameSnapshot = await getDocs(playerNameQuery)

    if (!playerNameSnapshot.empty) {
      return Response.json({ message: "Player name already taken" }, { status: 409 })
    }
    //hash the password by bcrypt

    const passwordHash = await bcrypt.hash(password, 10);
    

    // Store additional user data in Firestore
    await setDoc(doc(db, "users", playerName), {
      playerName,
      email,
      password: passwordHash,
      skins: [],
    })

    return Response.json({
      message: "User created successfully",
      user: {
        playerName,
        email,
        skins: [],
      },
    })
  } catch (error) {
    console.error("Signup error:", error)

    // Handle specific Firebase auth errors
    if (error.code === "auth/email-already-in-use") {
      return Response.json({ message: "Email already in use" }, { status: 409 })
    }

    if (error.code === "auth/invalid-email") {
      return Response.json({ message: "Invalid email address" }, { status: 400 })
    }

    if (error.code === "auth/weak-password") {
      return Response.json({ message: "Password is too weak" }, { status: 400 })
    }

    return Response.json({ message: "Failed to create account. Please try again." }, { status: 500 })
  }
}
