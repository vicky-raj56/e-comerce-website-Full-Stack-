import express from "express";
import { isAuthenticated } from "../middlewares/isauthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { getAllUser } from "../controllers/admin.controller.js";

const router = express.Router();
router.get("/getalluser", isAuthenticated, isAdmin, getAllUser);

export default router;
