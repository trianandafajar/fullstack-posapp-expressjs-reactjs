import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../features/CategoriSlice";
import productReducer from "../features/ProductSlice";
import cartReducer from "../features/CartSlice";

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable warning kalau pakai localStorage, FormData, dll
    }),
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools hanya di dev
});
