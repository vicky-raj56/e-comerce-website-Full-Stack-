import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout, setUser } from "@/app/userSlice";

function Navbar() {
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const accessToken = localStorage.getItem("accessToken");
  async function handleLogout() {
    try {
      const response = await axios.post(
        `${backendUrl}/user/logout`,
        {},
        {
          headers: {
            Authorization: accessToken
              ? `Bearer ${JSON.parse(accessToken)}`
              : "",
          },
        },
      );
      if (response.data.success) {
        dispatch(logout());
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
      console.log("in logout Error:", error);
    }
  }

  return (
    <div className="w-full bg-pink-50 sticky top-0 z-20 border-b border-pink-300 shadow-sm ">
      <div className="max-w-7xl mx-auto px-2 lg:px-4 py-2 lg:py-4 flex items-center justify-between ">
        {/* logo */}
        <div className="cursor-pointer">
          <Link to={"/"}>
            <img src="/logo.png" alt="logo" className="w-35   " />
          </Link>
        </div>

        {/* nav section */}
        <nav className="flex items-center justify-between gap-10">
          <ul className="flex items-center gap-7 text-xl font-semibold">
            <Link to={"/"}>
              <li className="border-b-2  border-transparent  hover:border-black transition-colors duration-300">
                Home
              </li>
            </Link>
            <Link to={"/products"}>
              <li className="border-b-2  border-transparent  hover:border-black transition-colors duration-300">
                Products
              </li>
            </Link>
            {userData && (
              <Link to={`/profile/${userData._id}`}>
                <li className="border-b-2  border-transparent  hover:border-black  transition-colors duration-300">
                  Hello {userData?.firstName}
                </li>
              </Link>
            )}
          </ul>
          <Link to={"/cart"} className="relative ">
            <ShoppingCart />
            <span className="bg-pink-500 rounded-full absolute -top-3 -right-5 px-2 text-white font-bold">
              {0}
            </span>
          </Link>

          {userData ? (
            <Button
              className="bg-pink-600 text-white cursor-pointer hover:scale-103 transition-all duration-200 "
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button className=" bg-linear-to-tl from-blue-600 to-purple-600 text-white cursor-pointer  font-semibold hover:bg-linear-to-tl hover:from-blue-700 hover:to-purple-800 hover:scale-103 transition-all duration-200 ">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
