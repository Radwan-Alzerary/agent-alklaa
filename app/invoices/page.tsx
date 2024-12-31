import { Suspense } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import InvoiceList from "@/components/invoice-list"

export default function InvoicesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة الفواتير</h1>
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="ml-2 h-4 w-4" /> إضافة فاتورة
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <InvoiceList />
      </Suspense>
    </div>
  )
}

