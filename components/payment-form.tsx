"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { addPayment } from "@/lib/api"
import { Customer } from "@/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PaymentFormProps {
  customers: Customer[]
  agentId: string
}

export function PaymentForm({ customers, agentId }: PaymentFormProps) {
  const router = useRouter()
  const [customerId, setCustomerId] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await addPayment({
        customerId,
        amount: parseFloat(amount),
        date: new Date().toISOString(),
        agentId,
      })
      toast({
        title: "تم تسجيل الدفعة بنجاح",
        description: `تم إضافة ${amount} د.ع إلى حساب العميل`,
      })
      router.refresh()
      setCustomerId("")
      setAmount("")
    } catch (error) {
      console.error("Error submitting payment:", error)
      toast({
        title: "خطأ في تسجيل الدفعة",
        description: "حدث خطأ أثناء تسجيل الدفعة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="customerId">العميل</Label>
        <Select value={customerId} onValueChange={setCustomerId}>
          <SelectTrigger>
            <SelectValue placeholder="اختر العميل" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer._id} value={customer._id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
      </div>
      <div>
        <Label htmlFor="amount">المبلغ (د.ع)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          // min="0"
          // step="0.01"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "جاري التسجيل..." : "تسجيل الدفعة"}
      </Button>
    </form>
  )
}

