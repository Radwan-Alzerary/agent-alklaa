import { getProduct } from "@/lib/api"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default async function ProductProfilePage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">تفاصيل المنتج</h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button asChild variant="outline">
            <Link href={`/products/${product.id}/edit`}>
              تعديل المنتج
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/products/${product.id}/analysis`}>
              تحليل المنتج
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>معلومات المنتج</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">الاسم:</dt>
                <dd>{product.name}</dd>
              </div>
              <div>
                <dt className="font-semibold">الفئة:</dt>
                <dd>{product.category}</dd>
              </div>
              <div>
                <dt className="font-semibold">السعر:</dt>
                <dd>{product.price} د.ع</dd>
              </div>
              <div>
                <dt className="font-semibold">المخزون:</dt>
                <dd>{product.stock}</dd>
              </div>
              <div>
                <dt className="font-semibold">الحالة:</dt>
                <dd>{product.status}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

