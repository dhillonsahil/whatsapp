import { Router } from "express";
import { checkUser, getALLUsers } from "../controllers/AuthController.js";
import { onBoardUser } from "../controllers/AuthController.js";


const router = Router()
router.post("/check-user",checkUser)
router.get("/get-contacts",getALLUsers)
router.post("/onboard-user",onBoardUser)
export default router;