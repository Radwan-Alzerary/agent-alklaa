import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ email: string; password: string }>) => {
      // In a real app, you would validate credentials here
      state.isAuthenticated = true;
      state.user = { email: action.payload.email };
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;

