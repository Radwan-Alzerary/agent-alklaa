import { getProduct } from "@/lib/api"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductAnalytics } from "@/components/product-analytics"

export default async function ProductAnalysisPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">تحليل المنتج: {product.name}</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>معلومات المنتج</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>الاسم:</strong> {product.name}</p>
          <p><strong>الفئة:</strong> {product.category}</p>
          <p><strong>السعر:</strong> {product.price} ر.س</p>
          <p><strong>المخزون:</strong> {product.stock}</p>
          <p><strong>الحالة:</strong> {product.status}</p>
        </CardContent>
      </Card>
      <ProductAnalytics products={[product]} />
    </div>
  )
}

