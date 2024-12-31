import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Customer } from '../types';

interface CustomerState {
  customers: Customer[];
}

const initialState: CustomerState = {
  customers: [],
};

export const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(customer => customer._id === action.payload._id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.customers = state.customers.filter(customer => customer._id !== action.payload);
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } = customerSlice.actions;

export const selectCustomers = (state: RootState) => state.customers.customers;

export default customerSlice.reducer;

