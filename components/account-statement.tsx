"use client"

import { useState, useEffect } from "react"
import { Payment, Customer } from "@/lib/api"
import { getCustomerPayments, getCustomerBalance } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AccountStatementProps {
  customer: Customer
}

export function AccountStatement({ customer }: AccountStatementProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPayments = await getCustomerPayments(customer.id)
      const fetchedBalance = await getCustomerBalance(customer.id)
      setPayments(fetchedPayments)
      setBalance(fetchedBalance)
    }
    fetchData()
  }, [customer.id])

  return (
    <Card>
      <CardHeader>
        <CardTitle>كشف حساب العميل: {customer.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <strong>الرصيد الحالي:</strong> {balance.toFixed(2)} د.ع
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>التاريخ</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>معرف الوكيل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{new Date(payment.date).toLocaleDateString('ar-IQ')}</TableCell>
                <TableCell>{payment.amount.toFixed(2)} د.ع</TableCell>
                <TableCell>{payment.agentId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

