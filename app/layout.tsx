import type { Metadata } from "next"
import { Cairo } from 'next/font/google'
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import { AppContent } from "@/components/app-content"

const cairo = Cairo({ subsets: ["arabic"] })

export const metadata: Metadata = {
  title: "نظام إدارة المندوبين",
  description: "إدارة المندوبين والعملاء والمنتجات والفئات بكفاءة",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}

