import { setProduct } from "@/app/features/productSlice";
import ImageUpload from "@/components/ImageUpload";
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
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  // form data handle
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productDescription: "",
    brand: "",
    category: "",
    productImage: [],
  });
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { products } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setProductData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDescription", productData.productDescription);
    formData.append("brand", productData.brand);
    formData.append("category", productData.category);

    if (productData.productImage.length === 0) {
      toast.error("Select at least one image is required");
      return;
    }
    productData.productImage.forEach((img) => {
      formData.append("images", img);
    });
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/product/add`, formData, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setProduct([...products, response.data.product]));
        // navigate('products')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log("submitData Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" ml-75 mx-auto pb-10 pr-20 px-4 py-5 bg-gray-100">
      <Card className="w-full ">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Add Product</CardTitle>
          <CardDescription>Enter Product details below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="grid gap-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                type="text"
                name="productName"
                placeholder="Ex-Iphone"
                id="productName"
                required
                value={productData.productName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="productPrice">Product Price</Label>
              <Input
                type="text"
                name="productPrice"
                placeholder="1000.."
                id="productPrice"
                required
                value={productData.productPrice}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  type="text"
                  name="brand"
                  placeholder="Ex-apple.."
                  id="brand"
                  required
                  value={productData.brand}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  type="text"
                  name="category"
                  placeholder="Ex-mobile.."
                  id="category"
                  required
                  value={productData.category}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="description">Description</Label>
              </div>
              <Textarea
                type="text"
                name="productDescription"
                placeholder="enter brief description of your product..."
                id="description"
                required
                value={productData.productDescription}
                onChange={handleInputChange}
              />
            </div>
            {/* image upload */}
            <ImageUpload
              productData={productData}
              setProductData={setProductData}
            />
          </div>
          {/* Footer */}
          <CardFooter className="flex flex-col gap-2">
            <Button
              disabled={loading}
              className="w-full mt-10 bg-pink-600 cursor-pointer hover:bg-pink-700 text-lg"
              type="submit"
              onClick={handleSubmit}
            >
              {loading ? (
                <span className="flex gap-2 items-center">
                  <Loader2 className="animate-spin" /> please wait...
                </span>
              ) : (
                "Add Product"
              )}
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddProduct;
