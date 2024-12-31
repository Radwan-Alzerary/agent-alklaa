import axios from 'axios';
import { Customer, Agent, Product, ProductCategory, Invoice, Payment, Debt } from '../types';

const API_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Customers
export const getCustomers = async (): Promise<Customer[]> => {
  const response = await api.get<Customer[]>('/customers');
  return response.data;
};

export const getCustomer = async (id: string): Promise<Customer> => {
  const response = await api.get<Customer>(`/customers/${id}`);
  return response.data;
};

export const createCustomer = async (customer: Omit<Customer, '_id'>): Promise<Customer> => {
  const response = await api.post<Customer>('/customers', customer);
  return response.data;
};

export const updateCustomer = async (id: string, customerData: Partial<Customer>): Promise<Customer> => {
  const response = await api.put<Customer>(`/customers/${id}`, customerData);
  return response.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await api.delete(`/customers/${id}`);
};

// Invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  const response = await api.get<Invoice[]>('/invoices');
  return response.data;
};

export const getInvoice = async (id: string): Promise<Invoice> => {
  const response = await api.get<Invoice>(`/invoices/${id}`);
  return response.data;
};

export const createInvoice = async (invoice: Omit<Invoice, '_id'>): Promise<Invoice> => {
  const response = await api.post<Invoice>('/invoices', invoice);
  return response.data;
};

export const updateInvoice = async (id: string, invoiceData: Partial<Invoice>): Promise<Invoice> => {
  const response = await api.put<Invoice>(`/invoices/${id}`, invoiceData);
  return response.data;
};

export const deleteInvoice = async (id: string): Promise<void> => {
  await api.delete(`/invoices/${id}`);
};

// Payments
export const getPayments = async (): Promise<Payment[]> => {
  const response = await api.get<Payment[]>('/payments');
  return response.data;
};

export const addPayment = async (payment: Omit<Payment, '_id'>): Promise<Payment> => {
  const response = await api.post<Payment>('/payments', payment);
  return response.data;
};

export const getCustomerPayments = async (customerId: string): Promise<Payment[]> => {
  const response = await api.get<Payment[]>(`/customers/${customerId}/payments`);
  return response.data;
};

// Products
export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

export const getProduct = async (id: string): Promise<Product | undefined> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return undefined;
    }
    throw error;
  }
};

export const createProduct = async (productData: Omit<Product, '_id'>): Promise<Product> => {
  const response = await api.post<Product>('/products', productData);
  return response.data;
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

// Product Categories
export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const response = await api.get<ProductCategory[]>('/categories');
  return response.data;
};

export const createCategory = async (category: Omit<ProductCategory, '_id'>): Promise<ProductCategory> => {
  const response = await api.post<ProductCategory>('/categories', category);
  return response.data;
};

// Additional helper functions
export const getCustomerProfile = async (customerId: string): Promise<Customer> => {
  const response = await api.get<Customer>(`/customers/${customerId}/`);
  return response.data;
};

export const getCustomerBalance = async (customerId: string): Promise<number> => {
  const response = await api.get<number>(`/customers/${customerId}/balance`);
  return response.data;
};

