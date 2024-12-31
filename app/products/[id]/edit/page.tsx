import { ProductForm } from "@/components/product-form"
import { getProduct } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    return <div>المنتج غير موجود</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">تعديل المنتج</CardTitle>
        </CardHeader>
        <CardContent>
        <ProductForm product={{ ...product, category: product.category || "" }} />
        </CardContent>
      </Card>
    </div>
  )
}

