import { InvoiceForm } from "@/components/invoice-form"
import { getInvoice } from "@/lib/api"

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const invoice = await getInvoice(params.id)

  if (!invoice) {
    return <div>الفاتورة غير موجودة</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">تعديل الفاتورة</h1>
      <InvoiceForm invoice={invoice} />
    </div>
  )
}

