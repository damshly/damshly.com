import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getTempUser, deleteTempUser, saveTempUser} from "../services/redis.Service";
import { sendVerificationEmail } from "../services/email.Service";
import { UserService } from "../services/user.Service";
import { UserModel } from "../Repository/user.model";
import { saveRefreshToken, getRefreshToken, deleteRefreshToken } from "../services/redis.Service";
import Auth from "../services/auth.Service"

export class auth{
    static register = async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
    
        const token = Auth.Maketoken({ username, email, password },15 *60)
    
        await saveTempUser(token, { username, email, password }, 15 * 60); 
         
        const emailResult = await sendVerificationEmail(email, token);
    
        if (!emailResult.success) {
             res.status(500).json({ error: "Failed to send verification email." });
        }
    
        res.status(200).json({ message: "Verification email sent. Please check your inbox." });
    };
    
    static verifyEmail = async (req: Request, res: Response) => {
        const { token } = req.query;
    
        if (!token || typeof token !== "string") {
            res.status(400).json({ error: "Invalid token." });
            return 
        }
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
                username: string;
                email: string;
                password: string;
            };
    
            const userData = await getTempUser(token);
            if (!userData) {
                res.status(400).json({ error: "Invalid or expired token." });
            }
    
            const user = await UserService.registerUser(decoded.username, decoded.email, decoded.password);
            await deleteTempUser(token);
    
            const accessToken = jwt.sign({ id: user.id, role: user.account_type }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
            const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
    
            const refreshTokenId = await saveRefreshToken(user.id, refreshToken);
    
            res.cookie("refreshToken", refreshTokenId, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
    
            res.status(201).json({
                message: "Email verified successfully. User registered!",
                user,
                accessToken
            });
        } catch (error: any) {
            console.error("Error verifying email:", error);
            res.status(error.status || 500).json({ error: error.message || "Something went wrong." });
        }
    };
    
    
    static login = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body;
            const user = await UserModel.checkPassword(email, password);
    
            if (!user) {
                res.status(401).json({ message: "Invalid credentials" });
                return 
            }
    
            const accessToken = jwt.sign({ id: user[0].id, role: user[0].account_type }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
            const refreshToken = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
    
            const refreshTokenId = await saveRefreshToken(user[0].id, refreshToken);
    
            res.cookie("refreshToken", refreshTokenId, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
    
            console.log("Sending response...");
            res.status(200).json({ user: user[0], accessToken, message: "successful" });
        } catch (error) {
            console.error("Error in login function:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
    
    
    static logout = async (req: Request, res: Response) => {
        const refreshTokenId = req.cookies.refreshToken;
    
        if (refreshTokenId) {
            await deleteRefreshToken(refreshTokenId);
        }
    
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
    
        res.status(200).json({ message: "Logged out successfully" });
    };
    
    
    static refreshToken = async (req: Request, res: Response) => {
        const refreshTokenId = req.cookies.refreshToken; 
        
        const tokenData = await getRefreshToken(refreshTokenId);
        if (!tokenData) {
            res.status(403).json({ message: "Invalid refresh token" });
            return 
        }
    
        const newAccessToken = jwt.sign({ id: tokenData.userId }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
    
        res.status(200).json({ accessToken: newAccessToken });
    };
    
    
}

