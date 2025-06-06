import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../auth/AxiosConfig.jsx";
import secureLocalStorage from "react-secure-storage";

// Utility: get headers terbaru setiap kali dipanggil
const getHeaders = () => ({
  Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
  "Content-Type": "application/json",
});

// Error handler utility
const handleError = (error) => {
  const message = error.response?.data?.message || error.message;
  throw new Error(message);
};

// Thunk untuk fetch cart data
export const getAllCart = createAsyncThunk(
  "cart/getAllCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/carts", {
        headers: getHeaders(),
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Thunk untuk menambah item ke cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (data, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/api/carts", data, {
        headers: getHeaders(),
      });
      const response = await axiosInstance.get("/api/carts", {
        headers: getHeaders(),
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Thunk untuk update cart
export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async (data, { rejectWithValue }) => {
    try {
      const updatedData = { ...data, totalPrice: data.qty * data.price };
      await axiosInstance.put(`/api/carts/${data.id}`, updatedData, {
        headers: getHeaders(),
      });
      const response = await axiosInstance.get("/api/carts", {
        headers: getHeaders(),
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Thunk untuk set detail cart
export const setDetail = createAsyncThunk(
  "cart/setDetail",
  async (data) => data
);

// Thunk untuk delete cart
export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (data, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/carts/${data.id}/${data.userId}`, {
        headers: getHeaders(),
      });
      const response = await axiosInstance.get("/api/carts", {
        headers: getHeaders(),
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  dataEdit: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCart: (state) => {
      state.data = null;
      state.dataEdit = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle loading state
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Handle success state
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.loading = false;
          if (action.type === 'cart/setDetail/fulfilled') {
            state.dataEdit = action.payload;
          } else {
            state.data = action.payload;
          }
        }
      )
      // Handle error state
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearError, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
