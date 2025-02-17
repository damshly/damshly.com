import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedId  = jwt.verify(token, process.env.JWT_SECRET as string);
    req.body.id = Number(decodedId);
    next();
};