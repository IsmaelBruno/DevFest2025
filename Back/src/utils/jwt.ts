import jwt from "jsonwebtoken";

const SECRET_KEY = "4f7b6d3a9f1e1a5b3c2d8e7f6a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b"; // Stocke cette clé dans une variable d’environnement

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
