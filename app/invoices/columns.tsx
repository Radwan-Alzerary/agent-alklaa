// src/app/invoices/columns.tsx

import React from 'react'; // Removed useRef
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { deleteInvoice } from '@/lib/api';
import { Invoice } from '@/types';
import { Toast } from '@/components/ui/toast';
import InvoiceTemplate from '@/components/InvoiceTemplate';
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom';

export const columns: ColumnDef<Invoice>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
        onClick={(e) => e.stopPropagation()} // Prevent row click
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
        onClick={(e) => e.stopPropagation()} // Prevent row click
      />
    ),
  },
  {
    accessorKey: 'invoiceNumber',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        رقم الفاتورة
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.customerId?.name||"",
    id: 'customerName', // Unique ID
    header: 'اسم العميل',
    enableSorting: true,
    cell: ({ getValue }) => getValue(),
    filterFn: 'includesString', // Use a default filter function
  },
  {
    accessorFn: (row) => row.agentId?.name || "",
    id: 'agentName', // Unique ID
    header: 'الوكيل',
    enableSorting: true,
    cell: ({ getValue }) => getValue(),
    filterFn: 'includesString', // Use a default filter function
  },
  {
    accessorFn: (row) => row.date,
    id: 'date', // Unique ID
    header: 'تاريخ الاضافة',
    enableSorting: true,
    cell: ({ getValue }) => getValue(),
    filterFn: 'includesString', // Use a default filter function
  },

  // {
  //   accessorKey: 'totalAmount',
  //   header: 'المبلغ',
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue('totalAmount'));
  //     const formatted = new Intl.NumberFormat('ar-IQ', {
  //       style: 'currency',
  //       currency: 'IQD',
  //     }).format(amount);
  //     return <div className="font-medium">{formatted}</div>;
  //   },
  //   enableSorting: true,
  // },
  {
    accessorKey: 'status',
    header: 'الحالة',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div
          className={`font-medium ${
            status === 'مدفوعة'
              ? 'text-green-600'
              : status === 'معلقة'
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}
        >
          {status}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    header: 'إجراءات',
    cell: ({ row }) => {
      const invoice = row.original;

      const handlePrint = async () => {
        try {
          // Create a hidden container for the invoice template
          const container = document.createElement('div');
          container.style.display = 'none';
          document.body.appendChild(container);

          // Render the InvoiceTemplate into the container
          // ReactDOM.render(<InvoiceTemplate invoice={invoice} />, container);

          // Define PDF options
          const opt = {
            margin:       10,
            filename:     `invoice-${invoice.invoiceNumber}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
          };

          // Generate PDF from the container's content
          await html2pdf().set(opt).from(container).save();

          // Clean up by removing the container
          ReactDOM.unmountComponentAtNode(container);
          document.body.removeChild(container);

          // toast.success('تم طباعة الفاتورة بنجاح!');
        } catch (error) {
          console.error('Error printing invoice:', error);
          // toast.error('حدث خطأ أثناء طباعة الفاتورة.');
        }
      };

      const handleDelete = async () => {
        if (confirm('هل أنت متأكد أنك تريد حذف هذه الفاتورة؟')) {
          try {
            await deleteInvoice(invoice._id as string);
            // toast.success('تم حذف الفاتورة بنجاح!');
            // Optionally, trigger a re-fetch or update state here
          } catch (error) {
            console.error('Failed to delete invoice:', error);
            // toast.error('حدث خطأ أثناء حذف الفاتورة.');
          }
        }
      };

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
              onClick={handlePrint}
              className="text-blue-600 flex items-center"
            >
              <Printer className="ml-2 h-4 w-4" />
              طباعة الفاتورة
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/invoices/${invoice._id}`}>عرض الفاتورة</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/invoices/${invoice._id}/edit`}>تعديل الفاتورة</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 flex items-center"
            >
              حذف الفاتورة
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
