import { Request, Response } from "express";
import { PostModel } from "../models/postsModel";
export class postController {
  
  static async getPostInfoById(req: Request, res: Response) {
    try {
      const post_id = parseInt(req.params.id);

      if (isNaN(post_id)) {
        res.status(400).json({ error: "❌ معرف المنشور غير صالح" });
        return 
      }

      // جلب بيانات المنشور فقط
      const post = await PostModel.getPostById(post_id);
      if (!post) {
        res.status(404).json({ error: "❌ المنشور غير موجود" });
        return 
      }

      res.status(200).json({ post });
    } catch (error) {
      console.error("❌ خطأ أثناء جلب معلومات المنشور:", error);
      res.status(500).json({ error: "❌ فشل في جلب البيانات" });
    }
  }
  static async getPostById(req: Request, res: Response) {
    try {
      const post_id = parseInt(req.params.id);

      if (isNaN(post_id)) {
        res.status(400).json({ error: "❌ معرف المنشور غير صالح" });
        return 
      }

      // جلب بيانات المنشور
      const post = await PostModel.getPostById(post_id);
      if (!post) {
        res.status(404).json({ error: "❌ المنشور غير موجود" });
        return 
      }

      // جلب أقسام المنشور
      const sections = await PostModel.getPostSections(post_id);

      res.status(200).json({ post, sections });
    } catch (error) {
      console.error("❌ خطأ أثناء جلب المنشور:", error);
      res.status(500).json({ error: "❌ فشل في جلب البيانات" });
    }
  }  

  static async getPostsInfo(req: Request, res: Response) {
    try {
      // جلب جميع المنشورات بدون الأقسام
      const posts = await PostModel.getAllPosts(); 
  
      res.status(200).json({ posts });
    } catch (error) {
      console.error("❌ خطأ أثناء جلب المنشورات:", error);
      res.status(500).json({ error: "❌ فشل في جلب البيانات" });
    }
  }
  
  // static getCommentsByPostId = (req: Request, res: Response) => {}
  
  static getAllUserPosts = (req: Request, res: Response) => {};

  // static getPosrtEnsights = (req: Request, res: Response) => {}
};

export class postActionController {
  static async makePost(req: Request, res: Response) {
    try {
        const user_id: number = (req as any).user.id;
        let { title, description, visibility, sections } = req.body;
        console.log(req.body.sections[0].metadata);
        
        console.log(req.body, user_id);
        
        if (!user_id || !title || !sections || !Array.isArray(sections)) {
            res.status(400).json({ error: "❌ البيانات غير مكتملة" });
            return;
        }

        // تأكد من أن visibility يحتوي على قيمة صحيحة
        visibility = typeof visibility === "string" ? visibility.replace(/^"(.*)"$/, "$1") : "public";
        console.log("Visibility after cleaning:", visibility);

        // إدخال المنشور إلى قاعدة البيانات
        const post_id = await PostModel.createPost(user_id, title, description, visibility);
        await PostModel.addSections(post_id, sections);

        res.status(201).json({ message: "✅ المنشور تم حفظه بنجاح!", post_id });
    } catch (error) {
        console.error("❌ خطأ أثناء إدخال البيانات:", error);
        res.status(500).json({ error: "❌ فشل في إدخال البيانات" });
    }

}
  
  // static editPost = (req: Request, res: Response) => {}

  static deletePost = (req: Request, res: Response) => {}

  // static likePost = (req: Request, res: Response) => {}

  // static dislikePost = (req: Request, res: Response) => {}

  // static commentPost = (req: Request, res: Response) => {}

  // static deleteComment = (req: Request, res: Response) => {}

  // static editComment = (req: Request, res: Response) => {}



}