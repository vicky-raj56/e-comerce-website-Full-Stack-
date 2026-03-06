import jwt from "jsonwebtoken";

export async function generateRefreshToken(user) {
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" },
  );

  return token;
}
