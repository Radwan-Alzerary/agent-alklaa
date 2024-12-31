
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
import { Customer, Product, Invoice,Agent, InvoiceItem } from "@/types";
import { getProducts, getCustomers } from "@/lib/api";

interface InvoiceFormProps {
  invoice?: Invoice;
}

export function InvoiceForm({ invoice }: InvoiceFormProps) {
  const router = useRouter();


  const translateStatus = (status: string): 'مدفوعة' | 'معلقة' | 'متأخرة' => {
    switch (status) {
      case 'paid':
        return 'مدفوعة';
      case 'pending':
        return 'معلقة';
      case 'overdue':
        return 'متأخرة';
      default:
        return 'معلقة'; // Default to 'معلقة' if the status is unknown
    }
  };
  



  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // State variables aligned with schema fields
  const [customerId, setCustomerId] = useState<string>(invoice?.customerId?._id || "");
  const [agentId, setAgentId] = useState<Agent | undefined>(invoice?.agentId || undefined);

  const [date, setDate] = useState(invoice?.date || new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(invoice?.dueDate || "");
  const [status, setStatus] = useState<'مدفوعة' | 'معلقة' | 'متأخرة'>(
    translateStatus(invoice?.status || 'معلقة')

  );  
  
  const [items, setItems] = useState<
  { description: string; productId: Product; name: string; quantity: number; price: number; }[]
>(
  (invoice?.items || []).map((item) => ({
    ...item,
    productId: item.productId  || defaultProduct, // Fallback to defaultProduct if productId is undefined
  }))
);
  
    
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
  
    const translateStatusToEnglish = (status: 'مدفوعة' | 'معلقة' | 'متأخرة'): 'paid' | 'pending' | 'overdue' => {
      switch (status) {
        case 'مدفوعة':
          return 'paid';
        case 'معلقة':
          return 'pending';
        case 'متأخرة':
          return 'overdue';
        default:
          return 'pending'; // Default to 'pending' if the status is unknown
      }
    };
    const generateInvoiceNumber = (): string => {
      const now = new Date();
      return `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${Math.floor(Math.random() * 10000)}`;
    };
    
    const invoiceData: Omit<Invoice, "_id"> = {
      customerId: customers.find((customer) => customer._id === customerId) as Customer, // Find the full Customer object
      agentId, // Ensure agentId is always of type Agent
      date,
      dueDate,
      items: items.map(({ description, productId, quantity, price }) => ({
        description,
        productId,
        quantity,
        price,
        name: productId.name, // Assuming `name` exists in `Product`
      })),
      totalAmount: parseFloat(totalAmount),
      status: translateStatusToEnglish(status), // Map Arabic status to English
      location,
      invoiceNumber: invoice?.invoiceNumber || generateInvoiceNumber(), // Use existing or generate a new number
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
    console.log(index)
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      name:product.name,
      description: product.name, // Use the product's name as the description
      productId: product,
      quantity: 1,
      price: product.price,
    };
    setItems(newItems);
    updateTotalAmount(newItems);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: number | string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
  
    // Optionally validate that `name` is preserved
    if (!newItems[index].name) {
      newItems[index].name = items[index].name; // Retain the original name
    }
  
    setItems(newItems);
    updateTotalAmount(newItems);
  };
    
  const updateTotalAmount = (items: InvoiceItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setTotalAmount(total.toString());
  };
  const defaultProduct: Product = {
    id: "default-id", // Default ID
    name: "Default Product", // Default name
    price: 0, // Default price
    stock: 0, // Default stock
    category: "Uncategorized", // Default category
    status: "Inactive", // Default status
    description: "Default product description", // Default description
    image: "", // Default image URL or base64 string
    barcode: "0000000000", // Default barcode
  };
      
  const addItem = () => {
    setItems([
      ...items,
      {
        productId: defaultProduct, // Provide a default Product object
        name: "New Item", // Default name for a new item
        description: "Description for new item", // Default description
        quantity: 1, // Default quantity
        price: 0, // Default price
      },
    ]);
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
              <SelectItem key={customer._id} value={customer._id as string}>
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
        <Select
  onValueChange={(value: string) => setStatus(value as "مدفوعة" | "معلقة" | "متأخرة")}
  value={status}
      >
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
