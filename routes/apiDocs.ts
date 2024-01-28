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
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
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
            accessToken: {
              type: "string",
              description: "The access token of your account",
            },
            refreshToken: {
              type: "string",
              description: "The refresh token of your account",
            },
            _id: {
              type: "string",
              description: "The id of your account",
            },
            __v: {
              type: "number",
              description: "The version of your account",
            },
            createdAt: {
              type: "string",
              description: "The time your account was created",
            },
            updatedAt: {
              type: "string",
              description: "The time your account was updated",
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
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            _id: "60f0b0b9e6b3c40015f1b3a5",
            __v: 0,
            createdAt: "2021-07-16T08:08:25.000Z",
            updatedAt: "2021-07-16T08:08:25.000Z",
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
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              description: "The email of your account",
            },
            password: {
              type: "string",
              description: "The password of your account",
            },
          },
          example: {
            email: "dat13102k2@gmail.com",
            password: "123456",
          },
        },
        ResponseError: {
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
        FlashcardList: {
          type: "object",
          required: ["name", "flashcards"],
          properties: {
            name: {
              type: "string",
              description: "The name of the flashcard list",
            },
            flashcards: {
              type: "array",
              description: "The flashcards in the list",
            },
          },
          example: {
            name: "My Flashcard List",
            flashcards: [
              {
                _id: "60f0b0b9e6b3c40015f1b3a5",
                front: "Hello",
                back: "Xin chào",
              },
            ],
          },
        },
        Flashcard: {
          type: "object",
          required: ["front", "back"],
          properties: {
            front: {
              type: "string",
              description: "The front side of the flashcard",
            },
            back: {
              type: "string",
              description: "The back side of the flashcard",
            },
          },
          example: {
            frontSide: "Hello",
            backSide: "Xin chào",
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
