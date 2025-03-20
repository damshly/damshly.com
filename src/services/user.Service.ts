import e from "express";
import { getUser ,UserModel } from "../Repository/user.model";


export const getUserData = async (type: "id" | "email" | "username", value: string | number) => {
    switch (type) {
        case "id":
            return await getUser.byId(value as number);
        case "email":
            return await getUser.byEmail(value as string);
        case "username":
            return await getUser.byUsername(value as string);
        default:
            throw new Error("Invalid search type");
    }
};



export class UserService {
    static async registerUser(username: string, email: string, password_hash: string) {
        
        try {
            const createdUser = await UserModel.createUser({
                username,
                email,
                password_hash
            });
            return createdUser;
            
        } catch (error: any) {
            if (error.code === "23505") { 
                if (error.detail.includes("email")) {
                    throw { status: 409, message: "This email is already registered." };
                } else if (error.detail.includes("username")) {
                    throw { status: 409, message: "This username is already taken." };
                }
            }
            throw { status: 500, message: "An unexpected error occurred." };
        }
        // Create new user
    }
}
