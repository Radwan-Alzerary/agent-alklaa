import { AgentForm } from "@/components/agent-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewAgentPage() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">إضافة وكيل جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentForm />
        </CardContent>
      </Card>
    </div>
  )
}

