import mongoose, { Schema } from "mongoose";
import Flashcard from "./flashcard";
import { IFlashcardList } from "../types/flashcard_list";

const FlashcardSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  flashcards: [Flashcard.schema],
});

const FlashcardList = mongoose.model<IFlashcardList>(
  "FlashcardList",
  FlashcardSchema
);
export default FlashcardList;
