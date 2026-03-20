import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";

function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const resetToken = localStorage.getItem("resetToken");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!resetToken) {
        return toast.error("token is empty pls verify first");
      }

      const response = await axios.post(
        `${backendUrl}/user/reset-password`,
        {
          ...formData,
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
          navigate("/login");
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
            Reset Password
          </h2>
          <form className="grid gap-2" onSubmit={handleSubmit}>
            <div className="grid   gap-2 mb-3">
              <label
                htmlFor="password"
                className="grid gap-2 text-xl font-semibold"
              >
                New Password
              </label>
              <div className="relative w-full ">
                <input
                  className="grid w-full px-3 py-2 border text-lg font-semibold "
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="enter password..."
                  name="newPassword"
                  value={FormData.newPassword}
                  onChange={handleChange}
                />

                <span
                  className="cursor-pointer absolute top-3 right-2"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
            </div>
            <div className="grid   gap-2">
              <label
                htmlFor=" Confirm-Password"
                className="grid gap-2 text-xl font-semibold"
              >
                Confirm Password
              </label>
              <div className="relative w-full ">
                <input
                  className=" w-full px-3 py-2 border text-lg font-semibold "
                  type={showConfirmPassword ? "text" : "password"}
                  id=" Confirm-Password"
                  placeholder="enter email..."
                  name="confirmPassword"
                  value={FormData.confirmPassword}
                  onChange={handleChange}
                />
                <span
                  className="cursor-pointer absolute top-3 right-2"
                  onClick={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
            </div>
            <button className="w-full px-3 py-2 bg-blue-400 hover:bg-blue-600 font-semibold text-xl rounded-lg cursor-pointer mt-2">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
