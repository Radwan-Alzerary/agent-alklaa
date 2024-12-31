import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Invoice } from '../types';

interface InvoiceState {
  invoices: Invoice[];
}

const initialState: InvoiceState = {
  invoices: [],
};

export const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices.push(action.payload);
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.invoices.findIndex(invoice => invoice._id === action.payload._id);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.invoices = state.invoices.filter(invoice => invoice._id !== action.payload);
    },
  },
});

export const { addInvoice, updateInvoice, deleteInvoice } = invoiceSlice.actions;

export const selectInvoices = (state: RootState) => state.invoices.invoices;

export default invoiceSlice.reducer;

