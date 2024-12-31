"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProducts, getProductCategories } from "@/lib/api"
import { Product, ProductCategory } from "@/lib/api"

export function ProductCategoryAnalytics() {
  const [data, setData] = useState<{ name: string; count: number }[]>([])

  useEffect(() => {
    async function fetchData() {
      const [products, categories] = await Promise.all([getProducts(), getProductCategories()])
      const categoryCounts = categories.map(category => ({
        name: category.name,
        count: products.filter(product => product.category === category.name).length
      }))
      setData(categoryCounts)
    }
    fetchData()
  }, [])

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>توزيع المنتجات حسب الفئات</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="عدد المنتجات" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

