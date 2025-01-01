import axios from 'axios';
import { getAuthCookie } from "./cookieUtils"; // <-- import the cookie helper
import { Agent,Customer,Debt,Product,ProductCategory,Payment,Invoice } from "@/types";
import { API_URL } from './apiUrl';





// -----------------------------------------------------------------------------
// Common Setup
// -----------------------------------------------------------------------------

/**
 * Helper function to add auth token to fetch headers
 * (Though not strictly necessary since we have axios interceptors,
 *  you can still export this if you need it elsewhere.)
 */
// -----------------------------------------------------------------------------
// AXIOS INSTANCE
// -----------------------------------------------------------------------------
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // allow sending/receiving cookies
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? getAuthCookie() : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // handle 401 globally
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------


export type InvoiceAR = {
  _id: string;
  معرف_العميل: string;
  المبلغ: number;
  الحالة: "مدفوعة" | "معلقة" | "متأخرة";
  تاريخ_الاستحقاق: string;
  العناصر: Array<{
    الوصف: string;
    الكمية: number;
    سعر_الوحدة: number;
  }>;
};

// -----------------------------------------------------------------------------
// Mock Data (if needed locally, e.g. getCustomerProfile, etc.)
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Customers
// -----------------------------------------------------------------------------
export async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await api.get<Customer[]>("/customers");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch customers");
  }
}


export async function getCustomer(_id: string): Promise<Customer> {
  try {
    console.log(_id)
    const response = await api.get<Customer>(`/customers/${_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch customer");
  }
}


export async function createCustomer(customer: Omit<Customer, "_id">): Promise<Customer> {
  try {
    const response = await api.post<Customer>("/customers", customer);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create customer");
  }
}

export async function updateCustomer(_id: string, customerData: Partial<Customer>): Promise<Customer> {
  try {
    const response = await api.put<Customer>(`/customers/${_id}`, customerData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update customer");
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    await api.delete(`/customers/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete customer");
  }
}

export async function deleteProductCategory(id: string): Promise<void> {
  try {
    await api.delete(`/customers/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete customer");
  }
}


// -----------------------------------------------------------------------------
// Agents
// -----------------------------------------------------------------------------
export async function getAgents(): Promise<Agent[]> {
  try {
    const response = await api.get<Agent[]>("/agents");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch agents");
  }
}

export async function getAgent(id: string): Promise<Agent> {
  try {
    const response = await api.get<Agent>(`/agents/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Failed to fetch agent with id: ${id}`);
  }
}

export async function createAgent(agent: Omit<Agent, "id">): Promise<Agent> {
  try {
    const response = await api.post<Agent>("/agents", agent);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create agent");
  }
}

export async function updateAgent(id: string, agentData: Partial<Agent>): Promise<Agent> {
  try {
    const response = await api.put<Agent>(`/agents/${id}`, agentData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update agent");
  }
}

export async function deleteAgent(id: string): Promise<void> {
  try {
    await api.delete(`/agents/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete agent");
  }
}

// -----------------------------------------------------------------------------
// Products
// -----------------------------------------------------------------------------
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await api.get<Product[]>("/products");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch products");
  }
}

export async function getProduct(id: string): Promise<Product | undefined> {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    // 404 -> return undefined
    if (error.response?.status === 404) {
      console.warn(`Product with ID ${id} not found.`);
      return undefined;
    }
    console.error("Failed to fetch product:", error);
    return undefined;
  }
}

