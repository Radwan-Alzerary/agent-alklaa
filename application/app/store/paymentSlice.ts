import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Payment } from '../types';

interface PaymentState {
  payments: Payment[];
}

const initialState: PaymentState = {
  payments: [],
};

export const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload);
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex(payment => payment._id === action.payload._id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
    deletePayment: (state, action: PayloadAction<string>) => {
      state.payments = state.payments.filter(payment => payment._id !== action.payload);
    },
  },
});

export const { addPayment, updatePayment, deletePayment } = paymentSlice.actions;

export const selectPayments = (state: RootState) => state.payments.payments;

export default paymentSlice.reducer;

