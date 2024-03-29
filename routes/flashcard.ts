import express, { Request, Response } from "express";
import auth from "../middlewares/auth";
import FlashcardList from "../models/flashcard_list";
import Flashcard from "../models/flashcard";
import mongoose from "mongoose";

/**
 * @swagger
 * tags:
 *   name: Flashcard
 *   description: Flashcard operations
 */

const router = express.Router();

/**
 * @swagger
 * /flashcard:
 *   post:
 *     summary: Create a new flashcard
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
 *               listId:
 *                 type: string
 *               front:
 *                 type: string
 *               back:
 *                 type: string
 *             example:
 *               listId: 123456a7890b
 *               front: Front of the flashcard
 *               back: Back of the flashcard
 *     responses:
 *       '201':
 *         description: Flashcard created successfully
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
 *                   example: Create flashcard successfully
 *       '400':
 *         description: Flashcard list not found
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
 *                   example: Flashcard list not found
 */

router.post("/", auth, async (req: Request, res: Response) => {
  try {
    const { listId, front, back } = req.body as {
      listId: string;
      front: string;
      back: string;
    };
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid id",
      });
    }
    const flashcardList = await FlashcardList.findById(listId);
    if (!flashcardList) {
      return res.status(400).json({
        status: 400,
        message: "Flashcard list not found",
      });
    }
    const flashcard = new Flashcard({ front, back, listId, userId: req.user });
    await flashcard.save();
    flashcardList.flashcards.push(flashcard._doc);
    await flashcardList.save();
    res.status(201).json({
      status: 201,
      message: "Create flashcard successfully",
      data: flashcard._doc,
    });
  } catch (e) {
    res.status(500).json({ status: 500, error: (e as Error).message });
  }
});

/**
 * @swagger
 * /flashcard/create-flashcards:
 *   post:
 *     summary: Create a new flashcard list with multiple flashcards
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
 *               listId:
 *                 type: string
 *               flashcards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     front:
 *                       type: string
 *                     back:
 *                       type: string
 *             example:
 *               listId: 123456a7890b
 *               flashcards:
 *                 - front: Front of flashcard 1
 *                   back: Back of flashcard 1
 *                 - front: Front of flashcard 2
 *                   back: Back of flashcard 2
 *     responses:
 *       '201':
 *         description: Flashcards created successfully
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
 *                   example: Create flashcards successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       front:
 *                         type: string
 *                       back:
 *                         type: string
 *       '400':
 *         description: Flashcard list not found
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
 *                   example: Flashcard list not found
 */

router.post("/create-flashcards", auth, async (req: Request, res: Response) => {
  try {
    const { listId, flashcards } = req.body as {
      listId: string;
      flashcards: { front: string; back: string }[];
    };
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid id",
      });
    }
    const flashcardList = await FlashcardList.findById(listId);
    if (!flashcardList) {
      return res.status(400).json({
        status: 400,
        message: "Flashcard list not found",
      });
    }
    const newFlashcards = [];
    for (const flashcard of flashcards) {
      const newFlashcard = new Flashcard({
        front: flashcard.front,
        back: flashcard.back,
        listId,
        userId: req.user,
      });
      await newFlashcard.save();
      newFlashcards.push(newFlashcard._doc);
    }
    flashcardList.flashcards.push(...newFlashcards);
    await flashcardList.save();
    res.status(201).json({
      status: 201,
      message: "Create flashcards successfully",
      data: newFlashcards,
    });
  } catch (e) {
    res.status(500).json({ status: 500, error: (e as Error).message });
  }
});

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

router.post("/list", auth, async (req: Request, res: Response) => {
  try {
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
  } catch (e) {
    res.status(500).json({ status: 500, error: (e as Error).message });
  }
});

/**
 * @swagger
 * /flashcard/card/{id}:
 *   get:
 *     summary: Get a flashcard by id
 *     tags: [Flashcard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the flashcard
 *     responses:
 *       '200':
 *         description: Flashcard found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60f7a5a1a9e7e40015c0e4a5
 *                 front:
 *                   type: string
 *                   example: Front of the flashcard
 *                 back:
 *                   type: string
 *                   example: Back of the flashcard
 *
 *       '400':
 *         description: Invalid id or flashcard not found
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
 *                   example: Invalid id or flashcard not found
 */

router.get("/card/:id", auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid id",
      });
    }
    const flashcard = await Flashcard.findById(id);
    if (!flashcard) {
      return res.status(400).json({
        status: 400,
        message: "Flashcard not found",
      });
    }
    res.json(flashcard._doc);
  } catch (e) {
    res.status(500).json({ status: 500, error: (e as Error).message });
  }
});

/**
 * @swagger
 * /flashcard/list/{id}:
 *   get:
 *     summary: Get a flashcard list by id
 *     tags: [Flashcard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the flashcard list
 *     responses:
 *       '200':
 *         description: Flashcard list found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60f7a5a1a9e7e40015c0e4a5
 *                 name:
 *                   type: string
 *                   example: My Flashcard List
 *       '400':
 *         description: Invalid id or flashcard list not found
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
 *                   example: Invalid id or flashcard list not found
 */

