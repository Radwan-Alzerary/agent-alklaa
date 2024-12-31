
// invoice-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomProductSearch } from "./custom-product-search";
import { createInvoice, updateInvoice } from "@/lib/api";
import { Customer, Product, Invoice, InvoiceItem } from "./types";
import { getProducts, getCustomers } from "@/lib/api";

interface InvoiceFormProps {
  invoice?: Invoice;
}

export function InvoiceForm({ invoice }: InvoiceFormProps) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // State variables aligned with schema fields
  const [customerId, setCustomerId] = useState(invoice?.customerId || "");
  const [agentId, setAgentId] = useState(invoice?.agentId || ""); // Example: logged-in agent
  const [date, setDate] = useState(invoice?.date || new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(invoice?.dueDate || "");
  const [status, setStatus] = useState<'مدفوعة' | 'معلقة' | 'متأخرة'>(invoice?.status || 'معلقة');
  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || [{ productId: "", quantity: 1, price: 0 }]);
  const [totalAmount, setTotalAmount] = useState(invoice?.totalAmount?.toString() || "0");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedCustomers, fetchedProducts] = await Promise.all([
        getCustomers(),
        getProducts()
      ]);
      setCustomers(fetchedCustomers);
      setProducts(fetchedProducts);
    };
    fetchData();
  }, []);



  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceData = {
      customerId,
      agentId,
      date,
      dueDate,
      items,
      totalAmount: parseFloat(totalAmount),
      status,
      location,
    };

    try {
      if (invoice?._id) {
        await updateInvoice(invoice._id, invoiceData);
      } else {
        await createInvoice(invoiceData);
      }
      router.push("/invoices");
      router.refresh();
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  const handleProductSelect = (product: Product, index: number) => {
    console.log(product)
    const newItems = [...items];
    newItems[index] = {
      productId: product._id,
      quantity: 1,
      price: product.price,
      name: product.name,
    };
    setItems(newItems);
    updateTotalAmount(newItems);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: number | string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    updateTotalAmount(newItems);
  };

  const updateTotalAmount = (items: InvoiceItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setTotalAmount(total.toString());
  };

  const addItem = () => {
  console.log(items)
    setItems([...items, { productId: "", quantity: 1, price: 0 }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="customerId">العميل</Label>
        <Select onValueChange={setCustomerId} value={customerId}>
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

      <div className="space-y-2">
        <Label htmlFor="date">التاريخ</Label>
        <Input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
        <Input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">الحالة</Label>
        <Select onValueChange={setStatus} value={status}>
          <SelectTrigger>
            <SelectValue placeholder="اختر الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="مدفوعة">مدفوعة</SelectItem>
            <SelectItem value="معلقة">معلقة</SelectItem>
            <SelectItem value="متأخرة">متأخرة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>العناصر</Label>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded">
            <div>
              <Label>المنتج</Label>
              <CustomProductSearch
                products={products}
                onSelect={(product) => handleProductSelect(product, index)}
                placeholder="ابحث عن منتج"
              />
            </div>
            <div>
              <Label>الكمية</Label>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                required
              />
            </div>
            <div className="text-sm text-gray-500">
              اسم المنتج: {item.name}
            </div>
          </div>
        ))}
        <Button type="button" onClick={addItem} variant="outline" className="w-full">
          إضافة عنصر
        </Button>
      </div>

      <div className="space-y-2 hidden">
        <Label htmlFor="totalAmount">المبلغ الإجمالي</Label>
        <Input
          id="totalAmount"
          value={totalAmount}
          readOnly
          className="bg-gray-50"
        />
      </div>

      <Button type="submit" className="w-full">
        {invoice ? "تحديث الفاتورة" : "إنشاء الفاتورة"}
      </Button>
    </form>
  );
}
