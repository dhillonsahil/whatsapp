import { Router } from "express";
import { checkUser, generateToken, getALLUsers } from "../controllers/AuthController.js";
import { onBoardUser } from "../controllers/AuthController.js";


const router = Router()
router.post("/check-user",checkUser)
router.get("/get-contacts",getALLUsers)
router.post("/onboard-user",onBoardUser)
router.get("/generate-token/:userId",generateToken)
export default router;