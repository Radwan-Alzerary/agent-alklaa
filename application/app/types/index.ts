export interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  }
  
  export interface Agent {
    _id: string;
    name: string;
    email: string;
    phone: string;
  }
  
  export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
  }
  
  export interface ProductCategory {
    _id: string;
    name: string;
    description: string;
  }
  
  export interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
    name: string;
  }
  
  export interface Invoice {
    _id: string;
    customerId: string;
    invoiceNumber: string;
    date: string;
    dueDate: string;
    items: InvoiceItem[];
    totalAmount: number;
    status: 'pending' | 'paid' | 'overdue';
    location: {
      lat: number;
      lng: number;
    };
  }
  
  export interface Payment {
    _id: string;
    customerId: string;
    amount: number;
    date: string;
    method: string;
  }
  
  export interface Debt {
    _id: string;
    amount: number;
    dueDate: string;
    description: string;
  }
  
  