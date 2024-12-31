import { AgentAnalyticsDetail } from "@/components/agent-analytics-detail"
import { getAgent } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function AgentAnalyticsPage({ params }: { params: { id: string } }) {
  const agent = await getAgent(params.id)

  if (!agent) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">تحليلات الوكيل: {agent.name}</h1>
      {/* <AgentAnalyticsDetail agent={agent} /> */}
    </div>
  )
}

