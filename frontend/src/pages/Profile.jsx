import React, { use, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
function Profile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("/hero.logo.jpg");
  const navigate = useNavigate();
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const accessToken = localStorage.getItem("accessToken");
  const [buttonLoading, setButtonLoading] = useState(false);
  useEffect(() => {
    async function getProfileData() {
      try {
        const response = await axios.get(`${backendUrl}/user/profile/${id}`, {
          headers: {
            Authorization: accessToken
              ? `Bearer ${JSON.parse(accessToken)}`
              : "",
          },
        });
        if (response.data.success) {
          const user = response.data.user;
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phoneNo: user.phoneNo || "",
            address: user.address || "",
            city: user.city || "",
            zipCode: user.zipCode || "",
          });
          if (user.profilePic) {
            setPreviewUrl(user.profilePic);
          }
        }
      } catch (error) {
        console.log("getProfile error:", error);
        toast.error(error?.response?.data.message || "something went wrong");
      }
    }
    getProfileData();
  }, []);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setButtonLoading(true);

      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("phoneNo", formData.phoneNo);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("zipCode", formData.zipCode);

      if (selectedFile) {
        data.append("profilePic", selectedFile);
      }

      const response = await axios.put(
        `${backendUrl}/user/profile/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: accessToken
              ? `Bearer ${JSON.parse(accessToken)}`
              : "",
          },
        },
      );

      if (response.data.success) {
        setButtonLoading(false)
        toast.success(response.data.message);
        setTimeout(() => {
          // navigate(`/profile/${id}`);
        }, 2000);
      }
    } catch (error) {
      setButtonLoading(false);
      console.log("updateProfile error:", error);
      toast.error(error?.response?.data.message || "something went wrong");
    }
  }

  return (
    <div className="min-h-[calc(100vh-87px)] bg-gray-100 ">
      <div className="w-full md:max-w-7xl md:mx-auto  px-4 py-10 flex flex-col items-center">
        <Tabs defaultValue="profile" className="">
          <TabsList className="mx-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="order">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <div>
              <div className="flex flex-col items-center justify-center bg-gray-100">
                <h1 className="font-bold text-2xl text-gray-800 mb-7">
                  Update Profile
                </h1>
                <div className="  flex flex-col gap-5  md:flex-row  md:gap-10 md:justify-center md:items-start  md:max-w-2xl">
                  {/* profile picture  */}
                  <div>
                    <div className="w-32 h-32 rounded-full  overflow-hidden border-3  border-pink-500 mb-3">
                      <img
                        src={previewUrl}
                        alt="profile"
                        name="profilePic"
                        className="w-full h-full object-cover  hover:scale-102 transition-all duration-150"
                      />
                    </div>
                    <label className="bg-pink-600 rounded-lg cursor-pointer px-3 py-1.5  text-white text-lg font-medium  active:bg-pink-800">
                      Change Picture
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        name="profilePic"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {/* profile form  */}
                  <form
                    className="  space-y-4 p-5 shadow-lg rounded-lg bg-white "
                    onSubmit={handleSubmit}
                  >
                    <div className="grid  md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2 ">
                        <label
                          htmlFor="firstName"
                          className="text-sm font-semibold ml-2"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="enter first name..."
                          className="w-full px-3 py-1.5 focus:outline-none rounded-lg border 
                          focus:ring-2  focus:ring-gray-400 "
                        />
                      </div>
                      <div className="flex flex-col gap-2 ">
                        <label
                          htmlFor="lastName"
                          className="text-sm font-semibold ml-2"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="enter first name..."
                          className="w-full px-3 py-1.5 rounded-lg border
                          focus:outline-none 
                          focus:ring-2  focus:ring-gray-400 "
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold ml-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        // name="email"
                        value={formData.email}
                        disabled
                        placeholder=" email..."
                        className="w-full px-3 py-1.5 rounded-lg border
                        bg-gray-100 cursor-not-allowed
                          focus:outline-none 
                          focus:ring-2  focus:ring-gray-400 "
                      />
                    </div>
                    <div className="flex flex-col gap-2 ">
                      <label
                        htmlFor="phoneNo"
                        className="text-sm font-semibold ml-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phoneNo"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleInputChange}
                        placeholder="enter your phon number..."
                        className="w-full px-3 py-1.5 rounded-lg border
                          focus:outline-none 
                          focus:ring-2  focus:ring-gray-400 "
                      />
                    </div>
                    <div className="flex flex-col gap-2 ">
                      <label
                        htmlFor="address"
                        className="text-sm font-semibold ml-2"
                      >
                        Address
                      </label>
                      <textarea
                        type="text"
                        id="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        name="address"
                        placeholder="enter address..."
                        className="w-full px-3 py-1.5 rounded-lg border
                          focus:outline-none 
                          focus:ring-2  focus:ring-gray-400 "
                      />
                    </div>
                    <div className="flex flex-col gap-2 ">
                      <label
                        htmlFor="city"
                        className="text-sm font-semibold ml-2"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="enter first name..."
                        className="w-full px-3 py-1.5 rounded-lg border
                          focus:outline-none 
                          focus:ring-2  focus:ring-gray-400 "
                      />
                    </div>
                    <div className="flex flex-col gap-2 ">
                      <label
                        htmlFor="zipcode"
                        className="text-sm font-semibold ml-2"
                      >
                        ZipCode
                      </label>
                      <input
                        type="number"
                        id="zipcode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="enter first name..."
                        className="w-full px-3 py-1.5 rounded-lg border
                          focus:outline-none 
                          focus:ring-2  focus:ring-gray-400 "
                      />
                    </div>
                    <div className="flex  justify-between  md:justify-end">
                      <Button
                        type="submit"
                        className="cursor-pointer bg-pink-700/95 text-md font-semibold hover:bg-pink-800/95 active:bg-green-950"
                      >
                        {buttonLoading ? "Updating..." : "Update Profile"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="order">
            <Card>
              <CardHeader>
                <CardTitle>Order</CardTitle>
                <CardDescription>
                  Track performance and user engagement metrics. Monitor trends
                  and identify growth opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Page views are up 25% compared to last month.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;
