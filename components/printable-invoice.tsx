import React from 'react'
import { Invoice } from '@/types'

interface PrintableInvoiceProps {
  invoice: Invoice
}

export function PrintableInvoice({ invoice }: PrintableInvoiceProps) {
  return (
    <div className="p-8 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">فاتورة</h1>
      <div className="mb-6">
        <p><strong>رقم الفاتورة:</strong> {invoice.id}</p>
        <p><strong>معرف العميل:</strong> {invoice.customerId.name}</p>
        <p><strong>تاريخ الاستحقاق:</strong> {invoice.dueDate}</p>
      </div>
      <table className="w-full mb-6">
        <thead>
          <tr className="border-b">
            <th className="text-right py-2">الوصف</th>
            <th className="text-right py-2">الكمية</th>
            <th className="text-right py-2">سعر الوحدة</th>
            <th className="text-right py-2">المجموع</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{item.description}</td>
              <td className="py-2">{item.quantity}</td>
              <td className="py-2">{new Intl.NumberFormat("ar-IQ", { style: "currency", currency: "IQD" }).format(item.price)}</td>
              <td className="py-2">{new Intl.NumberFormat("ar-IQ", { style: "currency", currency: "IQD" }).format(item.quantity * item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right">
        <p className="text-xl font-bold">المبلغ الإجمالي: {new Intl.NumberFormat("ar-IQ", { style: "currency", currency: "IQD" }).format(invoice.totalAmount)}</p>
      </div>
    </div>
  )
}

