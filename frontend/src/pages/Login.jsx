import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../app/userSlice";
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function handleSubmit() {
    try {
      const response = await axios.post(`${backendUrl}/user/login`, {
        ...formData,
      });
      toast.success(response.data.message);
      // console.log(response.data);
      if (response.data.success) {
        dispatch(
          setUser({
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          }),
        );
      }

      navigate("/");
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
      console.log("login error", error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800/90">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Login your account</CardTitle>
          <CardDescription className="text-center">
            fill your details given below
          </CardDescription>
          {/* <CardAction>
             <Button variant="link">Sign Up</Button>
           </CardAction> */}
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative w-full">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="enter password...."
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <Link
                  to={"/forgot-password"}
                  className=" text-right ml-2 inline-block text-md underline-offset-4 hover:underline hover:text-gray-800"
                >
                  Forgot-Password
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full cursor-pointer"
            onClick={handleSubmit}
          >
            Login
          </Button>
          <span>
            {" "}
            Don't have an account
            <Link
              to={"/signup"}
              className=" ml-2 inline-block text-md underline-offset-4 hover:underline"
            >
              signup
            </Link>
          </span>
          {/* <Button variant="outline" className="w-full">
             Login with Google
           </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
