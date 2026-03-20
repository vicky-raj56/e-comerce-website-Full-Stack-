import jwt from "jsonwebtoken";

async function generateAccessToken(user) {
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE },
  );

  return token;
}

async function generateRefreshToken(id) {
  const token = jwt.sign({ userId: id }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
  });

  return token;
}

export { generateAccessToken, generateRefreshToken };
