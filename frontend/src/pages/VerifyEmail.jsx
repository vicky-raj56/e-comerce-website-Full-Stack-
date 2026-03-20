import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";

function VerifyEmail() {
  const { token } = useParams();

  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying...");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const verifyEmail = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/user/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        setStatus("✅Email verify Successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      if(error.response.data.message ==="the registration token has expired"){
        setTimeout(()=>{
          navigate("/reverify")
        },1000)
      }
      console.log("verifyEmail error", error.response);
      setStatus("❌Verification failed. Please try again ");
    }
  };
  useEffect(() => {
    verifyEmail();
  }, [token]);

  return (
    <div className="relative w-full bg-pink-100 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-md">
          <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
