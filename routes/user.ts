import express, { Request, Response } from "express";
import User from "../models/user";
import auth from "../middlewares/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user API
 * /user/profile:
 *   get:
 *     summary: Get user info
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Get user info successfully
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
 */

// Get user data
router.get("/profile", auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user);
    res.json({ ...user?._doc, token: req.token });
  } catch (e) {
    res.status(500).json({ status: 500, error: (e as Error).message });
  }
});

export default router;
