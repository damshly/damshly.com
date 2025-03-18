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
        // Check if user already exists
        const existingUser = await getUser.byEmail(email);
        // if (existingUser) {
        //     throw new Error("User already exists.");
        // }

        // Create new user
        return await UserModel.createUser({
            username,
            email,
            password_hash
        });
    }

}
