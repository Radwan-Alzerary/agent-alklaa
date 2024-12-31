"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@/lib/api"
import { DateRange } from "react-day-picker"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B6B', '#4ECDC4'];

interface ProductAnalyticsProps {
  products: Product[];
  dateRange?: DateRange | undefined;
  interval?: string;
}

export function ProductAnalytics({ products, dateRange, interval }: ProductAnalyticsProps) {
  // Here you would fetch and process data based on dateRange and interval
  const salesData = [
    { month: "يناير", sales: Math.floor(Math.random() * 10000) },
    { month: "فبراير", sales: Math.floor(Math.random() * 10000) },
    { month: "مارس", sales: Math.floor(Math.random() * 10000) },
    { month: "أبريل", sales: Math.floor(Math.random() * 10000) },
    { month: "مايو", sales: Math.floor(Math.random() * 10000) },
    { month: "يونيو", sales: Math.floor(Math.random() * 10000) },
  ];

  const categoryData = Array.isArray(products)
  ? products.reduce((acc, product) => {
      const existingCategory = acc.find(item => item.name === product.category);
      if (existingCategory) {
        existingCategory.value++;
      } else {
        acc.push({ name: product.category, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[])
  : [];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>مبيعات المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>توزيع الفئات</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
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

