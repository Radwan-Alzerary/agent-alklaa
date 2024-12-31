import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface AgentAnalyticsDetailProps {
  agent: {
    id: string;
    name: string;
    email: string;
    phone: string;
    assignedCustomers: number;
    totalSales: number;
    averageRating: number;
  }
}

export function AgentAnalyticsDetail({ agent }: AgentAnalyticsDetailProps) {
  const performanceData = [
    { name: "المبيعات", value: agent.totalSales || 0 },
    { name: "العملاء", value: agent.assignedCustomers },
    { name: "التقييم", value: (agent.averageRating || 0) * 20 }, // Multiply by 20 to make it comparable on the chart
  ];

  const salesData = [
    { month: "يناير", sales: Math.floor(Math.random() * 10000) },
    { month: "فبراير", sales: Math.floor(Math.random() * 10000) },
    { month: "مارس", sales: Math.floor(Math.random() * 10000) },
    { month: "أبريل", sales: Math.floor(Math.random() * 10000) },
    { month: "مايو", sales: Math.floor(Math.random() * 10000) },
    { month: "يونيو", sales: Math.floor(Math.random() * 10000) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>أداء الوكيل</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>توزيع المبيعات</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>المبيعات الشهرية</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

