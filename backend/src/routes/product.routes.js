import express from "express";

import { isAuthenticated } from "../middlewares/isauthenticated.js";
import upload from "../middlewares/multer.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { isAdmin } from "./../middlewares/isAdmin.js";

const router = express.Router();

router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  upload.array("images", 5),
  addProduct,
);

router.get("/get-product", getAllProducts);
router.delete("/delete/:productId", isAuthenticated, isAdmin, deleteProduct);
router.put(
  "/update/:productId",
  isAuthenticated,
  isAdmin,
  upload.array("images", 5) ,
  updateProduct,
);

export default router;
