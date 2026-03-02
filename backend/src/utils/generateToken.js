import jwt from "jsonwebtoken";

export function generateToken(user) {
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" },
  );

  return token;
}
