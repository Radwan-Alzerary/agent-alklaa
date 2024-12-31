import { getInvoice } from "@/lib/api"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Printer } from 'lucide-react'

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = await getInvoice(params.id);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">تفاصيل الفاتورة</h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button asChild>
            <Link href={`/invoices/${invoice._id}/edit`}>تعديل الفاتورة</Link>
          </Button>
          <Button asChild>
            <Link href={`/invoices/${invoice._id}/print`}>
              <Printer className="mr-2 h-4 w-4" />
              عرض الفاتورة للطباعة
            </Link>
          </Button>
        </div>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>معلومات الفاتورة</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="font-semibold">رقم الفاتورة:</dt>
              <dd>{invoice.invoiceNumber}</dd>
            </div>
            <div>
              <dt className="font-semibold">معرف العميل:</dt>
              <dd>{invoice.customerId.name}</dd>
            </div>
            <div>
              <dt className="font-semibold">المبلغ:</dt>
              <dd>
                {new Intl.NumberFormat("ar-IQ", { style: "currency", currency: "IQD" }).format(invoice.totalAmount)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">الحالة:</dt>
              <dd>{invoice.status}</dd>
            </div>
            <div>
              <dt className="font-semibold">تاريخ الاستحقاق:</dt>
              <dd>{new Date(invoice.dueDate).toLocaleDateString("ar-IQ")}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>عناصر الفاتورة</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-right">الوصف</th>
                <th className="text-right">الكمية</th>
                <th className="text-right">سعر الوحدة</th>
                <th className="text-right">المجموع</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.productId.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    {new Intl.NumberFormat("ar-IQ", { style: "currency", currency: "IQD" }).format(item.price)}
                  </td>
                  <td>
                    {new Intl.NumberFormat("ar-IQ", { style: "currency", currency: "IQD" }).format(
                      item.quantity * item.price
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

