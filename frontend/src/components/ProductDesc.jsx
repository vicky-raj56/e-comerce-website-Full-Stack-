import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/app/features/cartSlice";
import axios from "axios";

function ProductDesc({ product }) {
  // console.log(product)
  const { productName, productDescription, productPrice, category, brand } =
    product;
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  async function addedToCart(productId) {
    try {
      const response = await axios.post(
        `${backendUrl}/cart/add`,
        { productId },
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // console.log(response.data.cart)
        dispatch(addToCart(response.data.cart));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
      console.log("addToCart error:", error);
    }
  }
  return (
    <div className="flex flex-col gap-4 p-1">
      <h1 className="text-3xl font-bold">{productName}</h1>

      <h1>
        {category} | {brand}
      </h1>
      <h1 className="text-blue-800 font-bold text-2xl">
        ₹ {Number(productPrice).toLocaleString("en-IN")}
      </h1>
      <p className="text-muted-foreground line-clamp-10">
        {productDescription}
      </p>

      <div className="flex gap-2 items-center w-75">
        <p className="text-gray-800 font-semibold">Quantity :</p>
        <Input type="number" defaultValue={1} className="w-14" />
      </div>
      <Button
        className="bg-pink-600 hover:bg-pink-700 cursor-pointer"
        onClick={() => {
          addedToCart(product?._id);
        }}
      >
        Add to Cart
      </Button>
    </div>
  );
}

export default ProductDesc;
