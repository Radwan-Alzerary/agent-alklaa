"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { columns } from "@/app/product-categories/columns"
import { getProductCategories } from "@/lib/api"
import { ProductCategory } from "@/app/product-categories/columns"

export default function ProductCategoryList() {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const fetchedCategories = await getProductCategories()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Failed to fetch product categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return <div>جاري التحميل...</div>
  }

  return <DataTable columns={columns} data={categories} searchKey="name" />
}

