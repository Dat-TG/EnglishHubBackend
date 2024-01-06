require("dotenv").config();
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";

// connections
mongoose
  .connect(process.env.DB!)
  .then(() => {
    console.log("connected to database successfully");
  })
  .catch((e) => {
    console.log("connect to database unsuccessfully, error: ", e);
  });

const app: Express = express();

const port = 3000;

app.get("/", (req: Request, res: Response) => res.send("Hello World!"));

app.listen(port, () => console.log(`Listening on port ${port}!`));
