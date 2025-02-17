import { Request, Response } from "express";
import { getUserData } from "../services/user.Service";
// جلب مستخدم محدد
export const getUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await getUserData("id", userId);
  res.json(user);
};