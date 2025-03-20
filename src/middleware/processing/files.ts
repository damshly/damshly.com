import { Request, Response, NextFunction } from "express";


export const processFiles = (req: Request, res: Response, next: NextFunction) => {
    if (req.files) {
       

        let metadata = [];

        try {
       
            
            metadata = Array.isArray(req.body.metadata)
                ? req.body.metadata.map((item: string) => JSON.parse(item))
                : JSON.parse(req.body.metadata || "[]"); 
        } catch (error) {
            console.error("❌ Metadata parsing error:", error);
            res.status(400).json({ error: "Invalid metadata format" });
            return 
        }

        (req.files as any[]).forEach((file, index) => {
            file.metadata = metadata[index] || {};
           
        });

        next();
    } else {
        next();
    }
};
