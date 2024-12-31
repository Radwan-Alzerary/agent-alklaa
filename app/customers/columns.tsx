"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { deleteCustomer } from "@/lib/api"
import { Customer } from "@/types"


export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    id: 'customerName',
    enableSorting: true,
    cell: ({ getValue }) => getValue(),
    filterFn: 'includesString',

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الاسم
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
  },
  {
    accessorKey: "category",
    header: "الفئة",
  },
  {
    accessorKey: "assignedAgent.name",
    id: 'agentName',

    header: "الوكيل المعين",
  },
  {
    accessorKey: "assignedAgent.name",
    id: 'agentName',
    header: 'الوكيل',
    enableSorting: true,
    cell: ({ getValue }) => getValue(),
    filterFn: 'includesString',
  },
  {
    accessorKey: "address",
    header: "العنوان",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original

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
              onClick={() => navigator.clipboard.writeText(customer.id)}
            >
              نسخ معرف العميل
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/customers/${customer._id}`}>عرض العميل</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/customers/${customer._id}/edit`}>تعديل العميل</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteCustomer(customer._id)}
              className="text-red-600"
            >
              حذف العميل
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

