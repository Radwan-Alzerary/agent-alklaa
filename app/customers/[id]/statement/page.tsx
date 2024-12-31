import { getCustomer } from "@/lib/api"
import { notFound } from "next/navigation"
import { AccountStatement } from "@/components/account-statement"

export default async function CustomerStatementPage({ params }: { params: { id: string } }) {
  const customer = await getCustomer(params.id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">كشف حساب العميل</h1>
      <AccountStatement customer={customer} />
    </div>
  )
}

