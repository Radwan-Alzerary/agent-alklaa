"use client"

import { useState } from "react"
import { Debt, Customer } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { addDebtToCustomer, updateDebtForCustomer, removeDebtFromCustomer, repayDebt } from "@/lib/api"

interface CustomerDebtsListProps {
  customer: Customer
}

export function CustomerDebtsList({ customer }: CustomerDebtsListProps) {
  const [debts, setDebts] = useState<Debt[]>(customer.debts)
  const [isAddingDebt, setIsAddingDebt] = useState(false)
  const [isRepayingDebt, setIsRepayingDebt] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
  const [repaymentAmount, setRepaymentAmount] = useState<number>(0)
  const [newDebt, setNewDebt] = useState<Omit<Debt, "id">>({
    amount: 0,
    recipient: "",
    remainingAmount: 0,
    dueDate: "",
  })

  const handleAddDebt = async () => {
    const updatedCustomer = await addDebtToCustomer(customer.id, newDebt)
    if (updatedCustomer) {
      setDebts(updatedCustomer.debts)
      setIsAddingDebt(false)
      setNewDebt({ amount: 0, recipient: "", remainingAmount: 0, dueDate: "" })
    }
  }

  const handleUpdateDebt = async (debtId: string, updatedDebt: Partial<Debt>) => {
    const updatedCustomer = await updateDebtForCustomer(customer.id, debtId, updatedDebt)
    if (updatedCustomer) {
      setDebts(updatedCustomer.debts)
    }
  }

  const handleRemoveDebt = async (debtId: string) => {
    const updatedCustomer = await removeDebtFromCustomer(customer.id, debtId)
    if (updatedCustomer) {
      setDebts(updatedCustomer.debts)
    }
  }

  const handleRepayDebt = async () => {
    if (selectedDebt) {
      const updatedCustomer = await repayDebt(customer.id, selectedDebt.id, repaymentAmount)
      if (updatedCustomer) {
        setDebts(updatedCustomer.debts)
        setIsRepayingDebt(false)
        setSelectedDebt(null)
        setRepaymentAmount(0)
      }
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">ديون العميل</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المبلغ</TableHead>
            <TableHead>المستلم</TableHead>
            <TableHead>المبلغ المتبقي</TableHead>
            <TableHead>تاريخ الاستحقاق</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debts.map((debt) => (
            <TableRow key={debt.id}>
              <TableCell>{debt.amount} د.ع</TableCell>
              <TableCell>{debt.recipient}</TableCell>
              <TableCell>{debt.remainingAmount} د.ع</TableCell>
              <TableCell>{debt.dueDate}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => {
                    setSelectedDebt(debt)
                    setIsRepayingDebt(true)
                  }}
                >
                  سداد
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveDebt(debt.id)}
                >
                  حذف
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddingDebt} onOpenChange={setIsAddingDebt}>
        <DialogTrigger asChild>
          <Button className="mt-4">إضافة دين جديد</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة دين جديد</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                المبلغ
              </Label>
              <Input
                id="amount"
                type="number"
                className="col-span-3"
                value={newDebt.amount}
                onChange={(e) => setNewDebt({ ...newDebt, amount: parseFloat(e.target.value), remainingAmount: parseFloat(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient" className="text-right">
                المستلم
              </Label>
              <Input
                id="recipient"
                className="col-span-3"
                value={newDebt.recipient}
                onChange={(e) => setNewDebt({ ...newDebt, recipient: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                تاريخ الاستحقاق
              </Label>
              <Input
                id="dueDate"
                type="date"
                className="col-span-3"
                value={newDebt.dueDate}
                onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleAddDebt}>إضافة الدين</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isRepayingDebt} onOpenChange={setIsRepayingDebt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>سداد الدين</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="repaymentAmount" className="text-right">
                مبلغ السداد
              </Label>
              <Input
                id="repaymentAmount"
                type="number"
                className="col-span-3"
                value={repaymentAmount}
                onChange={(e) => setRepaymentAmount(parseFloat(e.target.value))}
                max={selectedDebt?.remainingAmount}
              />
            </div>
          </div>
          <Button onClick={handleRepayDebt}>سداد</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

