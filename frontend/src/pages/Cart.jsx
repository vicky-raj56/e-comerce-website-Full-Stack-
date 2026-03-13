import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useSelector } from "react-redux";
import userLogo from "../../public/user.png";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

function Cart() {
  const { cart } = useSelector((state) => state.cart);

  const subTotal = cart.totalPrice;
  const shipping = subTotal > 199 ? 0 : 10;
  const tax = subTotal*0.05  //5%v tax
  const totalAmount = subTotal + shipping + tax

  return (
    <div className="bg-gray-50 min-h-screen">
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
                    <div className="flex items-center gap-2 w-87.5">
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
                      <Button variant="outline" className="cursor-pointer">
                        -
                      </Button>
                      <span>{product?.quantity} </span>
                      <Button variant="outline" className="cursor-pointer">
                        +
                      </Button>
                    </div>
                    <p>
                      ₹ {product?.productId?.productPrice * product.quantity}
                    </p>
                    <p className="text-red-600 flex items-center justify-center gap-2 border rounded-lg p-1 border-gray-300 cursor-pointer">
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
                    <Separator/>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹ {totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="space-y-3 pt-4">
                  <div className="flex space-x-2">
                    <Input placeholder="promo code"/>
                    <Button variant="outline">Apply</Button>
                  </div>
                  <Button className="w-full bg-pink-600 cursor-pointer hover:bg-pink-800">Place order</Button>
                </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Cart;