router.get("/list/:id", auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid id",
      });
    }
    const flashcardList = await FlashcardList.findById(id);
    if (!flashcardList) {
      return res.status(400).json({
        status: 400,
        message: "Flashcard list not found",
      });
    }
    res.json(flashcardList._doc);
  } catch (e) {
    res.status(500).json({ status: 500, error: (e as Error).message });
  }
});

/**
 * @swagger
 * /flashcard/card/{id}:
 *   patch:
 *     summary: Update a flashcard by id
 *     tags: [Flashcard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the flashcard
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 front:
 *                   type: string
 *                   example: Updated front of the flashcard
 *                 back:
 *                   type: string
 *                   example: Updated back of the flashcard
 *     responses:
 *       '200':
 *         description: Flashcard updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60f7a5a1a9e7e40015c0e4a5
 *                 front:
 *                   type: string
 *                   example: Updated front of the flashcard
 *                 back:
 *                   type: string
 *                   example: Updated back of the flashcard
 *       '400':
 *         description: Invalid id or flashcard not found
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
 *                   example: Invalid id or flashcard not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: Internal server error message
 */

router.patch("/card/:id", auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid id",
      });
    }
    let flashcard = await Flashcard.findById(id);
    if (!flashcard) {
      return res.status(400).json({
        status: 400,
        message: "Flashcard not found",
      });
    }
    const { front, back } = req.body as { front: string; back: string };
    if (!front || !back) {
      return res.status(400).json({
        status: 400,
        message: "Front or back is missing",
      });
    }
    flashcard.front = front;
    flashcard.back = back;
    await flashcard.save();
    const flashcardList = await FlashcardList.findById(flashcard.listId);
    if (!flashcardList) {
      return res.status(400).json({
        status: 400,
        message: "Flashcard list of this flashcard not found",
      });
    }
    const index = flashcardList.flashcards.findIndex(
      (f) => f._id.toString() === id
    );
    flashcardList.flashcards[index] = flashcard;
    await flashcardList.save();
    res.json({
      status: 200,
      message: "Flashcard updated successfully",
      data: flashcard._doc,
    });
  } catch (e) {
    res.status(500).json({ status: 500, error: (e as Error).message });
  }
});

/**
 * @swagger
 * /flashcard/update-flashcards:
 *   patch:
 *     summary: Update multiple flashcards
 *     description: Update the front and back of multiple flashcards
 *     tags:
 *       - Flashcard
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flashcards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the flashcard
 *                     front:
 *                       type: string
 *                       description: The updated front of the flashcard
 *                     back:
 *                       type: string
 *                       description: The updated back of the flashcard
 *                     listId:
 *                       type: string
 *                       description: The ID of the flashcard list
 *             example:
 *               flashcards:
 *                 - _id: "flashcardId1"
 *                   front: "Updated front 1"
 *                   back: "Updated back 1"
 *                   listId: "flashcardListId1"
 *                 - _id: "flashcardId2"
 *                   front: "Updated front 2"
 *                   back: "Updated back 2"
 *                   listId: "flashcardListId2"
 *     responses:
 *       '200':
 *         description: Flashcards updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Flashcards updated successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the flashcard
 *                       front:
 *                         type: string
 *                         description: The updated front of the flashcard
 *                       back:
 *                         type: string
 *                         description: The updated back of the flashcard
 *               example:
 *                 status: 200
 *                 message: Flashcards updated successfully
 *                 data:
 *                   - _id: "flashcardId1"
 *                     front: "Updated front 1"
 *                     back: "Updated back 1"
 *                   - _id: "flashcardId2"
 *                     front: "Updated front 2"
 *                     back: "Updated back 2"
 *       '400':
 *         description: Flashcard list of one or more flashcards not found
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
 *                   example: Flashcard list of one or more flashcards not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: Internal server error message
 */

router.patch(
  "/update-flashcards",
  auth,
  async (req: Request, res: Response) => {
    try {
      const { flashcards } = req.body as {
        flashcards: {
          _id: string;
          front: string;
          back: string;
          listId: string;
        }[];
      };
      const flashcardList = await FlashcardList.findById(flashcards[0].listId);
      if (!flashcardList) {
        return res.status(400).json({
          status: 400,
          message: "Flashcard list of this flashcard not found",
        });
      }
      for (const flashcard of flashcards) {
        const flashcardDb = await Flashcard.findById(flashcard._id);
        if (!flashcardDb) {
          continue;
        }
        flashcardDb.front = flashcard.front;
        flashcardDb.back = flashcard.back;
        await flashcardDb.save();
        const index = flashcardList.flashcards.findIndex(
          (f) => f._id.toString() === flashcard._id
        );
        flashcardList.flashcards[index].front = flashcard.front;
        flashcardList.flashcards[index].back = flashcard.back;
      }
      await flashcardList.save();
      res.json({
        status: 200,
        message: "Flashcards updated successfully",
        data: flashcards,
      });
    } catch (e) {
      res.status(500).json({ status: 500, error: (e as Error).message });
    }
  }
);

