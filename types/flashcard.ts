import { DocumentResult } from "./user";

export interface IFlashcard extends DocumentResult<IFlashcard> {
  _id: string;
  listId: string;
  userId: string;
  front: string;
  back: string;
  __v: number;
}
