import jwt from "jsonwebtoken";
import "dotenv/config";

const { JWT_SECRET } = process.env;
export const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res.status(401).json({ error: "Access denied, token missing!" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token invalid or expired" });
    req.userId = decoded.userId;
    next();
  });
};
