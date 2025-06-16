import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import { jwtDecode } from "jwt-decode";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load components
const Home = lazy(() => import("./components/Home"));
const ListCategory = lazy(() => import("./components/category/ListCategory"));
const AddCategory = lazy(() => import("./components/category/AddCategory"));
const EditCategory = lazy(() => import("./components/category/EditCategory"));
const ListSupplier = lazy(() => import("./components/supplier/ListSupplier"));
const AddSupplier = lazy(() => import("./components/supplier/AddSupplier"));
const EditSupplier = lazy(() => import("./components/supplier/EditSupplier"));
const ListProduct = lazy(() => import("./components/product/ListProduct"));
const AddProduct = lazy(() => import("./components/product/AddProduct"));
const EditProduct = lazy(() => import("./components/product/EditProduct"));
const ListSales = lazy(() => import("./components/sales/ListSales"));
const OrderSend = lazy(() => import("./components/sales/OrderSend"));
const ListSalesHistory = lazy(() => import("./components/salesHistory/ListSalesHistory"));
const Login = lazy(() => import("./components/Login"));
const NoPage = lazy(() => import("./components/NoPage"));
const Logout = lazy(() => import("./components/Logout"));
const SalesReturn = lazy(() => import("./components/salesHistory/SalesReturn"));
const ListPurchase = lazy(() => import("./components/purchase/ListPurchase"));
const AddPruchase = lazy(() => import("./components/purchase/AddPruchase"));
const PrintPurchase = lazy(() => import("./components/purchase/PrintPurchase"));
const ProductReport = lazy(() => import("./components/report/product/ProductReport"));
const SupplierReport = lazy(() => import("./components/report/supplier/SupplierReport"));
const SalesReport = lazy(() => import("./components/report/sales/SalesReport"));
const PurchaseReport = lazy(() => import("./components/report/purchase/PurchaseReport"));

const App = () => {
  const token = secureLocalStorage.getItem("acessToken");
  const isAuthenticated = token && !jwtDecode(token).exp < Date.now() / 1000;

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/category" element={<ListCategory />} />
              <Route path="/category/add" element={<AddCategory />} />
              <Route path="/category/edit/:id" element={<EditCategory />} />
              <Route path="/supplier" element={<ListSupplier />} />
              <Route path="/supplier/add" element={<AddSupplier />} />
              <Route path="/supplier/edit/:id" element={<EditSupplier />} />
              <Route path="/product" element={<ListProduct />} />
              <Route path="/product/add" element={<AddProduct />} />
              <Route path="/product/edit/:id" element={<EditProduct />} />
              <Route path="/sales" element={<ListSales />} />
              <Route path="/sales/order" element={<OrderSend />} />
              <Route path="/sales/history" element={<ListSalesHistory />} />
              <Route path="/sales/return/:id" element={<SalesReturn />} />
              <Route path="/purchase" element={<ListPurchase />} />
              <Route path="/purchase/add" element={<AddPruchase />} />
              <Route path="/purchase/print/:id" element={<PrintPurchase />} />
              <Route path="/report/product" element={<ProductReport />} />
              <Route path="/report/supplier" element={<SupplierReport />} />
              <Route path="/report/sales" element={<SalesReport />} />
              <Route path="/report/purchase" element={<PurchaseReport />} />
              <Route path="/logout" element={<Logout />} />
            </>
          ) : (
            <Route path="*" element={<Login />} />
          )}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
