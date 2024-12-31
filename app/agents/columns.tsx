"use client";
import React, { useState } from "react"; // Import useState from React

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { deleteAgent } from "@/lib/api";
import { Toast } from "@/components/ui/toast"; // Assuming this is a notification component
import { Agent } from "@/types";


export const columns: ColumnDef<Agent>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        الاسم
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
  },
  {
    accessorKey: "role",
    header: "الدور",
  },
  {
    accessorKey: "assignedCustomers",
    header: "العملاء المعينون",
  },
  {
    accessorKey: "totalSales",
    header: "إجمالي المبيعات",
    cell: ({ row }) => {
      const totalSales = row.original.totalSales;
      return `₪${totalSales.toLocaleString()}`;
    },
  },
  {
    accessorKey: "averageRating",
    header: "التقييم المتوسط",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const agent = row.original;

      return <ActionMenu agent={agent} />;
    },
  },
];

type ActionMenuProps = {
  agent: Agent;
};

function ActionMenu({ agent }: ActionMenuProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا الوكيل؟")) return;
    setIsDeleting(true);
    try {
      await deleteAgent(id);
      // Toast({ title: "تم الحذف بنجاح", status: "success" }); // Show success toast
    } catch (error) {
      console.error(error);
      // Toast({ title: "حدث خطأ أثناء الحذف", status: "error" }); // Show error toast
    } finally {
      setIsDeleting(false);
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
          onClick={() => navigator.clipboard.writeText(agent._id as string)}
        >
          نسخ معرف الوكيل
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/agents/${agent._id}`}>عرض الوكيل</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/agents/${agent._id}/edit`}>تعديل الوكيل</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDelete(agent._id as string)}
          className={`text-red-600 ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
        >
          {isDeleting ? "جاري الحذف..." : "حذف الوكيل"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
