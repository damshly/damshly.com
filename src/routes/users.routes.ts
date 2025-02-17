import { Router } from "express";
import { getUser} from "../controllers/users.controller";

const router = Router();

// router.get("/", getUsers);
router.get("/followers", getUser);
router.get("/following", getUser);
router.get("/discover", getUser);
router.get("/search", getUser);
router.post("/follow", getUser);
router.post("/unfollow", getUser);


export default router;
