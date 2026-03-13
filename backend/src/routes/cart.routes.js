import express from "express";

import { isAuthenticated } from "../middlewares/isauthenticated.js";
// import { isAdmin } from "./../middlewares/isAdmin.js";
import {
  addToCart,
  getCart,
  removeToCart,
  updateCartQuantity,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/get-cart", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.put("/update", isAuthenticated, updateCartQuantity);
router.delete("remove", isAuthenticated, removeToCart);

export default router;
