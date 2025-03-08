import { Router } from "express";
import { AccountsController } from "../controllers/accounts.controller";
import { AuthValidation } from "../middleware/auth.validation";
import { AccountValidation } from "../middleware/account.validation";
import {upload} from "../middleware/uploadProfilePicture"
const router = Router();

router.get("/",AuthValidation.checkJwt,AccountsController.getAccount)
router.put("/",AuthValidation.checkJwt,AccountValidation.validateUserData,AccountsController.updateAccount)
router.put("/profilepecture",AuthValidation.checkJwt,upload.single("profile_picture"),AccountsController.updateAccount)
export default router;