import React from 'react';
import JsBarcode from 'jsbarcode';
import { Product } from '@/types';
interface InvoiceItem {
  productId: Product | string; // Accept both types
  quantity: number;
  price: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerId: { _id: string; name: string }; // Assuming customerId is an object with name
  totalAmount: number;
  status: string;
  items: InvoiceItem[];
}

interface InvoiceTemplateProps {
  invoice: Invoice;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoice }) => {
  const generateBarcode = (productId: string): string => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, productId, { format: 'CODE128' });
    return canvas.toDataURL('image/png');
  };

  return (
    <div
      id={`invoice-template-${invoice._id}`} // Unique ID for the template
      style={{
        direction: 'rtl',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        fontSize: '14px',
        color: '#333',
      }}
    >
      <h1 style={{ textAlign: 'center' }}>فاتورة رقم: {invoice.invoiceNumber}</h1>
      <p>
        <strong>معرف العميل:</strong> {invoice.customerId.name}
      </p>
      <p>
        <strong>الحالة:</strong> {invoice.status}
      </p>
      {/* <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                backgroundColor: '#f2f2f2',
              }}
            >
              المنتج
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                backgroundColor: '#f2f2f2',
              }}
            >
              الكمية
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                backgroundColor: '#f2f2f2',
              }}
            >
              السعر
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                backgroundColor: '#f2f2f2',
              }}
            >
              الباركود
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'center',
                }}
              >
                {item.productId}
              </td>
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'center',
                }}
              >
                {item.quantity}
              </td>
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'center',
                }}
              >
                {new Intl.NumberFormat('ar-IQ', {
                  style: 'currency',
                  currency: 'IQD',
                }).format(item.price)}
              </td>
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'center',
                }}
              >
                <img
                  src={generateBarcode(item.productId)}
                  alt={`Barcode for ${item.productId}`}
                  style={{ width: '100px', height: '40px' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <h2 style={{ textAlign: 'right', marginTop: '20px' }}>
        المبلغ الإجمالي: {new Intl.NumberFormat('ar-IQ', { style: 'currency', currency: 'IQD' }).format(invoice.totalAmount)}
      </h2>
    </div>
  );
};

export default InvoiceTemplate;