/**
 * @swagger
 * /flashcard/list/{id}:
 *   patch:
 *     summary: Update a flashcard list
 *     description: Update the name of a flashcard list by its ID
 *     tags:
 *       - Flashcard
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the flashcard list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated flashcard list name
 *     responses:
 *       '200':
 *         description: Flashcard list updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Flashcard list updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/FlashcardList'
 *       '400':
 *         description: Invalid id or flashcard list not found
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
 *                   example: Invalid id or flashcard list not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: Internal server error message
 */

router.patch("/list/:id", auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid id",
      });
    }
    const { name } = req.body as { name: string };
    if (!name) {
      return res.status(400).json({
        status: 400,
        message: "Name is missing",
      });
    }
    let flashcardList = await FlashcardList.findById(id);
    if (!flashcardList) {
      return res.status(400).json({
        status: 400,
        message: "Flashcard list not found",
      });
    }
    flashcardList.name = name;
    await flashcardList.save();
    res.json({
      status: 200,
      message: "Flashcard list updated successfully",
      data: flashcardList._doc,
    });
  } catch (e) {
    res.status(500).json({ status: 500, error: (e as Error).message });
  }
});

/**
 * @swagger
 * /flashcard/card/{id}:
 *   delete:
 *     summary: Delete a flashcard
 *     tags:
 *       - Flashcard
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the flashcard
 *     responses:
 *       '200':
 *         description: Flashcard deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Flashcard deleted successfully
 *       '400':
 *         description: Invalid id or flashcard not found
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
 *                   example: Invalid id or flashcard not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: Internal server error message
 */

router.delete("/card/:id", auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid id",
      });
    }
    const flashcard = await Flashcard.findById(id);
    if (!flashcard) {
      return res.status(400).json({
        status: 400,
        message: "Flashcard not found",
      });
    }
    await flashcard.deleteOne();
    const flashcardList = await FlashcardList.findById(flashcard.listId);
    if (!flashcardList) {
      return res.status(400).json({
        status: 400,
        message: "Flashcard list of this flashcard not found",
      });
    }
    flashcardList.flashcards = flashcardList.flashcards.filter(
      (f) => f._id.toString() !== id
    );
    await flashcardList.save();
    res.json({
      status: 200,
      message: "Flashcard deleted successfully",
    });
  } catch (e) {
    res.status(500).json({ status: 500, error: (e as Error).message });
  }
});

/**
 * @swagger
 * /flashcard/delete-flashcards:
 *   delete:
 *     summary: Delete multiple flashcards
 *     tags:
 *       - Flashcard
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flashcardIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               flashcardIds: ["id1", "id2"]
 *     responses:
 *       '200':
 *         description: Flashcards deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Flashcards deleted successfully
 *       '400':
 *         description: Flashcard list of these flashcards not found
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
 *                   example: Flashcard list of these flashcards not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: Internal server error message
 */

router.delete(
  "/delete-flashcards",
  auth,
  async (req: Request, res: Response) => {
    try {
      const { flashcardIds } = req.body as { flashcardIds: string[] };
      const flashcards = await Flashcard.find({ _id: { $in: flashcardIds } });
      const flashcardList = await FlashcardList.findById(flashcards[0].listId);
      if (!flashcardList) {
        return res.status(400).json({
          status: 400,
          message: "Flashcard list of these flashcard not found",
        });
      }
      flashcardList.flashcards = flashcardList.flashcards.filter(
        (f) => !flashcardIds.includes(f._id.toString())
      );
      await flashcardList.save();
      await Flashcard.deleteMany({ _id: { $in: flashcardIds } });
      res.json({
        status: 200,
        message: "Flashcards deleted successfully",
      });
    } catch (e) {
      res.status(500).json({ status: 500, error: (e as Error).message });
    }
  }
);

/**
 * @swagger
 * /flashcard/list/{id}:
 *   delete:
 *     summary: Delete a flashcard list
 *     tags:
 *       - Flashcard
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the flashcard list
 *     responses:
 *       '200':
 *         description: Flashcard list deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Flashcard list deleted successfully
 *       '400':
 *         description: Invalid id or flashcard list not found
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
 *                   example: Invalid id or flashcard list not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: Internal server error message
 */

router.delete("/list/:id", auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid id",
      });
    }
    const flashcardList = await FlashcardList.findById(id);
    if (!flashcardList) {
      return res.status(400).json({
        status: 400,
        message: "Flashcard list not found",
      });
    }
    for (const flashcard of flashcardList.flashcards) {
      await Flashcard.findByIdAndDelete(flashcard._id);
    }
    await flashcardList.deleteOne();
    res.json({
      status: 200,
      message: "Flashcard list deleted successfully",
    });
  } catch (e) {
    res.status(500).json({ status: 500, error: (e as Error).message });
  }
});

export default router;
