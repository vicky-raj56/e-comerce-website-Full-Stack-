import React from "react";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeToCart } from "@/app/features/cartSlice";
import { toast } from "react-toastify";
import axios from "axios";

function ProductCard({ product }) {
  const {
    _id,
    productName,
    productDescription,
    productImage,
    productPrice,
    category,
    brand,
  } = product;
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { accessToken } = useSelector((state) => state.user);
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
    <div className="shadow-lg rounded-lg overflow-hidden bg-white border">
      {/* image */}
      <div className="w-full aspect-square overflow-hidden bg-gray-50">
        <img
          src={productImage[0].url}
          alt={productName}
          className="w-full h-full transition-transform duration-300 hover:scale-105 object-cover cursor-pointer"
        />
      </div>
      {/* product info */}
      <div className="px-2 space-y-1">
        <h1 className="font-semibold line-clamp-1 text-gray-800">
          {productName}
        </h1>
        <h2 className="font-bold text-lg">₹ {productPrice}</h2>
        {/* {items.find((item) => item._id === _id) ? (
          <Button
            className="cursor-pointer bg-pink-600 hover:bg-pink-700 w-full my-2  "
            onClick={() => {
              dispatch(removeToCart(_id));
            }}
          >
            <ShoppingCart className="mr-1 h-4 w-4" /> Remove to Cart
          </Button>
        ) : (
          <Button
            className="cursor-pointer bg-pink-600 hover:bg-pink-700 w-full my-2  "
            onClick={() => {
              addedToCart(_id);
            }}
          >
            <ShoppingCart className="mr-1 h-4 w-4" /> Add to Cart
          </Button>
        )} */}


        <Button
            className="cursor-pointer bg-pink-600 hover:bg-pink-700 w-full my-2  "
            onClick={() => {
              addedToCart(_id);
            }}
          >
            <ShoppingCart className="mr-1 h-4 w-4" /> Add to Cart
          </Button>
      </div>
    </div>
  );
}

export default ProductCard;
