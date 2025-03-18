import { Request, Response } from "express";
import { Account } from "../Repository/accountModel"
import dotenv from "dotenv";
dotenv.config();

const appUrl = process.env.APP_URL;
const minioEndpoint = process.env.MINIO_ENDPOINT;
const minioPort = process.env.MINIO_PORT;
export class AccountsController {
    static getAccount = async (req: Request, res: Response) => {
        const id :number = (req as any).user.id;
        const account = await Account.byId( id);

        
        res.status(200).json(account)
    };

    static updateAccount = async (req: Request, res: Response) => {
        const id = (req as any).user?.id;
        if (!id) {
            res.status(400).json({ error: "❌ يجب إرسال ID المستخدم" });
            return 
        } 

        if(req.file){
            const fileLocation = (req.file as any).location;
            req.body.data = { ...req.body.data, profile_picture: fileLocation };
            
        }
                
        const account = await Account.update(req.body.data, id);
        res.status(200).json(account)
    };


    
}