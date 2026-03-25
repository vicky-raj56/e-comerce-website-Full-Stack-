import express from "express";
import {
  resetPassword,
  forgotPassword,
  getUserById,
  login,
  logout,
  register,
  reVerify,
  updateUser,
  verify,
  verifyOtp,
  refreshToken,
  logoutAllDevice,
  getAllUser,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isauthenticated.js";
import upload from "../middlewares/multer.js";
import { isAdmin } from "./../middlewares/isAdmin.js";

const router = express.Router();

router.post("/signup", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

router.post("/logout", isAuthenticated, logout);
router.get("/profile/:id", isAuthenticated, getUserById);
router.put(
  "/profile/:id",
  isAuthenticated,
  upload.single("profilePic"),
  updateUser,
);
router.get("/get-all", isAuthenticated, isAdmin, getAllUser);
router.post("/refresh-token", refreshToken);
router.post("/logout-all-devices", isAuthenticated, logoutAllDevice);
export default router;
