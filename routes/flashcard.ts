import express, { Request, Response } from "express";
import auth from "../middlewares/auth";
import FlashcardList from "../models/flashcard_list";

/**
 * @swagger
 * tags:
 *   name: Flashcard
 *   description: Flashcard operations
 */

/**
 * @swagger
 * /flashcard/list:
 *   post:
 *     summary: Create a new flashcard list
 *     tags: [Flashcard]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: My Flashcard List
 *     responses:
 *       '201':
 *         description: Flashcard list created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Create flashcard list successfully
 *       '400':
 *         description: Flashcard list with the same name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Flashcard list with this name already exists
 */

const router = express.Router();

router.post("/list", auth, async (req: Request, res: Response) => {
  const { name } = req.body as { name: string };
  const oldFlashcardList = await FlashcardList.findOne({
    userId: req.user,
    name,
  });
  if (oldFlashcardList) {
    return res.status(400).json({
      status: 400,
      message: "Flashcard list with this name already exists",
    });
  }
  const flashcardList = new FlashcardList({
    userId: req.user,
    name,
    flashcards: [],
  });
  await flashcardList.save();
  res.status(201).json({
    status: 201,
    message: "Create flashcard list successfully",
    data: flashcardList._doc,
  });
});

export default router;
