import { ProductCategoryForm } from "@/components/product-category-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewProductCategoryPage() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">إضافة فئة منتج جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductCategoryForm />
        </CardContent>
      </Card>
    </div>
  )
}

