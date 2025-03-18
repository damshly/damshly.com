"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostQuerys = void 0;
const database_1 = __importDefault(require("../config/database"));
class PostQuerys {
    static createPost(user_id, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield database_1.default.query("INSERT INTO posts (user_id, title, description) VALUES ($1, $2, $3) RETURNING *", [user_id, title, description]);
            return rows[0];
        });
    }
    static addSection(post_id, section_type, title, description, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const sectionValues = [
                [post_id, section_type, title, description, position],
            ];
            const { rows } = yield database_1.default.query(`INSERT INTO sections (post_id, section_type, title, description, position)
             VALUES ($1, $2, $3, $4, $5)`, sectionValues);
            return rows[0];
        });
    }
}
exports.PostQuerys = PostQuerys;
