import { getInvoice } from "@/lib/api";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";

export default async function PrintableInvoicePage({ params }: { params: { id: string } }) {
  const invoice = await getInvoice(params.id);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="container mx-auto p-8 bg-white text-black print:p-0">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">فاتورة</h1>
        <PrintButton />
      </div>
      
      {/* Invoice Details */}
      <div className="mb-8">
        <p>
          <strong>رقم الفاتورة:</strong> {invoice.invoiceNumber}
        </p>
        <p>
          <strong>تاريخ الإصدار:</strong>{" "}
          {new Intl.DateTimeFormat("ar-IQ", { dateStyle: "long" }).format(new Date(invoice.date))}
        </p>
        <p>
          <strong>تاريخ الاستحقاق:</strong>{" "}
          {new Intl.DateTimeFormat("ar-IQ", { dateStyle: "long" }).format(new Date(invoice.dueDate))}
        </p>
      </div>

      {/* Customer Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">تفاصيل العميل</h2>
        <p>
          <strong>اسم العميل:</strong> {invoice.customerId.name || "غير متوفر"}
        </p>
        {/* <p>
          <strong>البريد الإلكتروني:</strong> {invoice.customerId.email || "غير متوفر"}
        </p> */}
        <p>
          <strong>رقم الهاتف:</strong> {invoice.customerId.phone || "غير متوفر"}
        </p>
      </div>

      {/* Invoice Items */}
      <table className="w-full mb-8 border border-gray-300">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-right py-2">الوصف</th>
            <th className="text-right py-2">الكمية</th>
            <th className="text-right py-2">سعر الوحدة</th>
            <th className="text-right py-2">المجموع</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-2">{item.productId?.name || item.description}</td>
              <td className="py-2">{item.quantity}</td>
              <td className="py-2">
                {new Intl.NumberFormat("ar-IQ", { style: "currency", currency: "IQD" }).format(item.price)}
              </td>
              <td className="py-2">
                {new Intl.NumberFormat("ar-IQ", { style: "currency", currency: "IQD" }).format(
                  item.quantity * item.price
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Amount */}
      <div className="text-right">
        <p className="text-xl font-bold">
          المبلغ الإجمالي:{" "}
          {new Intl.NumberFormat("ar-IQ", { style: "currency", currency: "IQD" }).format(invoice.totalAmount)}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-sm">
        <p>شكراً لتعاملكم معنا. يرجى دفع هذه الفاتورة في موعد أقصاه تاريخ الاستحقاق.</p>
      </div>
    </div>
  );
}
