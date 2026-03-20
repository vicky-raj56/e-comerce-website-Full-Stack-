// import { logout } from "@/app/userSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const { userData, accessToken } = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  if (!userData) {
    return <Navigate to={"/login"} />;
  }
  if (adminOnly && userData.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
