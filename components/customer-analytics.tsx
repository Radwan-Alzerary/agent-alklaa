"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRange } from "react-day-picker"

interface CustomerAnalyticsProps {
  dateRange?: DateRange | undefined
  interval?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function CustomerAnalytics({ dateRange, interval }: CustomerAnalyticsProps) {
  // Here you would fetch and process data based on dateRange and interval
  const customerGrowthData = [
    { month: "يناير", customers: 7500 },
    { month: "فبراير", customers: 8200 },
    { month: "مارس", customers: 8800 },
    { month: "أبريل", customers: 9300 },
    { month: "مايو", customers: 9800 },
    { month: "يونيو", customers: 10245 },
  ]

  const customerSegmentationData = [
    { name: "عادي", value: 6147 },
    { name: "فضي", value: 2561 },
    { name: "ذهبي", value: 1230 },
    { name: "بلاتيني", value: 307 },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>نمو العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={customerGrowthData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="customers" stroke="#8884d8" name="عدد العملاء" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>تقسيم العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={customerSegmentationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {customerSegmentationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

