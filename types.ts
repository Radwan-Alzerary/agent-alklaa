export type Agent = {
    _id: string;
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    assignedCustomers: number;
    totalSales: number;
    averageRating: number;
  };
  
  export type Customer = {
    _id:string;
    id: string;
    name: string;
    tradName:string;
    accountNumber:string;
    email: string;
    phone: string;
    category: string;
    assignedAgent: string;
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
    id: string;
    amount: number;
    recipient: string;
    remainingAmount: number;
    dueDate: string;
  };
  
  export type Product = {
    _id:string
    id: string;
    name: string;
    category?: string;
    price: number;
    stock: number;
    status: string;
    image: string;
  };
  
  export type ProductCategory = {
    id: string;
    name: string;
    description: string;
  };
  
  export type Payment = {
    id: string;
    customerId: string;
    amount: number;
    date: string;
    agentId: Agent;
  };
  
  export type Invoice = {
    _id:string;
    id: string;
    customerId: Customer;
    agentId: Agent;
    invoiceNumber:string;
    date: string;
    dueDate: string;
    items: Array<{
    description:string;
      productId: Product;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    status: 'paid' | 'pending' | 'overdue';
    location: { lat: number; lng: number };
  };