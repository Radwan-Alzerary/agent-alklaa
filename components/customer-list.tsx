"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { columns } from "@/app/customers/columns"
import { getCustomers } from "@/lib/api"
import { Customer } from "@/app/customers/columns"

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const fetchedCustomers = await getCustomers()
        setCustomers(fetchedCustomers)
      } catch (error) {
        console.error("Failed to fetch customers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  if (isLoading) {
    return <div>جاري التحميل...</div>
  }

  return <DataTable columns={columns} data={customers} searchKey="name" />
}

