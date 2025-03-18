"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPost = void 0;
const processPost = (req, res, next) => {
    const { files, body } = req;
    let texts = [];
    try {
        texts = Array.isArray(body.texts)
            ? body.texts
                .filter((item) => typeof item === "string" && item.trim()) // نتأكد إنها نصوص + غير فارغة
                .map((item, index) => {
                try {
                    // نتأكد من إزالة أي مشاكل متعلقة بالأسطر الجديدة أو الأحرف الغريبة
                    const safeItem = item.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                    const parsed = JSON.parse(safeItem);
                    return Object.assign(Object.assign({}, parsed), { type: 'text' });
                }
                catch (error) {
                    console.error(`❌ Error parsing item at index ${index}:`, safeItem);
                    throw error;
                }
            })
            : JSON.parse(body.texts || "[]");
    }
    catch (error) {
        console.error("❌ Error parsing texts:", error);
        res.status(400).json({ error: "Invalid text data format" });
        return;
    }
    // console.log(texts); // تأكد إن كل شيء صحيح
    let media = [];
    if (files) {
        try {
            media = files.map(file => ({
                title: file.metadata.title,
                description: file.metadata.description,
                so: Number(file.metadata.so),
                type: 'media',
                location: file.location,
                caption: file.metadata.caption,
                mimeType: file.mimetype // ✅ إضافة نوع الملف
            }));
        }
        catch (error) {
            console.error("❌ Error processing media:", error);
            res.status(400).json({ error: "Invalid media format" });
            return;
        }
    }
    const sections = [...texts, ...media].sort((a, b) => a.so - b.so);
    sections.forEach(section => {
        if (section.type === 'text') {
            // console.log("📝 Text section:", section);
        }
        else if (section.type === 'media') {
            // console.log("🖼️ Media section:", section);
        }
    });
    req.body.sections = sections;
    next();
    // res.json({ success: true, message: "✅ Sections processed successfully", sections });
};
exports.processPost = processPost;
