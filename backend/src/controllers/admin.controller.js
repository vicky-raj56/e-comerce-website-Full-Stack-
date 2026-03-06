import userModel from "../models/user.model.js";

//  get all user only admin can access iske liye main seperate isAdmin middleware banaya =check krne ke liye

const getAllUser = async (req, res) => {
  try {
    const allUsers = await userModel.find({}).select("-password");

    if (allUsers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }

    return res.status(200).json({
      success: true,
      message: "all data fatched successfully",
      users: allUsers,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export { getAllUser };
