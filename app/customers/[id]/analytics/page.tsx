import { CustomerAnalyticsDetail } from "@/components/customer-analytics-detail"
import { getCustomer } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function CustomerAnalyticsPage({ params }: { params: { id: string } }) {
  const customer = await getCustomer(params.id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">تحليلات العميل: {customer.name}</h1>
      <CustomerAnalyticsDetail customer={customer} />
    </div>
  )
}

