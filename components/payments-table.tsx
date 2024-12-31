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

// Define the columns for the DataTable
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
  // {
  //   accessorKey: "id",
  //   header: "رقم الدفعة",
  // },
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
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  // Fetch payments on component mount
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

  // Update filtered payments based on date selection
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

  const handleFilterByToday = () => {
    const today = new Date();
    setDate(today);
  };

  const handleFilterByYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setDate(yesterday);
  };

  const handleClearFilter = () => {
    setDate(undefined);
  };

  const handleDayBack = () => {
    if (date) {
      setDate(subDays(date, 1));
    }
  };

  const handleDayNext = () => {
    if (date) {
      setDate(addDays(date, 1));
    }
  };

  // Handle PDF download for selected payments
  const handleDownloadPdf = async () => {
    const selectedRows = tableRef.current?.getSelectedRowModel().rows || [];

    if (selectedRows.length === 0) {
      alert("الرجاء تحديد دفعات لطباعتها.");
      return;
    }

    setIsGenerating(true);

    try {
      // Generate HTML content for the selected payments in a table format
      const htmlContent = `
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Arial', sans-serif; direction: rtl; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #f2f2f2; }
            .total-amount { font-weight: bold; }
          </style>
        </head>
        <body>
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
            </tbody>
          </table>
        </body>
        </html>
      `;

      const opt = {
        margin:       10,
        filename:     'selected_payments.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate and save the PDF
      await html2pdf().from(htmlContent).set(opt).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("حدث خطأ أثناء توليد ملف PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate total amount for filtered payments
  const totalAmount = filteredPayments.reduce((sum, payment) => {
    const amount = parseFloat(payment.amount as unknown as string); // Explicitly ensure amount is parsed
    return sum + (isNaN(amount) ? 0 : amount); // Handle cases where amount might not be a valid number
  }, 0);
    const formattedTotalAmount = new Intl.NumberFormat("ar-IQ", {
    style: "currency",
    currency: "IQD",
  }).format(totalAmount);

  if (loading) {
    return <div>جارٍ التحميل...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button onClick={handleDownloadPdf} className="ml-2" disabled={isGenerating}>
            {isGenerating ? "جارٍ توليد PDF..." : "تنزيل PDF المحدد"}
          </Button>
        </div>
        <div>
          <span>المجموع الكلي: </span>
          <span className="font-bold">{formattedTotalAmount}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button onClick={handleDayBack} variant="outline" disabled={!date}>
            اليوم السابق
          </Button>
          <Button onClick={handleFilterByToday} variant="outline">
            اليوم
          </Button>
          <Button onClick={handleFilterByYesterday} variant="outline">
            الأمس
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  'justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                {/* <Calendar className="mr-2 h-4 w-4" /> */}
                {date ? format(date, "PPP", { locale: arSA }) : <span>اختر التاريخ</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 hid" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={arSA}
                pagedNavigation
              />
            </PopoverContent>
          </Popover>
          {date && (
            <Button onClick={handleClearFilter} variant="outline" size="sm">
              مسح الفلتر
            </Button>
          )}
          <Button onClick={handleDayNext} variant="outline" disabled={!date}>
            اليوم التالي
          </Button>
        </div>
      </div>
      <DataTable
        ref={tableRef}
        columns={columns}
        data={filteredPayments}
        searchKey="customerId.name"
        enableRowSelection
        dateField="date"
      />
    </div>
  );
}