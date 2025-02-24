import pool from "../config/database";



export class PostModel {
    static async createPost(user_id: number, title: string, description: string, visibility: string) {
        const client = await pool.connect();
        try {
            // تنظيف القيمة لضمان أنها تتطابق مع القيد CHECK
            const validVisibility = visibility === 'private' ? 'private' : 'public';
    
            const postQuery = `
                INSERT INTO posts (user_id, title, description, visibility)
                VALUES ($1, $2, $3, $4)
                RETURNING id;
            `;
            const result = await client.query(postQuery, [user_id, title, description, validVisibility]);
            return result.rows[0].id;
        } finally {
            client.release();
        }
    }
    

    static async addSections(post_id: number, sections: { section_order: number, type: string, content: string, metadata?: any }[]) {
        const client = await pool.connect();
        try {
            const sectionQuery = `
                INSERT INTO post_sections (post_id, section_order, type, content, metadata)
                VALUES ($1, $2, $3, $4, $5);
            `;
    
            for (const section of sections) {
                // التأكد من أن `metadata` كائن JSON صالح، وإلا سيتم تعيين `{}` كافتراضي
                const metadata = section.metadata ? JSON.stringify(section.metadata) : JSON.stringify({});
                await client.query(sectionQuery, [post_id, section.section_order, section.type, section.content, metadata]);
            }
        } finally {
            client.release();
        }
    }

    static async getPostById(post_id: number) {
        const client = await pool.connect();
        try {
          const query = `SELECT * FROM posts WHERE id = $1`;
          const result = await client.query(query, [post_id]);
          return result.rows[0] || null;
        } finally {
          client.release();
        }
      }
    
      static async getPostSections(post_id: number) {
        const client = await pool.connect();
        try {
          const query = `SELECT section_order, type, content, metadata FROM post_sections WHERE post_id = $1 ORDER BY section_order`;
          const result = await client.query(query, [post_id]);
          return result.rows;
        } finally {
          client.release();
        }
      }

      static async getAllPosts() {
        try {
          const query = "SELECT id, user_id, title, description, visibility, created_at FROM posts ORDER BY created_at DESC";
          const { rows } = await pool.query(query);
          return rows;
        } catch (error) {
          console.error("❌ خطأ أثناء جلب جميع المنشورات:", error);
          throw error;
        }
      }
      
      
    
}
