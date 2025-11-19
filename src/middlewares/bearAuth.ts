import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userRole } from "../drizzle/schema";

dotenv.config();

// JWT payload type
type DecodedToken = {
  userId: string; // UUID
  regNo: string;
  role: typeof userRole.enumValues[number]; // 'voter' | 'admin' | 'Dean_of_Science' | ...
  name: string;
  exp: number;
};

// Extend Express Request with user payload
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

// Token verification helper
export const verifyToken = async (
  token: string,
  secret: string
): Promise<DecodedToken | null> => {
  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
};

// Auth middleware factory
export const authMiddleware = (
  allowedRoles: typeof userRole.enumValues[number][] | "any" = "any"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Authorization token is missing" });
    }

    const decodedToken = await verifyToken(token, process.env.JWT_SECRET!);
    if (!decodedToken) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    if (
      allowedRoles === "any" ||
      allowedRoles.includes(decodedToken.role)
    ) {
      req.user = decodedToken;
      return next();
    }

    return res.status(403).json({
      error: "Forbidden: You do not have permission to access this resource",
    });
  };
};

// Role-specific middleware
export const adminAuth = authMiddleware(["admin"]);
export const voterAuth = authMiddleware(["voter"]);
export const deanAuth = authMiddleware([
  "Dean_of_Science",
  "Dean_of_Education",
  "Dean_of_Business",
  "Dean_of_Humanities_and_Developmental_Studies",
  "Dean_of_TVET",
  "Dean_of_Students",
]);
export const anyAuthenticatedUser = authMiddleware("any");
