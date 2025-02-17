import pool from "../config/database";
import bcrypt from "bcrypt";
interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    first_name : string;
    last_name : string;
    date_of_birth : Date;
    bio : string;
    updatedAt: Date;
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

export class updateUser {
    static update = async (id: number, data: Partial<User>) => {
        // list of allowed fields
        const allowedFields = new Set<keyof User>([
            "first_name", "last_name", "date_of_birth", "bio", 
            "profile_picture", "location"
        ]);

        // extract the invalid fields
        const invalidFields = Object.keys(data).filter((key) => !allowedFields.has(key as keyof User));

        // if there are invalid fields
        if (invalidFields.length > 0) {
            return {
                success: false,
                message: "you can't update these fields",
                invalidFields
            };
        }

        // filter the data to include only the allowed fields
        const filteredData: Partial<User> = {};
        for (const key in data) {
            if (allowedFields.has(key as keyof User)) {
                if (data[key as keyof User] !== undefined) {
                    filteredData[key as keyof User] = data[key as keyof User] as any;
                }
            }
        }

        // if there are no valid data to update
        if (Object.keys(filteredData).length === 0) {
            return {
                success: false,
                message: "no valid data to update"
            };
        }

        // create dynamic query
        const fields = Object.keys(filteredData).map((key, index) => `${key} = $${index + 1}`).join(", ");
        const values = Object.values(filteredData);

        // add the id to the values
        values.push(id);
        const query = `UPDATE users SET ${fields}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;

        const { rows } = await pool.query(query, values);
        return {
            success: true,
            message: "User updated successfully",
            user: rows[0]
        };
    };
}

export class UserModel {
    // ✅ دالة لإنشاء مستخدم جديد مع تخزين كلمة المرور مجزأة
    static async createUser(user: Partial<User>) {
        const { username, email, password_hash } = user;

        if (!password_hash) {
            throw new Error("❌ يجب إدخال كلمة مرور");
        }
    
        // 🔹 تجزئة كلمة المرور قبل الحفظ
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password_hash, saltRounds);

        const { rows } = await pool.query(
            `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email`,
            [username, email, hashedPassword]
        );

        return rows[0]; // إرجاع المستخدم الذي تم إنشاؤه
    }

    // ✅ دالة لجلب المستخدم عن طريق الإيميل
    static async getUserByEmail(email: string) {
        const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return rows[0] || null;
    }

    // ✅ دالة لجلب المستخدم عن طريق اسم المستخدم
    static async getUserByUsername(username: string) {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        return rows[0] || null;
    }

    // ✅ دالة للتحقق من كلمة المرور عند تسجيل الدخول
    static async checkPassword(email: string, password: string) {
        const user = await UserModel.getUserByEmail(email);
        if (!user) return false; // المستخدم غير موجود

        const isMatch = await bcrypt.compare(password, user.password_hash);
        return isMatch ? user : false; // إرجاع المستخدم إذا كانت كلمة المرور صحيحة
    }
}
