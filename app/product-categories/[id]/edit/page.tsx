import { ProductCategoryForm } from "@/components/product-category-form"
import { getProductCategory } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EditProductCategoryPage({ params }: { params: { id: string } }) {
  const category = await getProductCategory(params.id)

  if (!category) {
    return <div>الفئة غير موجودة</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">تعديل فئة المنتج</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductCategoryForm category={category} />
        </CardContent>
      </Card>
    </div>
  )
}

