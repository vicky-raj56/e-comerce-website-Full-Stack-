import jwt from "jsonwebtoken";

export async function generateToken(user) {
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "10m" },
  );

  return token;
}
