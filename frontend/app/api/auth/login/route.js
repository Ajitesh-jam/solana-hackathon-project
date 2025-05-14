
import {signInWithEmailAndPassword } from "firebase/auth"
import { collection, query, where, getDocs } from "firebase/firestore"
import bcrypt from 'bcryptjs';
import {db} from '../../../../lib/firebase'

export async function POST(request) {
  try {
    const { playerName, password } = await request.json()

    if (!playerName || !password) {
      return Response.json({ message: "Player name and password are required" }, { status: 400 })
    }

    // First, find the user's email by playerName
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("playerName", "==", playerName))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return Response.json({ message: "Player not found" }, { status: 404 })
    }

    // Get the user's email
    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data()

    //check the password with bcrypt
    const passwordMatch = await bcrypt.compare(password, userData.password)
    if (!passwordMatch) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 })
    }



    // Return user data (excluding sensitive information)
    return Response.json({
      message: "Login successful",
      user: {
        playerName: userData.playerName,
        email: userData.email,
        skins: userData.skins,
      },
    })
  } catch (error) {
    console.error("Login error:", error)

    // Handle specific Firebase auth errors
    if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
      return Response.json({ message: "Invalid credentials" }, { status: 401 })
    }

    if (error.code === "auth/too-many-requests") {
      return Response.json({ message: "Too many failed login attempts. Please try again later." }, { status: 429 })
    }

    return Response.json({ message: "Login failed. Please try again." }, { status: 500 })
  }
}
