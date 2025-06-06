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

// Cache untuk menyimpan kategori
let categoryCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit dalam milidetik

export const getAllCategory = createAsyncThunk(
  "category/getAllCategory",
  async (_, { rejectWithValue }) => {
    try {
      // Cek cache dan waktu terakhir fetch
      const now = Date.now();
      if (categoryCache && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
        return categoryCache;
      }

      const response = await axiosInstance.get("/api/categorys", {
        headers: getHeaders(),
      });
      
      // Update cache
      categoryCache = response.data.result;
      lastFetchTime = now;
      
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

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCache: () => {
      categoryCache = null;
      lastFetchTime = null;
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

export const { clearError, clearCache } = categorySlice.actions;
export default categorySlice.reducer;
