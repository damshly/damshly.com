import { Request, Response, NextFunction } from "express";

type Section = {
    type: string;
    content: string;
    metadata: {
        description: string,
        [key: string]: any
    },
    description: string;
};
const typeMapping: { [key: string]: string } = {
    "png": "image/file",
    "jpg": "image/file",
    "jpeg": "image/file",
    "webp": "image/file",
    "mp4": "video/file",
    "mkv": "video/file",
    "webm": "video/file",
    "pdf": "document/file",
    "doc": "document/file",
    "docx": "document/file"
};
export const formatpostections = (req: Request, res: Response, next: NextFunction) => {
    try {

        
        if (!req.body.sections || !Array.isArray(req.body.sections)) {
            res.status(400).json({ error: "❌ البيانات غير صحيحة، يجب إرسال مصفوفة الأقسام" });
            return 
        }
        // console.log(req.body.sections);
        
        req.body.sections = req.body.sections.map((section: Section) => {
            try {
                // التأكد من أن metadata كائن وليس نصًا
                if (typeof section.metadata === "string") {
                    section.metadata = JSON.parse(section.metadata);
                }
            } catch (error) {
                console.error("❌ خطأ أثناء تحليل metadata:", error);
                section.metadata = { description: "" }; // تجنب حدوث كود معطل إذا كان parsing فاشلاً
            }
            const match = section.description.match(/^(\d+)\s*-\s*(.*)$/);
            if (!match) {
                return null; // في حالة عدم تطابق الوصف، يتم تجاهل القسم
            }

            const sectionOrder = parseInt(match[1], 10); // استخراج رقم القسم
            const descriptionText = match[2].trim(); // استخراج النص بعد رقم القسم

            // استخراج امتداد الملف إن وجد
            let type = section.type;
            if (section.type === "file") {
                const fileExtension = section.content.split(".").pop()?.toLowerCase();
                type = fileExtension && typeMapping[fileExtension] ? typeMapping[fileExtension] : "unknown/file";
            }
            delete req.body.descriptions;
            delete req.body.metadatas;
            delete req.body.texts;
               
            return {
                type,
                content: section.content,
                metadata: {
                    ...section.metadata,
                    description: descriptionText.replace(/^"SO\d+\s*/, "").replace(/"$/, ""), // إزالة "SO{رقم} " وأي علامات اقتباس زائدة
                },
                section_order: sectionOrder,
            };
        }).filter(Boolean); // إزالة القيم `null` إن وجدت
        
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "❌ خطأ أثناء معالجة البيانات" });
    }
};
