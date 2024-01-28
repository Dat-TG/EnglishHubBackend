import { IFlashcard } from "./flashcard";
import { DocumentResult } from "./user";

export interface IFlashcardList extends DocumentResult<IFlashcardList> {
  _id: string;
  userId: string;
  name: string;
  flashcards: IFlashcard[];
  __v: number;
}
