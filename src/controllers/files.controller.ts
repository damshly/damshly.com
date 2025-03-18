import { Request, Response } from "express";
import pool from "../config/database";
import {Account} from "../Repository/accountModel"
export const minio = async (req :Request, res :Response) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: "❌ لم يتم رفع أي ملف" });
      }

      const userId = req.body.userId; 
      if (!userId) {
          return res.status(400).json({ error: "❌ يجب إرسال userId" });
      }

      const imageUrl = (req.file as any).location; 

      await Account.update({ profile_picture: imageUrl }, userId);

      res.json({ success: true, message: "✅ profile picture uploaded successfully", imageUrl });
  } catch (error) {
      console.error("❌ error during profile picture upload", error);
      res.status(500).json({ error: "❌ error during profile picture upload" });
  }
};