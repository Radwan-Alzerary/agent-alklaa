"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createProductCategory, updateProductCategory } from "@/lib/api"
import { ProductCategory } from "@/app/product-categories/columns"
import { createCategory } from "@/lib/api"

interface ProductCategoryFormProps {
  category?: ProductCategory
}

export function ProductCategoryForm({ category }: ProductCategoryFormProps) {
  const router = useRouter()
  const [name, setName] = useState(category?.name || "")
  const [description, setDescription] = useState(category?.description || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const categoryData = { name, description }
      if (category) {
        await updateProductCategory(category.id, categoryData)
      } else {
        await createCategory(categoryData)
      }
      router.push("/product-categories")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("حدث خطأ أثناء حفظ بيانات الفئة")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">اسم الفئة</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "جاري الحفظ..." : (category ? "تحديث الفئة" : "إضافة الفئة")}
      </Button>
    </form>
  )
}

