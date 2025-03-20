import { Router } from "express";
import { AccountsController } from "../controllers/accounts.controller";
import { authentication } from "../middleware/Authentication/user";
import { userValidation } from "../middleware/validation/user";
import {upload} from "../middleware/upload/profilePicture"
const router = Router();

router.get("/",authentication.checkJwt,AccountsController.getAccount)
router.put("/",authentication.checkJwt,userValidation.profileData,AccountsController.updateAccount)
router.put("/profilepecture",authentication.checkJwt,upload.single("profile_picture"),AccountsController.updateAccount)
export default router;