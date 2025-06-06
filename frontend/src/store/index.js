import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import categoryReducer from "../features/CategoriSlice";
import productReducer from "../features/ProductSlice";
import cartReducer from "../features/CartSlice";

// Konfigurasi persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // Hanya cart yang perlu di-persist
};

const rootReducer = combineReducers({
  category: categoryReducer,
  product: productReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Mengabaikan warning untuk action non-serializable
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
      immutableCheck: false, // Menonaktifkan immutable check untuk performa
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
