-- 🟢 جدول المنشورات
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,               -- معرف فريد للمنشور
    user_id INT NOT NULL,                -- معرف المستخدم المنشئ
    title VARCHAR(255) NOT NULL,         -- عنوان المنشور
    description TEXT,                    -- وصف المنشور
    visibility VARCHAR(10) CHECK (visibility IN ('public', 'private')) DEFAULT 'public', -- حالة الظهور
    created_at TIMESTAMP DEFAULT NOW(),  -- تاريخ الإنشاء
    updated_at TIMESTAMP DEFAULT NOW()   -- آخر تحديث
);

-- 🟢 جدول الأقسام (محتوى المنشورات)
CREATE TABLE post_sections (
    id SERIAL PRIMARY KEY,               -- معرف فريد للقسم
    post_id INT NOT NULL,                -- معرف المنشور الذي ينتمي إليه القسم
    section_order INT NOT NULL,          -- ترتيب القسم داخل المنشور
    type VARCHAR(50) CHECK (type IN ('text', 'image', 'video', 'code', 'link','ducument')), -- نوع القسم
    content TEXT NOT NULL,               -- محتوى القسم (نص، رابط صورة، كود برمجي...)
    metadata JSONB DEFAULT '{}'::jsonb,  -- بيانات إضافية (مثلا لغة البرمجة إذا كان كود)
    created_at TIMESTAMP DEFAULT NOW()   -- تاريخ الإضافة
);

-- 🟢 العلاقات بين الجداول
ALTER TABLE posts ADD CONSTRAINT fk_posts_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE post_sections ADD CONSTRAINT fk_post_sections_posts FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

-- 🟢 الفهارس لتحسين الأداء
CREATE INDEX idx_posts_user_id ON posts(user_id);         -- لتحسين البحث حسب المستخدم
CREATE INDEX idx_posts_created_at ON posts(created_at DESC); -- لتحسين ترتيب المنشورات حسب التاريخ
CREATE INDEX idx_posts_visibility ON posts(visibility);   -- لتحسين البحث عن المنشورات العامة
CREATE INDEX idx_post_sections_post_id ON post_sections(post_id); -- لتسريع البحث عن أقسام المنشور
CREATE INDEX idx_post_sections_order ON post_sections(post_id, section_order); -- لتسريع ترتيب الأقسام
