// app/customers/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import {
  createCustomer as apiCreateCustomer,
  updateCustomer as apiUpdateCustomer,
  deleteCustomer as apiDeleteCustomer,
  createAgent as apiCreateAgent,
  updateAgent as apiUpdateAgent,
  deleteAgent as apiDeleteAgent,
  addDebtToCustomer as apiAddDebtToCustomer,
  updateDebtForCustomer as apiUpdateDebtForCustomer,
  removeDebtFromCustomer as apiRemoveDebtFromCustomer,
  repayDebt as apiRepayDebt,
  addPayment as apiAddPayment
} from "./apiFunctions"; // Update the import path as needed
import { Agent } from "@/app/agents/columns";
import { Customer } from "@/app/customers/columns";
import { Product } from "@/app/products/columns";
import { Debt, Payment } from "@/lib/api";
import { cookies } from "next/headers"; // Import cookies

/**
 * Create a new customer.
 * @param customer Customer data.
 */
export async function createCustomer(customer: Omit<Customer, "id">): Promise<Customer> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }


  const newCustomer = await apiCreateCustomer({
    ...customer,
    registrationDate: customer.registrationDate || new Date().toISOString().split('T')[0]
  }, token);
  
  revalidatePath("/customers");
  return newCustomer;
}


/**
 * Update an existing customer.
 * @param id Customer ID.
 * @param customerData Partial customer data to update.
 */
export async function updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer | undefined> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const updatedCustomer = await apiUpdateCustomer(id, customerData, token);
  revalidatePath("/customers");
  return updatedCustomer;
}

/**
 * Delete a customer.
 * @param id Customer ID.
 */
export async function deleteCustomer(id: string): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  await apiDeleteCustomer(id, token);
  revalidatePath("/customers");
  return true; // Assuming deletion was successful
}

/**
 * Create a new agent.
 * @param agent Agent data.
 */
export async function createAgent(agent: Omit<Agent, "id">): Promise<Agent> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const newAgent = await apiCreateAgent(agent, token);
  revalidatePath("/agents");
  return newAgent;
}

/**
 * Update an existing agent.
 * @param id Agent ID.
 * @param agentData Partial agent data to update.
 */
export async function updateAgent(id: string, agentData: Partial<Agent>): Promise<Agent | undefined> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const updatedAgent = await apiUpdateAgent(id, agentData, token);
  revalidatePath("/agents");
  return updatedAgent;
}

/**
 * Delete an agent.
 * @param id Agent ID.
 */
export async function deleteAgent(id: string): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  await apiDeleteAgent(id, token);
  revalidatePath("/agents");
  return true; // Assuming deletion was successful
}

/**
 * Create a new product.
 * @param productData Product data.
 */
export async function createProduct(productData: Omit<Product, "_id">): Promise<Product> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const newProduct = await apiCreateProduct(productData, token);
  revalidatePath("/products");
  return newProduct;
}

/**
 * Update an existing product.
 * @param id Product ID.
 * @param productData Partial product data to update.
 */
export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | undefined> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const updatedProduct = await apiUpdateProduct(id, productData, token);
  revalidatePath("/products");
  return updatedProduct;
}

/**
 * Add a debt to a customer.
 * @param customerId Customer ID.
 * @param debt Debt data.
 */
export async function addDebtToCustomer(customerId: string, debt: Omit<Debt, "id">): Promise<Customer | undefined> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const updatedCustomer = await apiAddDebtToCustomer(customerId, debt, token);
  revalidatePath(`/customers/${customerId}`);
  return updatedCustomer;
}

/**
 * Update a debt for a customer.
 * @param customerId Customer ID.
 * @param debtId Debt ID.
 * @param debtData Partial debt data to update.
 */
export async function updateDebtForCustomer(customerId: string, debtId: string, debtData: Partial<Debt>): Promise<Customer | undefined> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const updatedCustomer = await apiUpdateDebtForCustomer(customerId, debtId, debtData, token);
  revalidatePath(`/customers/${customerId}`);
  return updatedCustomer;
}

/**
 * Remove a debt from a customer.
 * @param customerId Customer ID.
 * @param debtId Debt ID.
 */
export async function removeDebtFromCustomer(customerId: string, debtId: string): Promise<Customer | undefined> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const updatedCustomer = await apiRemoveDebtFromCustomer(customerId, debtId, token);
  revalidatePath(`/customers/${customerId}`);
  return updatedCustomer;
}

/**
 * Repay a debt for a customer.
 * @param customerId Customer ID.
 * @param debtId Debt ID.
 * @param amount Amount to repay.
 */
export async function repayDebt(customerId: string, debtId: string, amount: number): Promise<Customer | undefined> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const updatedCustomer = await apiRepayDebt(customerId, debtId, amount, token);
  revalidatePath(`/customers/${customerId}`);
  return updatedCustomer;
}

/**
 * Add a new payment.
 * @param payment Payment data.
 */

export async function addPayment(payment: Omit<Payment, "id">): Promise<Payment> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const newPayment = await apiAddPayment(payment, token);
  revalidatePath("/payments");
  revalidatePath(`/customers/${payment.customerId}`);
  return newPayment;
}
