import { getCustomers, getAgent } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentForm } from "@/components/payment-form"

export default async function NewPaymentPage() {
  const customers = await getCustomers()
  const agentId = ""
  // For now, we'll use a hardcoded agent ID. In a real application, you'd get this from the authenticated user's session.
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">تسجيل دفعة جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentForm customers={customers} agentId={agentId} />
        </CardContent>
      </Card>
    </div>
  )

}

