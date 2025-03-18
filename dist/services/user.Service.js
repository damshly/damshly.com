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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = exports.getUserData = void 0;
const user_model_1 = require("../models/user.model");
const getUserData = (type, value) => __awaiter(void 0, void 0, void 0, function* () {
    switch (type) {
        case "id":
            return yield user_model_1.getUser.byId(value);
        case "email":
            return yield user_model_1.getUser.byEmail(value);
        case "username":
            return yield user_model_1.getUser.byUsername(value);
        default:
            throw new Error("Invalid search type");
    }
});
exports.getUserData = getUserData;
class UserService {
    static registerUser(username, email, password_hash) {
        return __awaiter(this, void 0, void 0, function* () {
            // التحقق من عدم وجود المستخدم مسبقًا
            const existingUser = yield user_model_1.getUser.byEmail(email);
            // if (existingUser) {
            //     throw new Error("User already exists.");
            // }
            // إنشاء المستخدم الجديد
            return yield user_model_1.UserModel.createUser({
                username,
                email,
                password_hash
            });
        });
    }
}
exports.UserService = UserService;
