import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "authentication token is missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(400)
          .json({ success: false, message: "registration token has expired" });
      }
      return res.status(401).json({
        success: false,
        message: "Access token is missing or invalid",
      });
    }
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "user not " });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log("authentication Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
