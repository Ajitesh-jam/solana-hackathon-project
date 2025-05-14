import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/ui/navbar"
import Sidebar from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/hooks/use-toast"
import { AuthProvider } from "@/components/auth/auth-provider"
import FloatingIcons from "@/components/floating-icons"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Solana Gaming Ecosystem",
  description: "Compete, stake, and earn rewards in blockchain gaming",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-auto">{children}</main>
                  <FloatingIcons />
                </div>
              </div>
         
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
