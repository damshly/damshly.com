import { Request, Response } from "express";

// جلب جميع المقالات
export const getPosts = (req: Request, res: Response) => {
  res.json([{ id: 1, title: "First Post" }, { id: 2, title: "Second Post" }]);
};

// جلب مقال محدد
export const getPostById = (req: Request, res: Response) => {
  const postId = req.params.id;
  res.json({ id: postId, title: `Post ${postId}` });
};
