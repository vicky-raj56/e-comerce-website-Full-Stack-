import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const resetToken = localStorage.getItem("resetToken");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!resetToken) {
        return toast.error("token is empty verify first");
      }

      const response = await axios.post(
        `${backendUrl}/user/verify-otp`,
        {
          otp,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(resetToken)}`,
          },
        },
      );
      toast.success(response.data.message);
      if (response.data.success) {
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("reverify ", error.response);
    }
  };

  return (
    <div className="relative w-full  overflow-hidden">
      <div className="min-h-screen flex items-center justify-center bg-pink-100  px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md  ">
          <h2 className="text-2xl text-center font-semibold text-green-500 mb-4 ">
            Forgot Password
          </h2>
          <form className="grid gap-2" onSubmit={handleSubmit}>
            <div className="grid   gap-2">
              <label
                htmlFor="number"
                className="grid gap-2 text-xl font-semibold"
              >
                OTP
              </label>
              <input
                className="grid px-3 py-2 border text-lg font-semibold "
                type="number"
                id="number"
                placeholder="enter email..."
                name="email"
                
                value={otp}
                onChange={(event) => {
                  setOtp(event.target.value);
                }}
              />
            </div>
            <button className="w-full px-3 py-2 bg-blue-400 hover:bg-blue-600 font-semibold text-xl rounded-lg cursor-pointer mt-2">
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
