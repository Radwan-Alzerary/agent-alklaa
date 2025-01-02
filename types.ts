export type Agent = {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    assignedCustomers: number;
    totalSales: number;
    averageRating: number;
  };
  
  export type Customer = {
    _id?:string;
    name: string;
    tradName:string;
    accountNumber:string;
    email: string;
    phone: string;
    category: string;
    assignedAgent:string | Agent;
    address: string;
    nearestPlace: string;
    location: { lat: number; lng: number };
    registrationDate: string;
    lastPurchaseDate: string;
    totalPurchases: number;
    loyaltyPoints: number;
    debts: Debt[];
    balance: number;
  };
  
export type Debt = {
    id?: string;
    amount: number;
    recipient: string;
    remainingAmount: number;
    dueDate: string;
  };
  
  export type Product = {
    _id?:string
    id?: string;
    name: string;
    price: number;
    stock: number;
    category: string | undefined;
    status: string;
    image: string;
    barcode:string;
    description:string;
  };
  
  export type ProductCategory = {
    id?: string;
    name: string;
    description: string;
  };
  
  export type Payment = {
    _id?:string;
    id?: string;
    customerId: string | Customer; // Union type
    amount: Number;
    date: string;
    agentId: string | Agent; // Can be an ID (string) when posting or an Agent object when retrieving
  };
  
  export type Invoice = {
    _id?:string;
    id?: string;
    customerId: Customer;
    agentId?: Agent;
    invoiceNumber:string;
    date: string;
    dueDate: string;
    items: Array<InvoiceItem>;
    totalAmount: number;
    status: 'paid' | 'pending' | 'overdue';
    location: { lat: number; lng: number };
  };

  export type InvoiceItem = {
    description: string;
    productId?:   Product ; // Make it optional
    quantity: number;
    price: number;
    name: string;
  };
  