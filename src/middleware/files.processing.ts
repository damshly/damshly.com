import { Request, Response, NextFunction } from "express";
// import { number } from "zod";

export const processFiles = (req: Request, res: Response, next: NextFunction) => {
    if (req.files) {
        // console.log(req.body.metadata);

        let metadata = [];

        try {
            // نتأكد إن كان metadata هو array
            metadata = Array.isArray(req.body.metadata)
                ? req.body.metadata.map((item: string) => JSON.parse(item))
                : JSON.parse(req.body.metadata || "[]"); // في حالة كانت JSON string وليس array
        } catch (error) {
            console.error("❌ Metadata parsing error:", error);
            res.status(400).json({ error: "Invalid metadata format" });
            return 
        }

        (req.files as any[]).forEach((file, index) => {
            file.metadata = metadata[index] || {};
            // console.log(file); // طباعة بيانات الملف مع metadata
        });

        next();
    } else {
        next();
    }
};
