import { Request, Response, NextFunction } from "express";
import { number } from "zod";

export const processFiles = (req: Request, res: Response, next: NextFunction) => {
    if (req.files) {
        let files={
            images : number,
            videos : number,
            documents : number
        }
    
        // البيانات الإضافية (metadata)
        const metadata = JSON.parse(req.body.metadata || "[]");
        
        (req.files as any[]).forEach((file, index) => {
            // إضافة metadata لكل ملف
            file.metadata = metadata[index] || {};
            console.log(file); // طباعة بيانات الملف مع metadata
        });
        next();
    } else {
        next();
    }
}
