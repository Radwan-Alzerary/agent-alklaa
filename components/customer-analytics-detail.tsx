"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer } from "@/types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface CustomerAnalyticsDetailProps {
  customer: Customer;
}

export function CustomerAnalyticsDetail({ customer }: CustomerAnalyticsDetailProps) {
  // Simulated purchase history data
  const purchaseHistory = [
    { month: "يناير", purchases: Math.floor(Math.random() * 1000) },
    { month: "فبراير", purchases: Math.floor(Math.random() * 1000) },
    { month: "مارس", purchases: Math.floor(Math.random() * 1000) },
    { month: "أبريل", purchases: Math.floor(Math.random() * 1000) },
    { month: "مايو", purchases: Math.floor(Math.random() * 1000) },
    { month: "يونيو", purchases: Math.floor(Math.random() * 1000) },
  ];

  // Customer value data for the pie chart
  const customerValue = [
    { name: "المشتريات", value: customer.totalPurchases || 0 },
    { name: "نقاط الولاء", value: customer.loyaltyPoints || 0 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Purchase History */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>سجل المشتريات</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={purchaseHistory}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="purchases" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Value */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>قيمة العميل</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerValue}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {customerValue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>معلومات العميل</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-semibold">الاسم:</dt>
              <dd>{customer.name}</dd>
            </div>
            <div>
              <dt className="font-semibold">رقم الهاتف:</dt>
              <dd>{customer.phone}</dd>
            </div>
            <div>
              <dt className="font-semibold">إجمالي المشتريات:</dt>
              <dd>{customer.totalPurchases}</dd>
            </div>
            <div>
              <dt className="font-semibold">نقاط الولاء:</dt>
              <dd>{customer.loyaltyPoints}</dd>
            </div>
            <div>
              <dt className="font-semibold">تاريخ آخر شراء:</dt>
              <dd>{customer.lastPurchaseDate}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
