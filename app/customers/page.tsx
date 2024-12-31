import { Suspense } from "react"
import { Plus } from 'lucide-react'
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { columns } from "./columns"
import Link from "next/link"
import CustomerList from "@/components/customer-list"

export default function CustomersPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة العملاء</h1>
        <Button asChild>
          <Link href="/customers/new">
            <Plus className="ml-2 h-4 w-4" /> إضافة عميل
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <CustomerList />
      </Suspense>
    </div>
  )
}

