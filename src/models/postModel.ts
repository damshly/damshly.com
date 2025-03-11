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
    created_at: Date;
    updated_at: Date;
}

interface text_section {
    id: number;
    section_id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
}

interface media_section {
    id : number;
    section_id: number;
    media_url : string;
    caption : string;
    media_type : string;
    created_at: Date;
    updated_at: Date;
}

export class PostQuerys {
    static async createPost(user_id: number, title: string, description: string) {
        const { rows } = await pool.query<Post>(
            "INSERT INTO posts (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
            [user_id, title, description]
        );
        return rows[0];
    }

    static async addSections(post_id: number, sections: section[]) {
        const sectionValues = sections.map((section) => [
            post_id,
            section.section_type,
            section.title,
            section.description,
            section.position,
        ]);
    
        const { rowCount } = await pool.query(
            `INSERT INTO sections (post_id, section_type, title, description, position)
            VALUES ${sectionValues.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(', ')}`,
            sectionValues.flat()
        );
    
        return rowCount;
    }
    
    static async addTextSection(section_id: number, content: string) {
        if (!content || content.trim().length === 0) {
            throw new Error("Content cannot be empty");
        }
    
        const { rowCount } = await pool.query(
            "INSERT INTO text_sections (section_id, content) VALUES ($1, $2)",
            [section_id, content]
        );
    
        return rowCount;
    }
    
}
