import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../auth/AxiosConfig.jsx";
import secureLocalStorage from "react-secure-storage";

// Utility: get headers terbaru setiap kali dipanggil
const getHeaders = () => ({
  Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
  "Content-Type": "application/json",
});

export const getAllCart = createAsyncThunk("cart/getAllCart", async () => {
  try {
    const response = await axiosInstance.get("/api/carts", {
      headers: getHeaders(),
    });
    return response.data.result;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
});

export const addToCart = createAsyncThunk("cart/addToCart", async (data) => {
  try {
    await axiosInstance.post("/api/carts", data, {
      headers: getHeaders(),
    });
    const response = await axiosInstance.get("/api/carts", {
      headers: getHeaders(),
    });
    return response.data.result;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
});

export const updateCart = createAsyncThunk("cart/updateCart", async (data) => {
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
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
});

export const setDetail = createAsyncThunk("cart/setDetail", async (data) => data);

export const deleteCart = createAsyncThunk("cart/deleteCart", async (data) => {
  try {
    await axiosInstance.delete(`/api/carts/${data.id}/${data.userId}`, {
      headers: getHeaders(),
    });
    const response = await axiosInstance.get("/api/carts", {
      headers: getHeaders(),
    });
    return response.data.result;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    data: null,
    loading: false,
    error: null,
    dataEdit: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(setDetail.fulfilled, (state, action) => {
        state.dataEdit = action.payload;
      })

      .addCase(deleteCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
