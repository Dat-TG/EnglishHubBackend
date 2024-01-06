import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const router = Router();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "English Hub API Documentation",
      version: "0.1.0",
      description:
        "This is API documentation for English Hub, a web application for learning English",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Lê Công Đắt",
        url: "https://github.com/Dat-TG",
        email: "dat13102k2@gmail.com",
      },
    },
    servers: [
      {
        url: `${process.env.SERVER_URL}` || "http://localhost:3000",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            email: {
              type: "string",
              description: "The email of your account",
            },
            name: {
              type: "string",
              description: "The name of your account",
            },
            password: {
              type: "string",
              description: "The hashed password of your account",
            },
            type: {
              type: "string",
              description: "The type of your account",
            },
            avatar: {
              type: "string",
              description: "The avatar of your account",
            },
          },
          example: {
            name: "Lê Công Đắt",
            email: "dat13102k2@gmail.com",
            password:
              "$2y$10$A7UrdJPUrRf33oSLvheWT.0lUbs4UITXwMaiSVAFrUi0R437Yxge6",
            type: "user",
            avatar:
              "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            email: {
              type: "string",
              description: "The email of your account",
            },
            name: {
              type: "string",
              description: "The name of your account",
            },
            password: {
              type: "string",
              description: "The password of your account",
            },
          },
          example: {
            name: "Lê Công Đắt",
            email: "dat13102k2@gmail.com",
            password: "123456",
          },
        },
        RegisterError: {
          type: "object",
          required: ["message"],
          properties: {
            status: {
              type: "number",
              description: "The status code of the error",
            },
            message: {
              type: "string",
              description: "The error message",
            },
          },
          example: {
            status: 400,
            message: "This email was already used",
          },
        },
        ServerError: {
          type: "object",
          required: ["error"],
          properties: {
            status: {
              type: "number",
              description: "The status code of the error",
            },
            error: {
              type: "string",
              description: "The error message",
            },
          },
          example: {
            status: 500,
            error: "Some server error",
          },
        },
      },
    },
  },
  apis: ["./dist/routes/*.js", "./dist/models/*.js"],
};

const specs = swaggerJsdoc(options);
router.use("/", swaggerUi.serve, swaggerUi.setup(specs));

export default router;
