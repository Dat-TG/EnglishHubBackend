import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      user?: string; // Define custom property user
      token?: string; // Define custom property token
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ status: 401, message: "No auth token, access denied" });
    }
    try {
      const isValid = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_PRIVATE_KEY as string
      ) as {
        _id: string;
      };
      const user = await User.findById(isValid._id);
      if (!user) {
        return res
          .status(401)
          .json({ status: 401, message: "No user found, access denied" });
      }
      req.user = isValid._id;
      req.token = token;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          status: 401,
          message: "Token expired, access denied",
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          status: 401,
          message: "Invalid token, access denied",
          details: error.message,
        });
      } else {
        throw error; // Rethrow other errors
      }
    }
  } catch (e) {
    res.status(500).json({ status: 500, error: (e as Error).message });
  }
};

export default auth;
