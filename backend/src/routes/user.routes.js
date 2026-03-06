import express from "express";
import {
  changePassword,
  forgotPassword,
  getUserById,
  login,
  logout,
  register,
  reVerify,
  updateUser,
  verify,
  verifyOtp,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isauthenticated.js";

const router = express.Router();

router.post("/signup", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);

router.post("/logout", isAuthenticated, logout);
router.post("/forgot-password", isAuthenticated, forgotPassword);
router.post("/verify-otp", isAuthenticated, verifyOtp);
router.post("/change-password", isAuthenticated, changePassword);
router.put("/updateuser/:id", isAuthenticated, updateUser);
router.get("/getuser/:id", isAuthenticated, getUserById);
export default router;
