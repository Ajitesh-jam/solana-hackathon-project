import { initializeApp } from "firebase/app"
import { getAuth, signOut } from "firebase/auth"
import {app} from '../../../../lib/firebase'


const auth = getAuth(app)

export async function POST() {
  try {
    await signOut(auth)
    return Response.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return Response.json({ message: "Failed to log out. Please try again." }, { status: 500 })
  }
}
