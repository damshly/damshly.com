"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authDocs = exports.content = exports.requestBody = void 0;
const requestBody = (properties, requiredFields, isrequired) => {
    return {
        required: isrequired,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties,
                    required: requiredFields
                }
            }
        }
    };
};
exports.requestBody = requestBody;
const content = (properties) => {
    return {
        "application/json": {
            schema: {
                type: "object",
                properties
            }
        }
    };
};
exports.content = content;
exports.authDocs = {
    "/api/auth/register": {
        post: {
            summary: "Register a new user",
            tags: ["Auth"],
            requestBody: (0, exports.requestBody)({
                username: { type: "string" },
                email: { type: "string" },
                password: { type: "string" }
            }, ["username", "email", "password"], true),
            responses: {
                200: {
                    description: "Verification email sent successfully.",
                    content: (0, exports.content)({
                        message: { type: "string", example: "Verification email sent. Please check your inbox." }
                    })
                },
                400: {
                    description: "Invalid data provided.",
                    content: (0, exports.content)({
                        error: { type: "string", example: "nvalid data. Please correct your input." }
                    })
                }
            }
        }
    },
    "/api/auth/passord-reset": { tags: ["Auth"] },
    "/api/auth/login": {
        post: {
            summary: "Login user",
            tags: ["Auth"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: { type: "string" },
                                password: { type: "string" }
                            },
                            required: ["email", "password"]
                        }
                    }
                }
            },
            responses: {
                200: { description: "Login successful" },
                401: { description: "Invalid credentials" }
            }
        }
    },
    "/api/auth/logout": { post: { tags: ["Auth"] } },
    "/api/auth/refresh": {
        post: {
            summary: "Refresh access token",
            tags: ["Auth"],
            responses: {
                200: { description: "Access token refreshed successfully" },
                401: { description: "Unauthorized" }
            }
        }
    },
    "/api/auth/verify-email": { get: { tags: ["Auth"] } }
};
