import { getCustomerProfile } from "@/lib/api"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CustomerDebtsList } from "@/components/customer-debts-list"

export default async function CustomerProfilePage({ params }: { params: { id: string } }) {
  const customer = await getCustomerProfile(params.id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ملف العميل</h1>
        <div className="flex">
          <Button asChild className="mr-2">
            <Link href={`/customers/${customer._id}/statement`}>عرض كشف الحساب</Link>
          </Button>
          <Button asChild>
            <Link href={`/customers/${customer._id}/edit`}>تعديل العميل</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">الاسم:</dt>
                <dd>{customer.name}</dd>
              </div>
              {/* <div>
                <dt className="font-semibold">البريد الإلكتروني:</dt>
                <dd>{customer.email}</dd>
              </div> */}
              <div>
                <dt className="font-semibold">رقم الهاتف:</dt>
                <dd>{customer.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold">الفئة:</dt>
                <dd>{customer.category}</dd>
              </div>
              <div>
                <dt className="font-semibold">الوكيل المعين:</dt>
                {typeof customer.assignedAgent === "object" && customer.assignedAgent?.name 
                ? customer.assignedAgent.name 
                : "No agent assigned"}
              </div>
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>معلومات العنوان</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">العنوان:</dt>
                <dd>{customer.address}</dd>
              </div>
              <div>
                <dt className="font-semibold">أقرب معلم:</dt>
                <dd>{customer.nearestPlace}</dd>
              </div>
              <div>
                <dt className="font-semibold">الموقع:</dt>
                <dd>خط العرض: {customer.location?.lat}, خط الطول: {customer.location?.lng}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>معلومات إضافية</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">تاريخ التسجيل:</dt>
                <dd>{customer.registrationDate}</dd>
              </div>
              <div>
                <dt className="font-semibold">تاريخ آخر شراء:</dt>
                <dd>{customer.lastPurchaseDate}</dd>
              </div>
              <div>
                <dt className="font-semibold">إجمالي المشتريات:</dt>
                <dd>{customer.totalPurchases}</dd>
              </div>
              <div>
                <dt className="font-semibold">نقاط الولاء:</dt>
                <dd>{customer.loyaltyPoints}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <CustomerDebtsList customer={customer} />
      </div>
    </div>
  )
}

