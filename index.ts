require("dotenv").config();
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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
import { apiDocsRouter, authRouter } from "./routes";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.use("/auth", authRouter);
app.use("/api-docs", apiDocsRouter);

app.listen(port, () => console.log(`Listening on port ${port}!`));
