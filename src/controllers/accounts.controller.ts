import { Request, Response } from "express";
import { Account } from "../models/accountModel"

export class AccountsController {
    static getAccount = async (req: Request, res: Response) => {
        const id :number = req.body.Id;
        const account = await Account.byId( id);
        res.status(200).json(account)
    };

    static updateAccount = async (req: Request, res: Response) => {
        const id :number = req.body.Id;
        const account = await Account.update(req.body, id);
        res.status(200).json(account)
    };
}