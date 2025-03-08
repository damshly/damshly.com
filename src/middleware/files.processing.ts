import { Request, Response, NextFunction } from "express";

export const processFiles = (req: Request, res: Response, next: NextFunction) => {
    if (req.files) {
    
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
