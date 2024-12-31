import { AgentForm } from "@/components/agent-form"
import { getAgent } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EditAgentPage({ params }: { params: { id: string } }) {
  const agent = await getAgent(params.id)

  if (!agent) {
    return <div>الوكيل غير موجود</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">تعديل الوكيل</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentForm agent={agent} />
        </CardContent>
      </Card>
    </div>
  )
}

