import { NextFunction,Request,Response } from "express";
import z from "zod";
import jwt from "jsonwebtoken";
const registerSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8)
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})
export class AuthValidation {
    public static validateRegister = (req: Request, res: Response, next: NextFunction) => {
        const { username, email, password } = req.body;
    
        if (!username || !email || !password) {
            res.status(400).json({ error: "Invalid data. Please correct your input." });
            return 
        }
    
        const result = registerSchema.safeParse({ username, email, password });
    
        if (!result.success) {
            res.status(400).json({ error: result.error.errors});
            return 
        }
        next();
    };

    static validateLogin = (req: Request, res: Response, next: NextFunction) => {
        const { email, password } : { email: string, password: string } = req.body;
    
        if (!email || !password) {
            res.status(400).json({ error: "Invalid credentials" });
            return 
        }
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            res.status(400).json({ error: result.error.errors});
            return 
        }
        next();
    };

    static checkJwt = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
            (req as any).user = { id: decoded.id }; // قم بتخزينه في `req.user`
        } catch (error) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        next();
    };
    


    static checkRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(403).json({ message: "Refresh token required" });
        return
    }

    // إذا كان التوكن موجودًا، نمرر التحكم للدالة التالية
    next();
};

}
