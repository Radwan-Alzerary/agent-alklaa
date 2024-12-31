"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/app/invoices/columns";
import { getInvoices, Invoice } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const fetchedInvoices = await getInvoices();
        setInvoices(fetchedInvoices);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  const handleRowClick = (invoice: Invoice) => {
    router.push(`/invoices/${invoice._id}`);
  };

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={invoices}
      searchKey="invoiceNumber" // Changed from "id" to "invoiceNumber"
      onRowClick={handleRowClick}
    />
  );
}
