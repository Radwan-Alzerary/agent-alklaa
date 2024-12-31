"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeSelector } from "@/components/date-range-selector";
import { DashboardOverview } from "@/components/dashboard-overview";
import { AgentAnalytics } from "@/components/agent-analytics";
import { CustomerAnalytics } from "@/components/customer-analytics";
import { ProductAnalytics } from "@/components/product-analytics";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getProducts, getAgents, getCustomers, getInvoices } from "@/lib/api";
import {Product} from "@/types"
export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [interval, setInterval] = useState<string>("month");
  const [products, setProducts] = useState<Product[]>([]);
  const [agentsCount, setAgentsCount] = useState<number>(0);
  const [customersCount, setCustomersCount] = useState<number>(0);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [salesData, setSalesData] = useState<Array<{ name: string; sales: number }>>([]);

  const fetchDashboardData = async () => {
    try {
      const [fetchedProducts, fetchedAgents, fetchedCustomers, fetchedInvoices] = await Promise.all([
        getProducts(),
        getAgents(),
        getCustomers(),
        getInvoices(),
      ]);

      setProducts(fetchedProducts);
      setAgentsCount(fetchedAgents.length);
      setCustomersCount(fetchedCustomers.length);

      // Calculate total sales and sales data
      const totalSalesAmount = fetchedInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
      setTotalSales(totalSalesAmount);

      // Mock sales data (replace with dynamic aggregation if needed)
      const monthlySales = fetchedInvoices.reduce((acc, invoice) => {
        const month = new Date(invoice.date).toLocaleString("ar", { month: "long" });
        acc[month] = (acc[month] || 0) + invoice.totalAmount;
        return acc;
      }, {} as Record<string, number>);

      const formattedSalesData = Object.keys(monthlySales).map((month) => ({
        name: month,
        sales: monthlySales[month],
      }));

      setSalesData(formattedSalesData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, interval]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>

      <div className="mb-6">
        <DateRangeSelector onRangeChange={setDateRange} onIntervalChange={setInterval} />
      </div>

      <DashboardOverview
        totalAgents={agentsCount}
        totalCustomers={customersCount}
        totalProducts={products.length}
        totalSales={totalSales}
      />

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>المبيعات عبر الزمن</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">تحليلات الوكلاء</h2>
        <AgentAnalytics dateRange={dateRange} interval={interval} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">تحليلات العملاء</h2>
        <CustomerAnalytics dateRange={dateRange} interval={interval} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">تحليلات المنتجات</h2>
        <ProductAnalytics products={products} dateRange={dateRange} interval={interval} />
      </div>
    </div>
  );
}
