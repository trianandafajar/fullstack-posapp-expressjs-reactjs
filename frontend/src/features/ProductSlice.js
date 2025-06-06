import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";
import { axiosInstance } from "../auth/AxiosConfig.jsx";

// Utility untuk headers
const getHeaders = () => ({
  Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
  "Content-Type": "application/json",
});

// Error handler utility
const handleError = (error) => {
  const message = error.response?.data?.message || error.message;
  throw new Error(message);
};

// Cache untuk menyimpan hasil pencarian
const searchCache = new Map();

// GET all products (with search)
export const getAllProduct = createAsyncThunk(
  "product/getAllProduct",
  async (keyword = "", { rejectWithValue }) => {
    try {
      // Cek cache untuk keyword yang sama
      if (searchCache.has(keyword)) {
        return searchCache.get(keyword);
      }

      const response = await axiosInstance.get(
        `/api/products?search_query=${keyword}&limit=250`,
        { headers: getHeaders() }
      );
      
      // Simpan ke cache
      searchCache.set(keyword, response.data.result);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// GET products by category ID
export const getAllByCategory = createAsyncThunk(
  "product/getAllByCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/products/category/${id}`,
        { headers: getHeaders() }
      );
      return response.data.result;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCache: () => {
      searchCache.clear();
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
          state.data = action.payload;
          state.lastUpdated = new Date().toISOString();
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

export const { clearError, clearCache } = productSlice.actions;
export default productSlice.reducer;
