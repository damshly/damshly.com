"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET;
class Auth {
    static Maketoken(registerBody, expiresIn) {
        const token = jsonwebtoken_1.default.sign(registerBody, jwtSecret, { expiresIn: expiresIn });
        return token;
    }
}
exports.default = Auth;
