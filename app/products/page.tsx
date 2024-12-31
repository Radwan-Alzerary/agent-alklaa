import { Suspense } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProductList from "@/components/product-list"

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="mr-2 h-4 w-4" /> إضافة منتج
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <ProductList />
      </Suspense>
    </div>
  )
}

