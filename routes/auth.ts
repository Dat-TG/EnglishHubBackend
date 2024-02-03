import express, { Request, Response } from "express";

const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const saltRounds = 10;

import User from "../models/user";

// Sign Up
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The authentication API
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: The user was successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 * /auth/login:
 *   post:
 *     summary: Login a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: The user was successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *
 * /auth/refresh:
 *   get:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid refresh token or access token is still valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *
 *
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: 400, message: "This email was already used" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let user = new User({
      email,
      password: hashedPassword,
      name,
    });

    user = await user.save();
    user.accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        type: user.type,
      },
      process.env.ACCESS_TOKEN_PRIVATE_KEY as jwt.Secret,
      { expiresIn: "1d" }
    );
    user.refreshToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        type: user.type,
      },
      process.env.REFRESH_TOKEN_PRIVATE_KEY as jwt.Secret,
      { expiresIn: "30d" }
    );
    user = await user.save();
    res.json(user._doc);
  } catch (e: any) {
    res.status(500).json({ status: 500, error: e.message });
  }
});

//Sign In
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: 400, message: "This account does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 400, message: "Incorrect password" });
    }
    user.accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        type: user.type,
      },
      process.env.ACCESS_TOKEN_PRIVATE_KEY as jwt.Secret,
      { expiresIn: "1d" }
    );
    user.refreshToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        type: user.type,
      },
      process.env.REFRESH_TOKEN_PRIVATE_KEY as jwt.Secret,
      { expiresIn: "30d" }
    );
    user = await user.save();
    res.json(user._doc);
  } catch (e: any) {
    res.status(500).json({ status: 500, error: e.message });
  }
});

// Refresh Token
router.get("/refresh", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.header("Authorization")?.replace("Bearer ", "");
    const user = await User.findOne({ refreshToken }).select(
      "accessToken refreshToken"
    );
    if (!user) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid refresh token" });
    }
    const accessToken = jwt.verify(
      user.accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY as jwt.Secret
    );
    if (accessToken) {
      return res
        .status(400)
        .json({ status: 400, message: "Access token is still valid" });
    }
    user.accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        type: user.type,
      },
      process.env.ACCESS_TOKEN_PRIVATE_KEY as jwt.Secret,
      { expiresIn: "1d" }
    );
    user.refreshToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        type: user.type,
      },
      process.env.REFRESH_TOKEN_PRIVATE_KEY as jwt.Secret,
      { expiresIn: "30d" }
    );
    await user.save();
    res.json(user);
  } catch (e: any) {
    res.status(500).json({ status: 500, error: e.message });
  }
});

export default router;
