"use client"

import { useState, useEffect } from "react"
import { getAgent } from "@/lib/api"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Pencil, Trash } from 'lucide-react'
import { deleteAgent as deleteAgentAction } from "@/lib/api"

export default function AgentProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [agent, setAgent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAgent() {
      console.log("Rendering agent profile page for ID:", params.id);
      try {
        const fetchedAgent = await getAgent(params.id)
        if (fetchedAgent) {
          setAgent(fetchedAgent)
        } else {
          console.log("Agent not found, returning 404")
          notFound()
        }
      } catch (error) {
        console.error("Error fetching agent:", error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgent()
  }, [params.id])

  const handleDeleteAgent = async () => {
    try {
      await deleteAgentAction(params.id)
      router.push("/agents")
    } catch (error) {
      console.error("Error deleting agent:", error)
      // You might want to show an error message to the user here
    }
  }

  if (isLoading) {
    return <div>جاري التحميل...</div>
  }

  if (!agent) {
    return null // This should not happen as we're calling notFound() if agent is not found
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ملف الوكيل</h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button asChild variant="outline">
            <Link href={`/agents/${agent._id}/edit`}>
              <Pencil className="w-4 h-4 mr-2" />
              تعديل الوكيل
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAgent}
          >
            <Trash className="w-4 h-4 mr-2" />
            حذف الوكيل
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="font-semibold">الاسم:</dt>
              <dd>{agent.name}</dd>
            </div>
            <div>
              <dt className="font-semibold">البريد الإلكتروني:</dt>
              <dd>{agent.email}</dd>
            </div>
            <div>
              <dt className="font-semibold">رقم الهاتف:</dt>
              <dd>{agent.phone}</dd>
            </div>
            <div>
              <dt className="font-semibold">العملاء المعينون:</dt>
              <dd>{agent.assignedCustomers}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <div className="mt-6">
        <Button asChild>
          <Link href={`/agents/${agent._id}/analytics`}>عرض تحليلات الوكيل</Link>
        </Button>
      </div>
    </div>
  )
}

