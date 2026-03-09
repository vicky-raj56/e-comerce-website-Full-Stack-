import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import ReVerify from "./pages/ReVerify";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <div>
      <Navbar />
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
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
      <ToastContainer
        position="top-center"  
        autoClose={1000}
      />
    </div>
  );
}
