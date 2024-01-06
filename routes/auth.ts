import express from "express";

const router = express.Router();
import bcrypt from "bcrypt";
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
 *               $ref: '#/components/schemas/RegisterError'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *
 */
router.post("/register", async (req, res) => {
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
    res.json(user);
  } catch (e: any) {
    res.status(500).json({ status: 500, error: e.message });
  }
});

export default router;
