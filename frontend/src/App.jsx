import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import { ToastContainer } from "react-toastify";
// import Verify from "./pages/Verify";
// import VerifyEmail from "./pages/VerifyEmail";
// import ReVerify from "./pages/ReVerify";
// import ForgotPassword from "./pages/ForgotPassword";
// import VerifyOTP from "./pages/VerifyOTP";
// import ResetPassword from "./pages/ResetPassword";
// import Profile from "./pages/Profile";
// import Products from "./pages/Products";
// import Cart from "./pages/Cart";

import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import AdminSales from "./pages/admin/AdminSales";
import AddProduct from "./pages/admin/AddProduct";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import ShowUserOrders from "./pages/admin/ShowUserOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/UserInfo";
import ProtectedRoute from "./components/ProtectedRoute";
import SingleProduct from "./pages/SingleProduct";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

const Verify = lazy(() => import("./pages/Verify"));
const ReVerify = lazy(() => import("./pages/ReVerify"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const Cart = lazy(() => import("./pages/Cart"));
const Products = lazy(() => import("./pages/Products"));
const Profile = lazy(() => import("./pages/Profile"));

export default function App() {
  return (
    <div>
      <Navbar />
      <Suspense fallback="loading">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/reverify" element={<ReVerify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<SingleProduct />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<h1>Admin dashboard</h1>} />
            <Route path="sales" element={<AdminSales />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products" element={<AdminProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users/orders/:id" element={<ShowUserOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<UserInfo />} />
          </Route>
        </Routes>
      </Suspense>
      {/* <ToastContainer position="top-center" autoClose={1000} /> */}
      <Toaster />
    </div>
  );
}
