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
exports.Account = void 0;
const database_1 = __importDefault(require("../config/database"));
class Account {
    static update(columns, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowedKeys = new Set([
                "username",
                "first_name",
                "last_name",
                "date_of_birth",
                "bio",
                "profile_picture",
                "location"
            ]);
            const keys = [];
            const values = [];
            // تصفية المفاتيح المسموح بها فقط
            Object.entries(columns).forEach(([key, value], index) => {
                if (allowedKeys.has(key)) {
                    keys.push(`${key} = $${keys.length + 1}`);
                    values.push(value);
                }
            });
            // منع تشغيل استعلام UPDATE فارغ
            if (keys.length === 0) {
                throw new Error("لم يتم إرسال بيانات صحيحة للتحديث");
            }
            // بناء الاستعلام
            const query = `
            UPDATE users 
            SET ${keys.join(", ")}
            WHERE id = $${values.length + 1} 
            RETURNING *;
        `;
            // تنفيذ الاستعلام
            yield database_1.default.query(query, [...values, id]);
            const { rows } = yield database_1.default.query("SELECT id, username, email, first_name, last_name, date_of_birth, bio, updated_at, status, account_type, is_verified, profile_picture, location FROM users WHERE id = $1", [id]);
            return rows[0]; // إرجاع المستخدم بعد التحديث
        });
    }
}
exports.Account = Account;
_a = Account;
Account.byId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield database_1.default.query("SELECT id, username, email, first_name, last_name, date_of_birth, bio, updated_at, status, account_type, is_verified, profile_picture, location FROM users WHERE id = $1", [id]);
    return rows[0]; // إرجاع المستخدم الواحد فقط
});
