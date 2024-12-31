import { CustomerForm } from "@/components/customer-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewCustomerPage() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">إضافة عميل جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerForm />
        </CardContent>
      </Card>
    </div>
  )
}

