"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Home, Users, ShoppingBag, FileText, LogOut, BarChart, Tag, Settings, CreditCard } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/signin")
  }

  const menuItems = [
    { icon: Home, label: "لوحة التحكم", href: "/dashboard" },
    { icon: Users, label: "الوكلاء", href: "/agents" },
    { icon: Users, label: "العملاء", href: "/customers" },
    { icon: ShoppingBag, label: "المنتجات", href: "/products" },
    { icon: FileText, label: "الفواتير", href: "/invoices" },
    { icon: BarChart, label: "تحليلات الوكلاء", href: "/analytics/agents" },
    { icon: BarChart, label: "تحليلات العملاء", href: "/analytics/customers" },
    { icon: BarChart, label: "تحليلات المنتجات", href: "/analytics/products" },
    { icon: BarChart, label: "تحليلات الفواتير", href: "/analytics/invoices" },
    { icon: Tag, label: "فئات المنتجات", href: "/product-categories" },
    { icon: Settings, label: "الإعدادات", href: "/settings" },
    { icon: CreditCard, label: "سجل المدفوعات", href: "/payments" },
    { icon: CreditCard, label: "تسجيل دفعة", href: "/payments/new" },
  ]

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white print:hidden">
      <div className="flex items-center justify-center h-16 bg-gray-800">
        <h2 className="text-xl font-bold">نظام إدارة المندوبين</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800",
                  pathname === item.href ? "bg-gray-800 text-white" : "text-gray-400"
                )}
              >
                <item.icon className="h-5 w-5 ml-2" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start text-white hover:bg-gray-800 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  )
}

