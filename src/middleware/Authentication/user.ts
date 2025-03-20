import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";




export class authentication {


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
            (req as any).user = { id: decoded.id }; 
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

   
    next();
};

}
