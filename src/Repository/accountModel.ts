import pool from "../config/database";

interface User {
    id: number;
    username: string;
    email: string;
    first_name : string;
    last_name : string;
    date_of_birth : Date;
    bio : string;
    updated_at: Date;
    status : string;
    account_type : string;
    is_verified : boolean;
    profile_picture : string;
    location : string;
}

export class Account{
    static byId = async (id: number) => {
        const { rows } = await pool.query<User>(
            "SELECT id, username, email, first_name, last_name, date_of_birth, bio, updated_at, status, account_type, is_verified, profile_picture, location FROM users WHERE id = $1",
            [id]
        );
        return rows[0];
    };

    static async update(columns: Partial<User>, id: number) {

        const allowedKeys = new Set([
            "username",
            "first_name",
            "last_name",
            "date_of_birth",
            "bio",
            "profile_picture",
            "location"
        ]);

        const keys: string[] = [];
        const values: any[] = [];

       
        Object.entries(columns).forEach(([key, value], index) => {
            if (allowedKeys.has(key)) {
                keys.push(`${key} = $${keys.length + 1}`);
                values.push(value);
            }
        });

        
        if (keys.length === 0) {
            throw new Error("error in sent data");
        }
        
       
        const query = `
            UPDATE users 
            SET ${keys.join(", ")}
            WHERE id = $${values.length + 1} 
            RETURNING *;
        `;
        
        
        await pool.query<User>(query, [...values, id]);
        const { rows } = await pool.query<User>(
            "SELECT id, username, email, first_name, last_name, date_of_birth, bio, updated_at, status, account_type, is_verified, profile_picture, location FROM users WHERE id = $1",
            [id]
        );
        
        return rows[0]; 
    }

}