import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();
const authController = new AuthController();

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);

export default router;
