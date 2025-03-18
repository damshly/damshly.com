import pool from "../config/database";
import bcrypt from "bcryptjs";
interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
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


export class getUser{
    static byId = async (id : number) => {
        const { rows } = await pool.query<User>("SELECT * FROM users WHERE id = $1", [id]);
        return rows;
    }
    
    
    static byEmail = async (email : string) => {
        const { rows } = await pool.query<User>("SELECT * FROM users WHERE email = $1", [email]);
        return rows;
    }
    
    static byUsername = async (username : string) => {
        const { rows } = await pool.query<User>("SELECT * FROM users WHERE username = $1", [username]);
        return rows;
    }

}


export class UserModel {
  
    static async createUser(user: Partial<User>) {
        const { username, email, password_hash } = user;

        if (!password_hash) {
            throw new Error("❌ enter the password");
        }
    
 
        const saltRounds = 10;
        user.password_hash = await bcrypt.hash(password_hash, saltRounds);

        const { rows } = await pool.query(
            `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email`,
            [username, email, user.password_hash]
        );

        return rows[0]; 
    }

 
    static async checkPassword(email: string, password: string) {
        const user = await getUser.byEmail(email);
        if (!user) return false;
        const { password_hash } = user[0];
        const isMatch = await bcrypt.compare(password, password_hash);
        return isMatch ? user : false; 
    }
}
