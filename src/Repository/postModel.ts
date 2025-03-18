import pool from "../config/database";


interface Post {
    id: number;
    user_id: number;
    title: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

interface section {
    id: number;
    post_id: number;
    section_type : string;
    title: string;
    description: string;
    position : number;
}

interface text_section {
    section_id: number;
    content: string;
}

interface media_section {
    id : number;
    section_id: number;
    media_url : string;
    caption : string;
    media_type : string;
}

export class postQuerys {
    static async createPost(user_id: number, title: string, description: string) {
        const { rows } = await pool.query<Post>(
            "INSERT INTO posts (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
            [user_id, title, description]
        );
        return rows[0];
    }

    static async addSection(post_id: number, section_type: string, title: string, description: string, position: number) {
        const sectionValues = [post_id, section_type, title, description, position];

        const { rows } = await pool.query<section>(
            `INSERT INTO sections (post_id, section_type, title, description, position)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,  // ✅ حتى نعيد القسم المُضاف
            sectionValues  // ✅ تمرير مصفوفة مسطحة (صحيحة)
        );
        
        return rows[0];
    }
    static async addTextSection(section_id: number, content: string) {
        const { rows } = await pool.query<text_section>(
            "INSERT INTO text_sections (section_id, content) VALUES ($1, $2) RETURNING *",
            [section_id, content]
        );
        return rows[0];
    }    

    static async addMediaSection(section_id: number, media_url: string, caption: string, media_type: string) {
        const { rows } = await pool.query<media_section>(
            "INSERT INTO media_sections (section_id, media_url, caption, media_type) VALUES ($1, $2, $3, $4) RETURNING *",
            [section_id, media_url, caption, media_type]
        );
        return rows[0];
    }

    static async getPostById(post_id: number) {
        const { rows } = await pool.query<Post>(
            "SELECT * FROM posts WHERE id = $1",
            [post_id]
        );
        return rows[0];
    }
    static async getSectionsByPostId(post_id: number) {
        const { rows } = await pool.query<section>(
            "SELECT * FROM sections WHERE post_id = $1",
            [post_id]
        );
        return rows;
    }
    static async getTextSectionBySectionId(section_id: number) {
        const { rows } = await pool.query<text_section>(
            "SELECT * FROM text_sections WHERE section_id = $1",
            [section_id]
        );
        return rows[0];
    }
    static async getMediaSectionBySectionId(section_id: number) {
        const { rows } = await pool.query<media_section>(
            "SELECT * FROM media_sections WHERE section_id = $1",
            [section_id]
        );
        return rows[0];
    }

}
