"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsDocs = void 0;
exports.postsDocs = {
    "/api/posts": {
        post: { summary: "Create a new post", tags: ["Posts"] },
    },
    "/api/posts/{id}": {
        get: { summary: "Get a single post by ID", tags: ["Posts"] },
        put: { summary: "Update a post", tags: ["Posts"] },
        delete: { summary: "Delete a post", tags: ["Posts"] }
    },
    "/api/posts/user/{id}": {
        get: { summary: "Get posts by a specific user", tags: ["Posts"] }
    },
    "/api/posts/{id}/like": {
        post: { summary: "Like a post", tags: ["Posts"] }
    },
    "/api/posts/{id}/comment": {
        post: { summary: "Add a comment to a post", tags: ["Posts"] }
    }
};
