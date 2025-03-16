import { Request, Response, NextFunction } from "express";

interface SectionBase {
    title: string;
    description: string;
    so: number;
}

interface TextSection extends SectionBase {
    type: 'text';
    content: string;
}

interface MediaSection extends SectionBase {
    type: 'media';
    location: string;
    caption?: string;
}

type Section = TextSection | MediaSection;

export const processPost = (req: Request, res: Response, next: NextFunction) => {
    const { files, body } = req;
    let texts = [];
    try {
        texts = Array.isArray(body.texts)
        ? body.texts
              .filter((item: string) => typeof item === "string" && item.trim()) // نتأكد إنها نصوص + غير فارغة
              .map((item: string, index: number) => {
                  try {
                      // نتأكد من إزالة أي مشاكل متعلقة بالأسطر الجديدة أو الأحرف الغريبة
                      const safeItem = item.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                      const parsed = JSON.parse(safeItem);
                      return { ...parsed, type: 'text' };
                    } catch (error) {
                      console.error(`❌ Error parsing item at index ${index}:`, safeItem);
                      throw error;
                  }
              })
        : JSON.parse(body.texts || "[]");
    
    } catch (error) {
        console.error("❌ Error parsing texts:", error);
        res.status(400).json({ error: "Invalid text data format" });
        return 
    }
    
    // console.log(texts); // تأكد إن كل شيء صحيح
    

    let media: MediaSection[] = [];
    if (files) {
        try {
            media = (files as any[]).map(file => ({
                title: file.metadata.title,
                description: file.metadata.description,
                so: Number(file.metadata.so),
                type: 'media',
                location: file.location,
                caption: file.metadata.caption,
                mimeType: file.mimetype // ✅ إضافة نوع الملف
            }));
            
        } catch (error) {
            console.error("❌ Error processing media:", error);
            res.status(400).json({ error: "Invalid media format" });
            return 
        }
    }

    const sections: Section[] = [...texts, ...media].sort((a, b) => a.so - b.so);

    sections.forEach(section => {
        if (section.type === 'text') {
            // console.log("📝 Text section:", section);
        } else if (section.type === 'media') {
            // console.log("🖼️ Media section:", section);
        }
    });
    req.body.sections = sections
    next()
    // res.json({ success: true, message: "✅ Sections processed successfully", sections });
};
