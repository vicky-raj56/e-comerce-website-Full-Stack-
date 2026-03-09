import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function handleSubmit() {
    try {
      const response = await axios.post(`${backendUrl}/user/signup`, {
        ...formData,
      });
      toast.success(response.data.message);
      console.log(response.data);
      navigate("/verify");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.response.data.message || "something went wrong");
      console.log("signup error", error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800/90">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Sign up your account</CardTitle>
          <CardDescription className="text-center">
            Enter your details given below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="enter first name..."
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="enter last name..."
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
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
                  <div className="relative">
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
                <p>
                  Already have an account
                  <Link
                    to={"/login"}
                    className=" ml-2 inline-block text-md underline-offset-4 hover:underline"
                  >
                    login
                  </Link>
                </p>
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
            Sign up
          </Button>
          {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}

export default Signup;
