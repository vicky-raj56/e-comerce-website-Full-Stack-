import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ReVerify() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/user/reverify`, {
        email,
      });
      if (response.data.success) {
        setTimeout(() => {
          navigate("/verify");
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
            Reverify Your Email
          </h2>
          <form className="grid gap-2" onSubmit={handleSubmit}>
            <div className="grid   gap-2">
              <label
                htmlFor="email"
                className="grid gap-2 text-xl font-semibold"
              >
                Email
              </label>
              <input
                className="grid px-3 py-2 border "
                type="email"
                id="email"
                placeholder="enter email..."
                name="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </div>
            <button className="w-full px-3 py-2 bg-blue-400 hover:bg-blue-600 font-semibold text-xl rounded-lg cursor-pointer mt-2">
              ReVerify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReVerify;
