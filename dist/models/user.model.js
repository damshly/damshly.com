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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.getUser = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class getUser {
}
exports.getUser = getUser;
_a = getUser;
getUser.byId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield database_1.default.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows;
});
getUser.byEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield database_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows;
});
getUser.byUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield database_1.default.query("SELECT * FROM users WHERE username = $1", [username]);
    return rows;
});
class UserModel {
    // ✅ دالة لإنشاء مستخدم جديد مع تخزين كلمة المرور مجزأة
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password_hash } = user;
            if (!password_hash) {
                throw new Error("❌ يجب إدخال كلمة مرور");
            }
            // 🔹 تجزئة كلمة المرور قبل الحفظ
            const saltRounds = 10;
            user.password_hash = yield bcryptjs_1.default.hash(password_hash, saltRounds);
            const { rows } = yield database_1.default.query(`INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email`, [username, email, user.password_hash]);
            return rows[0]; // إرجاع المستخدم الذي تم إنشاؤه
        });
    }
    // ✅ دالة للتحقق من كلمة المرور عند تسجيل الدخول
    static checkPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield getUser.byEmail(email);
            if (!user)
                return false; // المستخدم غير موجود
            const { password_hash } = user[0];
            const isMatch = yield bcryptjs_1.default.compare(password, password_hash);
            return isMatch ? user : false; // إرجاع المستخدم إذا كانت كلمة المرور صحيحة
        });
    }
}
exports.UserModel = UserModel;
