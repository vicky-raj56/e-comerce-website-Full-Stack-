import razorpayInstance from "../configs/razorpay.js";
import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";
import crypto from "crypto";
import productModel from "../models/product.model.js";
const createOrder = async (req, res) => {
  try {
    const { products, amount, tax, shipping, currency } = req.body;
    const options = {
      amount: Math.round(Number(amount)),
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);
    // saved order in db

    const newOrder = new orderModel({
      userId: req.user.userId,
      products: products,
      tax,
      shipping,
      currency,
      status: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();
    return res
      .status(200)
      .json({ success: true, order: razorpayOrder, dbOrder: newOrder });
  } catch (error) {
    console.log("createOrder Error :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    } = req.body;
    if (paymentFailed) {
      const order = await orderModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { new: true },
      );
      return res
        .status(400)
        .json({ success: false, message: "Payment Failed", order });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await orderModel.findOneAndUpdate(
        { razorpayOrderid: razorpay_order_id },
        {
          status: "Paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        {
          new: true,
        },
      );
      await cartModel.findOneAndUpdate(
        { userId: req.user.userId },
        { $set: { items: [], totalPrice: 0 } },
      );
      return res
        .status(200)
        .json({ success: true, message: "Payment Successfully", order });
    } else {
      await orderModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { new: true },
      );
      return res
        .status(400)
        .json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("❌error in verifyPayment Error :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export { createOrder, verifyPayment };
