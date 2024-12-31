"use client"

import { useState } from "react"
import { Plus } from 'lucide-react'
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { CategoryModal } from "@/components/category-modal"
import { columns } from "./columns"

const data = [
  {
    id: "728ed52f",
    name: "Electronics",
    type: "Product",
    itemsAssigned: 150,
  },
  {
    id: "489e1d42",
    name: "VIP",
    type: "Customer",
    itemsAssigned: 50,
  },
  // Add more sample data as needed
]

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" />
      <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

