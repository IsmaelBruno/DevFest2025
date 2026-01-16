import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void | undefined => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(403).json({ message: "Accès refusé" }).end();
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
     res.status(401).json({ message: "Token invalide" }).end();
     return;
  }

  (req as any).user = decoded;
  next();
};
