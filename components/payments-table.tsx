// src/pages/PaymentsTable.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Payment } from "@/types";
import { getPayments } from "@/lib/api";
import { DataTable, DataTableRef } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import html2pdf from 'html2pdf.js';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { arSA } from 'date-fns/locale';
import { subDays, addDays } from 'date-fns';

const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row: Payment) => 
      typeof row.customerId === 'object' && row.customerId !== null 
        ? row.customerId.name 
        : "",
    id: 'customerName',
    header: 'اسم العميل',
    enableSorting: true,
    cell: ({ getValue }) => getValue(),
    filterFn: 'includesString',
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("ar-IQ", {
        style: "currency",
        currency: "IQD",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "date",
    id:"date",
    header: "التاريخ",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleDateString("ar-IQ");
    },
  },
  {
    accessorFn: (row: Payment) =>
      typeof row.agentId === 'object' && row.agentId !== null 
        ? row.agentId.name 
        : "",
    id: 'agentName',
    header: 'الوكيل',
    enableSorting: true,
    cell: ({ getValue }) => getValue(),
    filterFn: 'includesString',
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment._id as string)}
            >
              نسخ رقم الدفعة
            </DropdownMenuItem>
            <DropdownMenuItem>عرض تفاصيل الدفعة</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef<DataTableRef<Payment>>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPaymentsData = async () => {
      setLoading(true);
      try {
        const fetchedPayments = await getPayments();
        setPayments(fetchedPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentsData();
  }, []);

  useEffect(() => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      const filtered = payments.filter(payment => {
        const paymentDate = new Date(payment.date).toISOString().split('T')[0];
        return paymentDate === formattedDate;
      });
      setFilteredPayments(filtered);
    } else {
      setFilteredPayments(payments);
    }
  }, [date, payments]);

  const handleDownloadPdf = async () => {
    const selectedRows = tableRef.current?.getSelectedRowModel().rows || [];

    if (selectedRows.length === 0) {
      alert("الرجاء تحديد دفعات لطباعتها.");
      return;
    }

    setIsGenerating(true);

    try {
      const totalAmount = selectedRows.reduce((sum, row) => {
        const amount = typeof row.original.amount === 'number' ? row.original.amount : parseFloat(row.original.amount as unknown as string);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      
      const formattedTotalAmount = new Intl.NumberFormat("ar-IQ", {
        style: "currency",
        currency: "IQD",
      }).format(totalAmount);

      const rowsHtml = selectedRows.map(row => {
        const payment = row.original;
        return `
          <tr>
            <td>${typeof payment.customerId === 'object' && payment.customerId !== null ? payment.customerId.name : payment.customerId || ""}</td>
            <td>${typeof payment.agentId === 'object' && payment.agentId !== null ? payment.agentId.name : payment.agentId || ""}</td>
            <td>${new Intl.NumberFormat("ar-IQ", {
              style: "currency",
              currency: "IQD",
          }).format(Number(payment.amount))}</td>
            <td>${new Date(payment.date).toLocaleDateString("ar-IQ")}</td>
          </tr>
        `;
      }).join('');

      const htmlContent = `
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Arial', sans-serif; direction: rtl; }
            h2, .total { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>تقرير الدفعات</h2>
          <table>
            <thead>
              <tr>
                <th>اسم العميل</th>
                <th>اسم الوكيل</th>
                <th>المبلغ</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div class="total">
            <strong>المجموع الكلي: ${formattedTotalAmount}</strong>
          </div>
        </body>
        </html>
      `;

      const opt = {
        margin:       2,
        filename:     'selected_payments.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().from(htmlContent).set(opt).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("حدث خطأ أثناء توليد ملف PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return <div>جارٍ التحميل...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handleDownloadPdf} className="ml-2" disabled={isGenerating}>
          {isGenerating ? "جارٍ توليد PDF..." : "تنزيل PDF المحدد"}
        </Button>
      </div>
      <DataTable
        ref={tableRef}
        columns={columns}
        data={filteredPayments}
        searchKey="customerId.name"
        enableRowSelection
      />
    </div>
  );
}
