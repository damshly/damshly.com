import { Router } from "express";
import { AccountsController } from "../controllers/accounts.controller";
const router = Router();

router.get("/",AccountsController.getAccount)
router.put("/",AccountsController.updateAccount)

export default router;