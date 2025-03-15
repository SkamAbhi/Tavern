import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "./components/header"
import { AuthProvider } from "./contexts/AuthContexts"
import { Toaster } from "sonner"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Isekai Tavern - Medieval Fantasy Meeting Space",
  description:
    "A medieval fantasy meeting space where adventurers from different worlds gather to connect, collaborate, and share tales of their journeys.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <AuthProvider>
        <Header />
        <Toaster /> 
        {children}
        </AuthProvider>
      </body>
    </html>
  )
}

