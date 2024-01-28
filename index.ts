require("dotenv").config();
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";

// connections
mongoose
  .connect(process.env.DB!)
  .then(() => {
    console.log("connected to database successfully");
  })
  .catch((e) => {
    console.log("connect to database unsuccessfully, error: ", e);
  });

// import routers
import {
  apiDocsRouter,
  authRouter,
  flashcardRouter,
  userRouter,
} from "./routes";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.ALLOW_ORIGINS?.split(",") || "*",
  })
);

const port = process.env.PORT || 3000;

app.use("/auth", authRouter);
app.use("/api-docs", apiDocsRouter);
app.use("/user", userRouter);
app.use("/flashcard", flashcardRouter);

app.listen(port, () => console.log(`Listening on port ${port}!`));