export async function createProduct(productData: Omit<Product, "_id">): Promise<Product> {
  try {
    const response = await api.post<Product>("/products", productData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create product");
  }
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  try {
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update product");
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await api.delete(`/products/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete product");
  }
}

// -----------------------------------------------------------------------------
// English Invoices
// -----------------------------------------------------------------------------
export async function getInvoices(): Promise<Invoice[]> {
  try {
    const response = await api.get<Invoice[]>("/invoices");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch invoices");
  }
}

export async function getInvoice(id: string): Promise<Invoice | undefined> {
  try {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching invoice:", error);
    return undefined;
  }
}

export async function createInvoice(invoice: Omit<Invoice, "id">): Promise<Invoice> {
  try {
    const response = await api.post<Invoice>("/invoices", invoice);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create invoice");
  }
}

export async function updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
  try {
    const response = await api.put<Invoice>(`/invoices/${id}`, invoiceData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update invoice");
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    await api.delete(`/invoices/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete invoice");
  }
}

// -----------------------------------------------------------------------------
// Arabic Invoices
// -----------------------------------------------------------------------------
const INVOICE_API_URL = "/invoices"; // We'll assume the same base path, or you can do `/arabic-invoices` if your backend differs.

export async function getInvoicesAR(): Promise<InvoiceAR[]> {
  try {
    // If your Arabic invoices are under the same route, just use `INVOICE_API_URL`
    const response = await api.get<InvoiceAR[]>(INVOICE_API_URL);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch Arabic invoices");
  }
}

export async function getInvoiceAR(id: string): Promise<InvoiceAR> {
  try {
    const response = await api.get<InvoiceAR>(`${INVOICE_API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Failed to fetch Arabic invoice with id: ${id}`);
  }
}

export async function createInvoiceAR(invoice: Omit<InvoiceAR, "_id">): Promise<InvoiceAR> {
  try {
    const response = await api.post<InvoiceAR>(INVOICE_API_URL, invoice);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create Arabic invoice");
  }
}

export async function updateInvoiceAR(
  id: string,
  invoiceData: Partial<InvoiceAR>
): Promise<InvoiceAR> {
  try {
    const response = await api.put<InvoiceAR>(`${INVOICE_API_URL}/${id}`, invoiceData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update Arabic invoice");
  }
}

export async function deleteInvoiceAR(id: string): Promise<void> {
  try {
    await api.delete(`${INVOICE_API_URL}/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete Arabic invoice");
  }
}

// -----------------------------------------------------------------------------
// Additional Helpers (Debts, Payments, local calculations, etc.)
// -----------------------------------------------------------------------------


// export async function getInvoicesByAgent(agentId: string): Promise<Invoice[]> {
//   // Using local mock data
//   return undefined;
// }

export async function updateProductStock(
  productId: string,
  quantity: number
): Promise<Product | undefined> {
  // Local logic example
  const product = await getProduct(productId);
  if (product) {
    const updatedStock = product.stock - quantity;
    if (updatedStock >= 0) {
      return await updateProduct(productId, { stock: updatedStock });
    }
  }
  return undefined;
}

export async function calculateAgentPerformance(
  agentId: string
): Promise<{ totalSales: number; averageRating: number }> {
  const agent = await getAgent(agentId);
  return { totalSales: 0, averageRating: 0 };
}

export async function addDebtToCustomer(
  customerId: string,
  debt: Omit<Debt, "id">
): Promise<Customer | undefined> {
  return undefined;
}

export async function updateDebtForCustomer(
  customerId: string,
  debtId: string,
  debtData: Partial<Debt>
): Promise<Customer | undefined> {
  // Local logic example
  return undefined;
}

export async function removeDebtFromCustomer(
  customerId: string,
  debtId: string
): Promise<Customer | undefined> {
  // Local logic example
  return undefined;
}

export async function repayDebt(
  customerId: string,
  debtId: string,
  amount: number
): Promise<Customer | undefined> {
  // Local logic example
  return undefined;
}

// -----------------------------------------------------------------------------
// Categories
// -----------------------------------------------------------------------------
export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const response = await api.get<ProductCategory[]>("/categories");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch product categories");
  }
}

export async function getProductCategory(id: string): Promise<ProductCategory> {
  try {
    const response = await api.get<ProductCategory>(`/categories/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Failed to fetch product category with id: ${id}`);
  }
}

export async function createCategory(
  category: Omit<ProductCategory, "id">
): Promise<ProductCategory> {
  try {
    const response = await api.post<ProductCategory>("/categories", category);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create category");
  }
}

// -----------------------------------------------------------------------------
// Payments
// -----------------------------------------------------------------------------
export async function addPayment(payment: Omit<Payment, "id">): Promise<Payment> {
  try {
    const response = await api.post<Payment>("/payments", payment);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add payment");
  }
}


export async function getCustomerPayments(customerId: string): Promise<Payment[]> {
  try {
    const response = await api.get<Payment[]>(`/customers/${customerId}/payments`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Failed to fetch payments for customer with id: ${customerId}`);
  }
}


export async function getCustomerProfile(customerId: string): Promise<Customer> {
  try {
    const response = await api.get<Customer>(`/customers/${customerId}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Failed to fetch customer with id: ${customerId}`);
  }
}
export async function getCustomerBalance(customerId: string): Promise<number> {
  try {
    const response = await api.get<number>(`/customers/${customerId}/balance`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Failed to fetch balance for customer with id: ${customerId}`);
  }
}

export async function getPayments(): Promise<Payment[]> {
  try {
    const response = await api.get<Payment[]>("/payments");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch payments");
  }
}
