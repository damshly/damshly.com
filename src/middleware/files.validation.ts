import { Request, Response, NextFunction } from "express";

export const validatePostData = (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.files) {
            {res.status(400).json({ error: "❌ لم يتم رفع أي ملف" });}  
            return 
        }  
        console.log(req.files);
        
        const { descriptions, texts ,metadatas} = req.body;
        
        // التحقق من وجود بيانات
        if (!descriptions && !req.files && !texts && !metadatas) {
            res.status(400).json({ error: "❌ البيانات غير مكتملة، الرجاء إرسال نصوص أو ملفات مع الوصف" });
            return;
        }

        // استخراج الملفات من `req.files`
        const uploadedFiles = req.files
            ? Array.isArray(req.files)
                ? (req.files as Express.MulterS3.File[]).map(file => ({ type: "file", content: file.location }))
                : (Object.values(req.files).flat() as Express.MulterS3.File[]).map(file => ({ type: "file", content: file.location }))
            : [];

        // التأكد من أن `descriptions` هو مصفوفة
        const descriptionsArray = descriptions ? (Array.isArray(descriptions) ? descriptions : [descriptions]) : [];
        const metadatasArray = metadatas ? (Array.isArray(metadatas) ? metadatas : [metadatas]) : [];
        // console.log(metadatasArray);
        

        // استخراج النصوص وإضافتها إلى نفس المصفوفة
        const textEntries = texts
            ? (Array.isArray(texts) ? texts : [texts]).map(text => ({ type: "text", content: text }))
            : [];
        // console.log(metadatasArray[1] + "metadatasArray[1]");
        
        // ربط الملفات والنصوص مع أوصافها
        req.body.sections = [...uploadedFiles, ...textEntries].map((entry, index) => {
            const description = descriptionsArray[index] || "";
            
            let metadataObj;
            try {
                metadataObj = metadatasArray[index] ? JSON.parse(metadatasArray[index]) : {}; 
            } catch (e) {
                console.error("❌ خطأ في تحليل metadata:", e);
                metadataObj = {};
            }
        
            return {
                type: entry.type,
                content: entry.content,
                metadata: { 
                    ...metadataObj,
                    description: description 
                },
                description: `${index + 1} - ${description}`,
            };
        });
        
        // console.log(req.body.sections + "from validatePostData");

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "❌ خطأ أثناء معالجة البيانات" });
    }
};
