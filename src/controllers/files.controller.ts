import { Request, Response } from "express";
import pool from "../config/database";
import {Account} from "../models/accountModel"
export const minio = async (req :Request, res :Response) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: "❌ لم يتم رفع أي ملف" });
      }

      const userId = req.body.userId; // تأكد من إرسال userId مع الطلب
      if (!userId) {
          return res.status(400).json({ error: "❌ يجب إرسال userId" });
      }

      const imageUrl = (req.file as any).location; // رابط الصورة في MinIO

      // 🔹 تحديث الصورة في قاعدة البيانات
      await Account.update({ profile_picture: imageUrl }, userId);

      res.json({ success: true, message: "✅ تم رفع الصورة بنجاح", imageUrl });
  } catch (error) {
      console.error("❌ خطأ أثناء رفع الصورة:", error);
      res.status(500).json({ error: "❌ حدث خطأ أثناء رفع الصورة" });
  }
};