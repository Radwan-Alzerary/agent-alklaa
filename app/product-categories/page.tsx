import { Suspense } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProductCategoryList from "@/components/product-category-list"
import { getProductCategories, getProducts } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProductCategoriesPage() {
  const [categories, products] = await Promise.all([getProductCategories(), getProducts()])
  const totalProducts = products.length
  const totalCategories = categories.length

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة فئات المنتجات</h1>
        <Button asChild>
          <Link href="/product-categories/new">
            <Plus className="mr-2 h-4 w-4" /> إضافة فئة
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الفئات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
      </div>
      <Suspense fallback={<div>جاري التحميل...</div>}>
        {/* <ProductCategoryList categories={categories} /> */}
      </Suspense>
    </div>
  )
}

