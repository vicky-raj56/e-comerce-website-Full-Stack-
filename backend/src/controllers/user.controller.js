import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import verifyEmail from "../../emailverify/verifyEmail.js";
import jwt from "jsonwebtoken";
import sessionModel from "../models/session.model.js";
import sendOTPMail from "../../emailverify/sendOTPMail.js";
import { uploadImage } from "../configs/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "user already exits" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      firstName,
      lastName,
      email,
      password: hashPassword,
      role,
    });

    const token = await generateAccessToken(user);

    // res.cookie("token", token);
    verifyEmail(token, email);
    user.token = token;

    const newUser = await user.save();

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      data: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.log("register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization is missing or invalid ",
      });
    }

    let decoded;
    try {
      const token = authHeader.split(" ")[1];

      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "the registration token has expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "token verification failed",
        error: error.message,
      });
    }
    // set data in req.user
    // req.user = decoded;

    // verify user
    const user = await userModel.findOne({ _id: decoded.userId });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "email verify successfully" });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "invalid token ",
      error: error.message,
    });
  }
};

const reVerify = async (req, res) => {
  console.log(req.body);
  try {
    const { email } = req.body;
    if (!email || email === "undefined") {
      return res
        .status(400)
        .json({ success: false, message: "email required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    const token = await generateAccessToken(user);
    verifyEmail(token, email);
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "verification email sent successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error ",
      error: error.message,
    });
  }
};

// Login Controllers

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    //check user avail in bd or not
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });
    }
    if (user.isVerified === false) {
      return res
        .status(400)
        .json({ success: false, message: "verify your account then login " });
    }

    //generate token access token aur refresh token
    const refreshToken = await generateRefreshToken(user._id);
    const accessToken = await generateAccessToken(user);

    user.isLoggedIn = true;
    await user.save();

    //check existing session for same device then yes update otherwise create new session
    const existingDeviceSession = await sessionModel.findOne({
      userId: user._id,
      userAgent: req.headers["user-agent"],
    });
    if (existingDeviceSession) {
      existingDeviceSession.refreshToken = refreshToken;
      existingDeviceSession.ip = req.ip;
      await existingDeviceSession.save();
    } else {
      const sessionCreate = new sessionModel({
        userId: user._id,
        refreshToken: refreshToken,
        ip: req.ip,
        userAgent: req.headers["user-agent"] || "unknown",
      });
      await sessionCreate.save();
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    });

    return res.status(200).json({
      success: true,
      message: `welcome back ${user.firstName}`,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        city: user.city,
        zipCode: user.zipCode,
        _id: user._id,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    console.log("login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error ",
      error: error.message,
    });
  }
};

// logout user
const logout = async (req, res) => {
  try {
    const id = req.user.userId;
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await sessionModel.findOneAndDelete({ refreshToken });
    }
    await userModel.findByIdAndUpdate(id, { isLoggedIn: false });
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ success: true, message: "user logged out successfully" });
  } catch (error) {
    console.log("login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error ",
      error: error.message,
    });
  }
};

// forgotPassword
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    const otp = Math.floor(Math.random() * 900000 + 100000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    await sendOTPMail(otp, email);

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.RESET_PASSWORD_TOKEN,
      { expiresIn: "15m" },
    );
    return res.status(200).json({
      success: true,
      message: "Otp sent to email successfully",
      resetToken,
    });
  } catch (error) {
    console.log("❌forgotPassword Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal sever error",
      error: error.message,
    });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "missing token  please verify email  again",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "invalid token pls email verify again",
      });
    }

    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    if (!otp) {
      return res
        .status(400)
        .json({ success: false, message: "otp is required" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Otp is not generated or already verify",
      });
    }
    if (user.otpExpiry < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "otp has expired pls resend otp" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid otp " });
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "opt verify successfully" });
  } catch (error) {
    console.log("verifyOtp Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: " token has expired pls verify again",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal sever error",
      error: error.message,
    });
  }
};

// resetPassword Password
const resetPassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "missing token  please verify email  again",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "invalid token pls email verify again",
      });
    }
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "all  fields are required" });
    }

    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is not matched",
      });
    }
    const newPasswordHashed = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHashed;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "password change successfully" });
  } catch (error) {
    console.log("changePassword Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: " token has expired pls verify again",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal sever error",
      error: error.message,
    });
  }
};

// find single user
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await userModel
      .findById(id)
      .select("-password -token -otp -otpExpiry");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User found successfully", user });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//  user update their details
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, phoneNo, address, city, zipCode } = req.body;
    const id = req.params.id;
    const imagePath = req.file?.path;

    // Ek update object banaya hu
    const dataToUpdate = {
      ...(firstName && { firstName: firstName }),
      ...(lastName && { lastName }),
      ...(phoneNo && { phoneNo }),
      ...(address && { address }),
      ...(city && { city }),
      ...(zipCode && { zipCode }),
    };

    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (imagePath) {
      if (user.profilePicId) {
        await cloudinary.uploader.destroy(user.profilePicId);
      }
      const imageUrl = await uploadImage(imagePath);
      const profilePic = imageUrl.secure_url;
      const publicId = imageUrl.public_id;
      dataToUpdate.profilePic = profilePic;
      dataToUpdate.profilePicId = publicId;
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(id, dataToUpdate, { returnDocument: "after" })
      .select("-password -token -otp -otpExpiry");
    console.log("update", updatedUser);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "refresh token is missing, please login again",
      });
    }
    const session = await sessionModel.findOne({ refreshToken });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "invalid refresh token, please login again",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        await sessionModel.findByIdAndDelete(session._id);
        return res.status(401).json({
          success: false,
          message: "refresh token has expired, please login again",
        });
      }
      return res.status(401).json({
        success: false,
        message: "invalid refresh token, please login again",
        error: error.message,
      });
    }
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user not found, please login again",
      });
    }
    const newAccessToken = await generateAccessToken(user);

    const newRefreshToken = await generateRefreshToken(user._id);

    session.refreshToken = newRefreshToken;
    session.ip = req.ip;
    session.userAgent = req.headers["user-agent"] || "unknown";
    await session.save();
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log("refreshToken Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const logoutAllDevice = async (req, res) => {
  try {
      const userId = req.user.userId;
      await sessionModel.deleteMany({ userId });
      await userModel.findByIdAndUpdate(userId, { isLoggedIn: false });
      res.clearCookie("refreshToken");
      return res.status(200).json({
        success: true,
        message: "Logged out from all devices successfully",
      });

    
  } catch (error) {
    console.log("logoutAllDevice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });

    
  }
};

export {
  register,
  verify,
  reVerify,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getUserById,
  updateUser,
  refreshToken,
  logoutAllDevice
};
