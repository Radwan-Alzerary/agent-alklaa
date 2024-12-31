import { getProductCategory } from "@/lib/api"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function ProductCategoryDetailPage({ params }: { params: { id: string } }) {
  const category = await getProductCategory(params.id)

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">تفاصيل فئة المنتج</h1>
        <Button asChild>
          <Link href={`/product-categories/${category.id}/edit`}>تعديل الفئة</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>معلومات الفئة</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="font-semibold">الاسم:</dt>
              <dd>{category.name}</dd>
            </div>
            <div>
              <dt className="font-semibold">الوصف:</dt>
              <dd>{category.description}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

