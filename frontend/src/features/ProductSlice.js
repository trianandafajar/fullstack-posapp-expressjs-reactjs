import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";
import { axiosInstance } from "../auth/AxiosConfig.jsx";

// Dynamic headers untuk update token yang terbaru
const getHeaders = () => ({
  Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
  "Content-Type": "application/json",
});

// GET all products (with search)
export const getAllProduct = createAsyncThunk(
  "product/getAllProduct",
  async (keyword = "", { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/products?search_query=${keyword}&limit=250`,
        { headers: getHeaders() }
      );
      return response.data.result;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
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
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all product
      .addCase(getAllProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get by category
      .addCase(getAllByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
