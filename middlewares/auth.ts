import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

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
    const isValid = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_PRIVATE_KEY as string
    ) as {
      _id: string;
    };
    if (!isValid) {
      return res.status(401).json({
        status: 401,
        message: "Token verification failed, access denied",
      });
    }
    req.user = isValid._id;
    req.token = token;
    next();
  } catch (e) {
    res.status(500).json({ status: 500, error: (e as Error).message });
  }
};

export default auth;
