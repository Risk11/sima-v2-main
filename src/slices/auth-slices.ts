import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number | string;
  nama: string;
}

interface AuthState {
  user: User | null;
}

const loadUserFromStorage = (): User | null => {
  try {
    const serializedUser = localStorage.getItem('user');
    if (serializedUser === null) {
      return null;
    }
    return JSON.parse(serializedUser);
  } catch (error) {
    console.error("Gagal memuat user dari storage", error);
    return null;
  }
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      const user = action.payload;
      state.user = user;
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error("Gagal menyimpan user ke storage", error);
      }
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
