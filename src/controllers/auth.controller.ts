import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getTempUser, deleteTempUser, saveTempUser} from "../services/redis.Service";
import { sendVerificationEmail } from "../services/email.Service";
import { UserService } from "../services/user.Service";
interface registerBody {
    username: string;
    email: string;
    password: string;
}

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
         res.status(400).json({ error: "Invalid data. Please correct your input." });
    }

    const token = jwt.sign({ username, email, password }, process.env.JWT_SECRET as string, {
        expiresIn: "15m",
    });

    // حفظ بيانات المستخدم مؤقتًا في Redis
    await saveTempUser(token, { username, email, password }, 15 * 60); // 14 دقيقة

    // إرسال إيميل التحقق
    const emailResult = await sendVerificationEmail(email, token);

    if (!emailResult.success) {
         res.status(500).json({ error: "Failed to send verification email." });
    }

    res.status(200).json({ message: "Verification email sent. Please check your inbox." });
};

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
         res.status(400).json({ error: "Invalid token." });
         return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as {
            username: string;
            email: string;
            password: string;
        };

        // التحقق من وجود بيانات المستخدم في Redis
        const userData = await getTempUser(token);
        console.log(userData);
        
        if (!userData) {
             res.status(400).json({ error: "Invalid or expired token." });
        }

        // حفظ المستخدم في PostgreSQL عبر UserService
        const user = await UserService.registerUser(decoded.username, decoded.email, decoded.password);

        // حذف المستخدم من Redis بعد التسجيل الناجح
        await deleteTempUser(token);

        res.status(201).json({
            message: "Email verified successfully. User registered!",
            user,
        });
    } catch (error) {
        console.error("Error verifying token:", error);
         res.status(400).json({ error: "Invalid or expired token." });
    }
};

export const login = (req: Request, res: Response) => {}

export const logout = (req: Request, res: Response) => {}

export const refresh = (req: Request, res: Response) => {}