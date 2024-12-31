"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRange } from "react-day-picker"

interface AgentAnalyticsProps {
  dateRange?: DateRange | undefined
  interval?: string
}

export function AgentAnalytics({ dateRange, interval }: AgentAnalyticsProps) {
  // Here you would fetch and process data based on dateRange and interval
  const agentPerformanceData = [
    { name: "أحمد", sales: 120, customers: 45, rating: 4.8 },
    { name: "فاطمة", sales: 98, customers: 39, rating: 4.6 },
    { name: "محمد", sales: 86, customers: 30, rating: 4.3 },
    { name: "زينب", sales: 99, customers: 41, rating: 4.7 },
    { name: "علي", sales: 85, customers: 32, rating: 4.4 },
  ]

  const agentActivityData = [
    { name: "الأحد", activeAgents: 180 },
    { name: "الإثنين", activeAgents: 200 },
    { name: "الثلاثاء", activeAgents: 210 },
    { name: "الأربعاء", activeAgents: 190 },
    { name: "الخميس", activeAgents: 205 },
    { name: "الجمعة", activeAgents: 185 },
    { name: "السبت", activeAgents: 170 },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>أداء الوكلاء الأعلى</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={agentPerformanceData}>
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="sales" fill="#8884d8" name="المبيعات" />
              <Bar yAxisId="right" dataKey="customers" fill="#82ca9d" name="العملاء" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>نشاط الوكلاء الأسبوعي</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={agentActivityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="activeAgents" fill="#fbbf24" name="الوكلاء النشطون" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

