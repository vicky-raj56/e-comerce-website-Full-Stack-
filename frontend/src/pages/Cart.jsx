import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../../public/user.png";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/app/features/cartSlice";
import { Link } from "react-router-dom";

function Cart() {
  const { cart } = useSelector((state) => state.cart);

  const subTotal = cart.totalPrice;
  const shipping = subTotal > 199 ? 0 : 10;
  const tax = subTotal * 0.05; //5%v tax
  const totalAmount = subTotal + shipping + tax;
  const { accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // console.log(accessToken);

  useEffect(() => {
    async function fetchedCartData() {
      try {
        const response = await axios.get(`${backendUrl}/cart/get-cart`, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        });
        if (response.data.success) {
          console.log(response.data.cart);
          dispatch(addToCart(response.data.cart));
        }
      } catch (error) {
        console.log("cartData fetch Error:", error);
      }
    }
    fetchedCartData();
  }, [dispatch]);
  async function handleRemoveToCart(productId) {
    try {
      const response = await axios.delete(`${backendUrl}/cart/remove`, {
        data: { productId },
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(addToCart(response.data.cart));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
      console.log("removeToCart error", error);
    }
  }

  async function handleIncreaseQuantity(productId) {
    try {
      const response = await axios.put(
        `${backendUrl}/cart/update`,
        { productId, action: "increment" },
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      );

      if (response.data.success) {
        dispatch(increaseQuantity(response.data.cart));
      }
    } catch (error) {
      console.log("updateQuantity error:", error);
    }
  }
  async function handleDecreaseQuantity(productId) {
    try {
      const response = await axios.put(
        `${backendUrl}/cart/update`,
        { productId, action: "decrement" },
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      );

      if (response.data.success) {
        dispatch(decreaseQuantity(response.data.cart));
      }
    } catch (error) {
      console.log("updateQuantity error:", error);
    }
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-87px)]">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto ">
          <h1 className="text-2xl font-bold text-gray-800 mb-7">
            Shopping Cart
          </h1>
          <div className="max-w-7xl mx-auto flex gap-7">
            <div className="flex flex-col gap-5 flex-1">
              {cart?.items?.map((product, idx) => (
                <Card key={product._id}>
                  <div className="flex items-center justify-between pr-7 px-1">
                    <div className="flex  items-center gap-2 w-87.5">
                      <img
                        src={
                          product?.productId?.productImage[0].url || userLogo
                        }
                        alt={product?.productId?.productName}
                        className="w-25 h-25 rounded object-center"
                      />
                      <div className="w-70">
                        <h1 className="font-semibold truncate">
                          {product?.productId?.productName}
                        </h1>
                        <p>₹ {product?.productId?.productPrice}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                          handleDecreaseQuantity(product?.productId?._id);
                        }}
                      >
                        -
                      </Button>
                      <span>{product?.quantity} </span>
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                          handleIncreaseQuantity(product?.productId?._id);
                        }}
                      >
                        +
                      </Button>
                    </div>
                    <p>
                      ₹ {product?.productId?.productPrice * product.quantity}
                    </p>
                    <p
                      className="text-red-600 flex items-center justify-center gap-2 border rounded-lg p-1 border-gray-300 cursor-pointer"
                      onClick={() => {
                        handleRemoveToCart(product?.productId?._id);
                      }}
                    >
                      {" "}
                      <Trash className="w-4 h-4" /> Remove{" "}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
            {/* order details  */}

            <div>
              <Card className="w-100">
                <CardHeader>
                  <CardTitle>Order Summery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart?.items?.length} items)</span>
                    <span>₹ {cart?.totalPrice?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹ {shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹ {tax.toLocaleString("en-IN")}</span>
                  </div>
                  {/* separator */}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹ {totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="space-y-3 pt-4">
                    <div className="flex space-x-2">
                      <Input placeholder="promo code" />
                      <Button variant="outline">Apply</Button>
                    </div>
                    <Button className="w-full bg-pink-600 cursor-pointer hover:bg-pink-800 uppercase tracking-wide">
                      Place order
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-gray-200 font-semibold text-md cursor-pointer"
                    >
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>
                  <div className="text-sm  text-muted-foreground pt-4">
                    <p>* Free shipping on orders over 199</p>
                    <p>* 30-days return policy</p>
                    <p>* Secure checkout with SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full  ">
          <div className="max-w-7xl mx-auto min-h-[60vh] flex flex-col items-center justify-center ">
            {/* icon  */}
            <div className="bg-pink-100 p-6 rounded-full  ">
              <ShoppingCart className="w-16 h-16  text-pink-600" />
            </div>
            {/* title  */}
            <h1 className="text-2xl font-bold mt-6">Your Cart is Empty</h1>
            <p className="mt-3 text-gray-600">
              Look like you have'nt added anything to your cart yet
            </p>

            <Button
              className="text-blue-600 hover:scale-102 transition duration-300 mt-3  "
              variant="outline"
            >
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
