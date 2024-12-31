import { PaymentsTable } from "@/components/payments-table"

export default function PaymentsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">سجل المدفوعات</h1>
      <PaymentsTable />
    </div>
  )
}

