import { UserModel } from "../Repository/user.model";
import { saveRefreshToken, getRefreshToken, deleteRefreshToken } from "../services/redis.Service";
import { sendVerificationEmail } from "../services/email.Service";
import { getTempUser, deleteTempUser, saveTempUser} from "../services/redis.Service";
import jwt from "jsonwebtoken";
import { string } from "zod";

interface registerForm {
    username: string;
    email: string;
    password: string;
}

const jwtSecret = process.env.JWT_SECRET as string
export default class Auth {

    static Maketoken(registerBody: registerForm,expiresIn:number): string {
        const token = jwt.sign(registerBody, jwtSecret, { expiresIn: expiresIn });
        return token;
    }
}
