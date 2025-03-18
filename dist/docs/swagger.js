"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const authDocs_1 = require("./authDocs");
const userDocs_1 = require("./userDocs");
const accountDocs_1 = require("./accountDocs");
const poastsDocs_1 = require("./poastsDocs");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "API documentation for my project"
        },
        servers: [{ url: `${process.env.APP_URL}:${process.env.PORT}` },
            { url: `${process.env.DOMAIN}` }
        ],
        paths: Object.assign(Object.assign(Object.assign(Object.assign({}, authDocs_1.authDocs), accountDocs_1.accountDocs), userDocs_1.userDocs), poastsDocs_1.postsDocs)
    },
    apis: []
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log("📄 Swagger docs available at http://localhost:3000/api-docs");
};
exports.setupSwagger = setupSwagger;
