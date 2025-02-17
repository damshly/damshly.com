import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { authDocs } from "./authDocs";
import { userDocs } from "./userDocs";
import { accountDocs } from "./accountDocs";
import { postsDocs } from "./poastsDocs"
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for my project"
    },
    servers: [{ url: `${process.env.APP_URL}:${process.env.PORT}` },
              {url:`${process.env.DOMAIN}`}
    ],
    paths: {
      ...authDocs,
      ...accountDocs,
      ...userDocs, 
      ...postsDocs
    }
  },
  apis: []
};


const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger docs available at http://localhost:3000/api-docs");
};
