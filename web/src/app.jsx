import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index.jsx";
import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import RequireAuth from "./components/requireAuth.jsx";
import StaffProducts from "./pages/staff/StaffProducts.jsx";
import Users from "./pages/staff/users";
import AdminReports from "./pages/adminReports.jsx";
import AdminUsers from "./pages/adminUsers";
import ProductForm from "./pages/staff/ProductForm.jsx";
import User1 from "./pages/user1.jsx";
import Checkout from "./pages/checkout.jsx";
import OrderDetail from "./pages/orderDetail.jsx";
import Orders from "./pages/orders.jsx";
import ResetPassword from "./pages/resetPassword.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/reports"
          element={
            <RequireAuth roles={["admin"]}>
              <AdminReports />
            </RequireAuth>
          }
        />


        <Route path="/admin/users" element={
            <RequireAuth roles={["admin"]}><AdminUsers/></RequireAuth>
        }/>

        <Route
          path="/staff/products"
          element={
            <RequireAuth roles={["staff","admin"]}>
              <StaffProducts />
            </RequireAuth>
          }
        />
        <Route
          path="/staff/products/new"
          element={
            <RequireAuth roles={["staff","admin"]}>
              <ProductForm />
            </RequireAuth>
          }
        />
        <Route path="/staff/users" element={
          <RequireAuth roles={["staff","admin"]}><Users/></RequireAuth>
        } />

        <Route
          path="/staff/products/:id"
          element={
            <RequireAuth roles={["staff","admin"]}>
              <ProductForm />
            </RequireAuth>
          }
        />

        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user1" element={<User1 />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:id" element={<OrderDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
