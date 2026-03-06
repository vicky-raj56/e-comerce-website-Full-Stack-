import userModel from "../models/user.model.js";
export const isAdmin = async (req, res, next) => {
  try {
    const id = req.user.userId;

    const user = await userModel.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 3. Check karein ki kya role 'admin' hai
    // Hum yahan string "admin" se compare kar rahe hain, kisi variable se nahi
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied: You are not an Admin",
      });
    }

    // Agar admin hai, toh agle function (controller) par bhejo
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in Admin Check",
    });
  }
};
