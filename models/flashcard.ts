import mongoose, { Schema } from "mongoose";
import { IFlashcard } from "../types/flashcard";

const FlashcardSchema: Schema = new Schema({
  listId: { type: String, required: true },
  userId: { type: String, required: true },
  front: { type: String, required: true },
  back: { type: String, required: true },
});

const Flashcard = mongoose.model<IFlashcard>("Flashcard", FlashcardSchema);

export default Flashcard;
