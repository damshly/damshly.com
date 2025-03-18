"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = __importDefault(require("./users.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const account_routes_1 = __importDefault(require("./account.routes"));
const post_routes_1 = __importDefault(require("./post.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/account", account_routes_1.default);
router.use("/users", users_routes_1.default);
router.use("/posts", post_routes_1.default);
exports.default = router;
