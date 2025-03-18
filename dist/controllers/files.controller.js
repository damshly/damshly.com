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
exports.minio = void 0;
const accountModel_1 = require("../models/accountModel");
const minio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "❌ لم يتم رفع أي ملف" });
        }
        const userId = req.body.userId; // تأكد من إرسال userId مع الطلب
        if (!userId) {
            return res.status(400).json({ error: "❌ يجب إرسال userId" });
        }
        const imageUrl = req.file.location; // رابط الصورة في MinIO
        // 🔹 تحديث الصورة في قاعدة البيانات
        yield accountModel_1.Account.update({ profile_picture: imageUrl }, userId);
        res.json({ success: true, message: "✅ تم رفع الصورة بنجاح", imageUrl });
    }
    catch (error) {
        console.error("❌ خطأ أثناء رفع الصورة:", error);
        res.status(500).json({ error: "❌ حدث خطأ أثناء رفع الصورة" });
    }
});
exports.minio = minio;
