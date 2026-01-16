import { Router } from "express";
import { getUserProfile, googleLogin } from "../controller/auth-controller";
import { authenticate } from "../middleware/auth-middleware";

const router = Router();

router.route("/google").get(googleLogin);
router.get("/profile", authenticate, getUserProfile);

export default router;
