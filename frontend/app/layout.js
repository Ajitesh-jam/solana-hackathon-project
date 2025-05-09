import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import Link from "next/link"
//import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Solana Gaming Ecosystem",
  description: "Compete, stake, and win rewards in blockchain gaming",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white overflow-x-hidden`}>
        {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}> */}
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <nav className="w-full bg-gray-950 py-4 px-8 flex items-center justify-between shadow-md z-50">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-bold text-purple-400 hover:text-pink-400 transition-colors">Home</Link>
                <Link href="/objects" className="text-lg font-medium text-gray-200 hover:text-pink-400 transition-colors">Objects</Link>
              </div>
            </nav>
            <Navbar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
