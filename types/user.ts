interface DocumentResult<T> {
  _doc: T;
}

export interface IUser extends DocumentResult<IUser> {
  _id: string;
  name: string;
  email: string;
  password: string;
  type: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
